# DELIVERY-FEATURES-PLAN.md — Sticky Banner + Distance-Based Delivery Fee

**Branch:** `fix/prod-bugs`
**Status:** PLANNING ONLY — no code written. Awaiting approval.
**Store origin (confirmed):** lat `15.1437`, lng `120.5932`

Decisions locked in with user before this plan was written:
- 5–8km band: always ₱35 flat fee (free delivery never applies there, regardless of subtotal).
- >8km block enforced at pin-drop (`LocationPickerModal`), before the order can be confirmed — plus a server-side re-check at submit (defense in depth).
- ₱350 free-delivery threshold is measured against **pre-voucher subtotal**.
- Sticky "We're Open" banner: **menu page only** (it doesn't render anywhere else today).

---

## 0. Why this is 3 plans, not 1

Feature 1 is a 15-minute CSS change to one file. Features 2 and 3 are the same feature — "distance-based delivery pricing" — described from two angles (the fee schedule, and the hard service boundary). They share one new computation engine and touch the checkout flow, the Order model, and the payment amount that PayMongo bills. That combined engine is the real work here; splitting them into "feature 2" and "feature 3" separately would just mean building the same haversine/fee logic twice.

Verified against current code (not assumed):
- No delivery fee, distance, or store-coordinate logic exists anywhere in the codebase today.
- There is no pickup/delivery order-type toggle — **every order is a delivery order** with a mandatory map pin (`Order.deliveryLocation.lat/lng`), already built and working (`LocationPickerModal.vue` → `OrderConfirmModal.vue` → `POST /api/orders/submit`).
- `subtotal`/`total` are computed once in `Cart.vue` and passed as **static props** into `OrderConfirmModal.vue`. The location pin is chosen *inside* `OrderConfirmModal`, after those props are already fixed. This ordering is the crux of the implementation — delivery fee can't be known until the pin is dropped, so the displayed total must become reactive to the pin, not just to the cart.
- Backend currently trusts the frontend's `total` for the happy path (`orders.js:429`, `// Use the discounted total from frontend`) and only recomputes server-side if the voucher turns out invalid (`orders.js:513`). This is a pre-existing trust gap, **out of scope to fix generally**, but the new delivery fee must NOT extend that gap — it is computed and enforced server-side authoritatively, same posture as `backend/CLAUDE.md` rule 10 for payment amounts.

---

## Feature 1 — Sticky "We're Open" banner

**Scope:** `frontend/pages/menu.vue` only. No backend, no other pages (per decision).

**Current state:** the banner (`v-if="storeStatus"` block, ~line 30-72) sits between `<Navbar/>` and the mobile-only `sticky top-0 z-30` search bar. It's not sticky — it scrolls away, while the search bar below it sticks to `top: 0`.

**Change:**
- Wrap the banner + the existing mobile sticky search bar in one container: `sticky top-0 z-40` on the wrapper (banner) so it stacks above the mobile bar's `z-30`, OR simpler — make the banner itself `sticky top-0 z-40` and it will naturally sit above the mobile bar in the stacking/scroll order since it comes first in DOM and mobile bar is `lg:hidden` (only visible when banner's `sticky` region is also active). Verify on both breakpoints:
  - **Mobile/tablet (`<lg`)**: banner sticks at `top:0`; the mobile search+category bar (already sticky) will stick directly beneath the banner's rendered height — needs its own `top` offset (e.g. `top-[<banner-height>]` via a CSS var, since Tailwind can't compute a dynamic px offset from the banner's collapsible height). Simplest robust fix: **don't stack two independent stickies** — instead give the *mobile sticky bar* a `top` equal to the banner's current height, tracked via a `ref` + `ResizeObserver` on the banner (banner height changes when "View Hours" is expanded). This avoids the classic double-sticky overlap bug.
  - **Desktop (`≥lg`)**: mobile bar is hidden, so the banner alone becomes the only sticky top element — straightforward.
- Respect `prefers-reduced-motion` (existing `animate-pulse` dot) — no change needed, already CSS-only.
- Collapsed "View Hours" panel expanding while sticky: acceptable — sticky elements can grow; just confirm it doesn't visually clip against the navbar above (it won't, navbar isn't sticky, it scrolls off first).

**Files touched:** `frontend/pages/menu.vue` only (template classes + a small `ResizeObserver`/ref for the offset).

**Risk:** low. **Effort:** ~30-45 min incl. manual check at 375/768/1280px.

**Acceptance criteria:**
- [ ] Scrolling the menu page keeps the open/closed banner pinned at the top at 375px, 768px, 1280px.
- [ ] Expanding "View Hours" while scrolled doesn't overlap or clip the mobile search bar.
- [ ] Banner still updates live if `storeStatus` changes (unchanged existing polling/fetch logic).

---

## Features 2 & 3 — Distance-based delivery fee + service radius (combined engine)

### 2.1 Business rules (final, as confirmed)

| Distance from store | Subtotal (pre-voucher) | Delivery fee |
|---|---|---|
| 0 – 5km | ≥ ₱350 | **FREE** |
| 0 – 5km | < ₱350 | ₱35 flat — show "Add ₱N to get free delivery!" |
| 5 – 8km | any | ₱35 flat (never free) |
| > 8km | any | **Blocked** — "Sorry, this location is not yet covered by our delivery service." |

`N = max(0, 350 − subtotal)`, only shown when distance ≤ 5km.

### 2.2 Shared constants (new, both sides)

Backend — extend `backend/constants/delivery.js`:
```js
const STORE_LOCATION = { lat: 15.1437, lng: 120.5932 };
const DELIVERY_FEE_PESOS = 35;
const FREE_DELIVERY_RADIUS_KM = 5;
const MAX_DELIVERY_RADIUS_KM = 8;
const FREE_DELIVERY_MIN_SUBTOTAL = 350;
```

Frontend — new `frontend/constants/delivery.ts` mirroring the same 5 values (frontend and backend are separate packages, no shared workspace today — duplication is consistent with how `constants/` is already split FE/BE in this repo). Comment in both files cross-referencing the other, so a future change to one is caught in review.

### 2.3 New shared logic

- **Backend:** `backend/services/deliveryFee.js` (new) — `getDistanceKm(lat1,lng1,lat2,lng2)` (haversine) + `computeDeliveryFee(subtotalPesos, distanceKm)` → `{ fee, isFree, isOutOfRange }`. Kept separate from `services/deliveryLocation.js` (which only validates pin *shape*/PH bounds, not business radius — preserves that file's existing scope).
- **Frontend:** `frontend/composables/useDeliveryFee.ts` (new) — same haversine + `computeDeliveryFee`, so the fee/prompt/block can be computed live as the customer drags the pin, with zero network round-trips. Formula and constants must stay numerically identical to the backend (defense-in-depth check happens server-side regardless, so a frontend/backend drift would surface as a submit-time rejection, not a silent bug).

### 2.4 Backend — `routes/orders.js` `POST /submit`

After `normalizedLocation` is validated (~line 410):
```js
const distanceKm = getDistanceKm(STORE_LOCATION.lat, STORE_LOCATION.lng, normalizedLocation.lat, normalizedLocation.lng);
if (distanceKm > MAX_DELIVERY_RADIUS_KM) {
  return res.status(400).json({
    success: false,
    message: 'Sorry, this location is not yet covered by our delivery service.',
    outOfDeliveryRange: true
  });
}
const { fee: deliveryFee } = computeDeliveryFee(subtotal, distanceKm);
```
- Add `deliveryFee` to the `new Order({...})` construction (~line 432).
- Fix `totalAmount` at both existing computation points to include it:
  - Line 429: `const totalAmount = total;` → still trust frontend `total` (pre-existing pattern, out of scope to change generally) but this value **must already include** `deliveryFee` from the frontend calc — see §2.6. No backend formula change here beyond storing `deliveryFee` alongside.
  - Line 513 (invalid-voucher fallback): `order.totalAmount = subtotal + tax` → `order.totalAmount = subtotal + tax + deliveryFee`.
- This is the authoritative amount PayMongo QR PH bills (`order.totalAmount`, `backend/CLAUDE.md` rule 10) — no separate QR-PH-specific change needed, it inherits automatically.

### 2.5 Backend — `models/Order.js`

Add `deliveryFee: { type: Number, default: 0 }` next to `subtotal`/`totalAmount` (~line 46-51).

### 2.6 Frontend — `OrderConfirmModal.vue` (the real integration point)

This is where distance becomes known (pin lives here) and where the displayed total must react to it — `subtotal`/`total` arrive as static props from `Cart.vue`, computed *before* the pin exists.

- Import `useDeliveryFee` composable.
- `distanceKm = computed(() => formData.location?.lat ? getDistanceKm(STORE, formData.location) : null)`.
- `deliveryFee = computed(() => distanceKm.value == null ? null : computeDeliveryFee(props.subtotal, distanceKm.value).fee)`.
- `grandTotal = computed(() => props.total + (deliveryFee.value || 0))` — replaces the bare `props.total` in:
  - Summary line (~line 69, `{{ total.toFixed(2) }}`) → show subtotal, a new "Delivery Fee" line (₱35 / **FREE**), then grand total.
  - Submit payload (~line 600, 640): send `total: grandTotal.value` and a new `deliveryFee: deliveryFee.value` field for the backend to store/cross-check.
- **Free-delivery prompt:** below the summary, `v-if="distanceKm !== null && distanceKm <= 5 && props.subtotal < 350"` → `Add ₱{{ (350 - props.subtotal).toFixed(2) }} more to get FREE delivery!`
- **5-8km info line (nice-to-have, non-blocking):** `v-else-if="distanceKm > 5 && distanceKm <= 8"` → small note that the ₱35 fee applies outside the free zone. Not required by the spec but avoids the "why isn't this free" support question; flagged as optional, skip if time-boxed.
- **Out-of-range guard:** if `distanceKm > 8` somehow reaches this modal (e.g. stale prop, race), disable "Confirm Order" and show the same "not yet covered" message — belt-and-suspenders under the primary block in §2.7.

### 2.7 Frontend — `LocationPickerModal.vue` (primary >8km block, per decision)

- Compute `distanceKm` reactively from `pin.value` using the same composable.
- When `distanceKm > 8`: disable the "Use This Location" button (`.lpm-confirm:disabled` styling already exists) and show inline text in the footer: *"Sorry, this location is not yet covered by our delivery service."* — replacing/alongside the resolved-address line.
- When `distanceKm` is 5-8 or 0-5, no block, just lets `confirm()` proceed as today (fee display happens one step later, in `OrderConfirmModal`, §2.6).

### 2.8 Display — read-only surfaces

Small, low-risk additions so the new money field isn't invisible after the order is placed:
- `frontend/pages/order-status.vue` — show "Delivery Fee: ₱35 / FREE" line using `order.deliveryFee`.
- `frontend/pages/admin/orders.vue` — same, in the order detail view, next to the existing `DeliveryLocationPanel`.
- Both are additive `v-if` lines next to existing subtotal/total rows — no restructuring.

### 2.9 Explicitly out of scope

- No pickup option — doesn't exist today, not requested.
- No routing-distance (roads) API — haversine straight-line only, consistent with the "zero added cost" constraint already established for the pin-location feature (`delivery-pin-location` memory).
- Not fixing the pre-existing frontend-trusted-`total` pattern beyond what's needed to make delivery fee authoritative — that's a separate hardening task (flag to user as a follow-up candidate, not bundled here).
- `reorder` prefill endpoint (`orders.js` ~line 342) continues to display legacy stored totals from the original order; a real re-submit still goes through `POST /submit` and gets the fee recomputed fresh. No special-casing added.

### 2.10 Files touched (2 & 3 combined)

**Backend:** `constants/delivery.js`, `services/deliveryFee.js` (new), `models/Order.js`, `routes/orders.js`.
**Frontend:** `constants/delivery.ts` (new), `composables/useDeliveryFee.ts` (new), `components/OrderConfirmModal.vue`, `components/LocationPickerModal.vue`, `pages/order-status.vue`, `pages/admin/orders.vue`.

**Risk:** medium — touches the payment-amount path that PayMongo QR PH bills from. Must retest QR PH end-to-end (amount shown on the QR = subtotal + fee) after this change, not just COD.
**Effort estimate:** 4-6 hours incl. backend service/tests, frontend composable, two-modal integration, display lines, and full retest of both COD and QR PH checkout with a near pin, a 5-8km pin, and an >8km pin.

**Acceptance criteria:**
- [ ] Pin < 5km, subtotal ≥ ₱350 → fee = ₱0, shown as FREE.
- [ ] Pin < 5km, subtotal < ₱350 → fee = ₱35, "Add ₱N to get free delivery" shown with correct N.
- [ ] Pin 5-8km, any subtotal → fee = ₱35 always, no free-delivery prompt.
- [ ] Pin > 8km → blocked in `LocationPickerModal` before confirm; if bypassed, `POST /submit` rejects with `outOfDeliveryRange: true` and the order is NOT created.
- [ ] `order.totalAmount` (and the PayMongo QR PH billed amount) includes the delivery fee in every case above.
- [ ] `order.deliveryFee` stored and visible on `order-status.vue` and `admin/orders.vue`.
- [ ] Voucher + delivery fee interaction verified: `grandTotal = (subtotal − voucherDiscount) + deliveryFee` — fee is computed after the voucher discount is applied and is never itself discounted.

---

## Voucher/delivery-fee interaction (confirmed)

- **Free-delivery eligibility** (`subtotal ≥ ₱350`) checks the **pre-voucher subtotal** — a voucher doesn't help or hurt whether a customer qualifies for free delivery.
- **The fee amount itself is applied after the voucher discount**: `grandTotal = (subtotal − voucherDiscount) + deliveryFee`. The ₱35 fee is a flat add-on to the already-discounted total, never itself reduced by the voucher.
- This is exactly `§2.6`'s `grandTotal = computed(() => props.total + (deliveryFee.value || 0))`, since `props.total` (from `Cart.vue`) is already `subtotal − voucherDiscount`. No change needed to the planned formula — this section just records the confirmation so it isn't re-litigated mid-build.
- Backend mirror: `orders.js:429` (`totalAmount = total`, frontend already includes the fee) and the invalid-voucher fallback at line 513 becomes `order.totalAmount = subtotal + tax + deliveryFee` — i.e. if the voucher turns out invalid server-side, the discount is dropped but the delivery fee is still added on top of the full (undiscounted) subtotal, consistent with the same "fee applied last" rule.

## Suggested build order

1. Feature 1 (sticky banner) — isolated, ship independently, fastest win.
2. Backend: constants + `deliveryFee.js` service + `Order.js` field + `routes/orders.js` submit changes + a unit test per band (0-5/≥350, 0-5/<350, 5-8, >8).
3. Frontend: `useDeliveryFee.ts` composable (mirrors backend tests).
4. `LocationPickerModal.vue` block at >8km.
5. `OrderConfirmModal.vue` fee line + free-delivery prompt + payload wiring.
6. Display lines in `order-status.vue` / `admin/orders.vue`.
7. Full retest: COD near/mid/far pins, QR PH near/mid pin (confirm billed amount), Playwright E2E update for the new checkout total math.
