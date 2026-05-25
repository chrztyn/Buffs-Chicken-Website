const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@buffschicken.com';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatVariants(selectedVariants) {
  if (!selectedVariants) return '';
  const obj =
    selectedVariants instanceof Map
      ? Object.fromEntries(selectedVariants)
      : typeof selectedVariants.toObject === 'function'
      ? selectedVariants.toObject()
      : selectedVariants;
  const entries = Object.entries(obj).filter(([, v]) => v);
  if (!entries.length) return '';
  return entries.map(([k, v]) => `${k}: ${v}`).join(', ');
}

function buildItemRows(items) {
  return items
    .map((item) => {
      const variantsText = formatVariants(item.selectedVariants);
      const saucesText = (item.selectedSauces || []).map((s) => s.name).join(', ');
      const addonsText = (item.selectedAddons || []).map((a) => a.name).join(', ');
      const notesText = item.notes || item.specialInstructions || '';

      const metaLines = [
        variantsText ? `<span style="color:#555;font-size:12px;">Variant: ${variantsText}</span>` : '',
        saucesText ? `<span style="color:#555;font-size:12px;">Sauces: ${saucesText}</span>` : '',
        addonsText ? `<span style="color:#555;font-size:12px;"> ${addonsText}</span>` : '',
        notesText
          ? `<span style="color:#92400e;font-size:12px;font-style:italic;">Note: ${notesText}</span>`
          : '',
      ]
        .filter(Boolean)
        .join('<br>');

      return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e8dfc8;vertical-align:top;display:flex;align-items:flex-start;">
            <div>
              <strong style="font-family:Arial,sans-serif;font-size:14px;color:#1A4189;display:block;margin-bottom:4px;">
                ${item.productName} &times; ${item.quantity}
              </strong>
              ${metaLines ? `<div style="line-height:1.4;">${metaLines}</div>` : ''}
            </div>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #e8dfc8;text-align:right;vertical-align:top;white-space:nowrap;">
            <strong style="font-family:Arial,sans-serif;font-size:14px;color:#1A4189;">
              &#8369;${Number(item.itemTotal).toFixed(2)}
            </strong>
          </td>
        </tr>`;
    })
    .join('');
}

// ─── sendOrderReceipt ─────────────────────────────────────────────────────────

/**
 * Sends a branded HTML receipt email to the customer.
 * Never throws — logs errors silently so the order flow is never affected.
 *
 * @param {object} order  - Saved Mongoose Order document
 * @param {object} user   - Matching Mongoose User document
 */
async function sendOrderReceipt(order, user) {
  try {
    const orderNumber = order.orderNumber || String(order._id);
    const subtotal = Number(order.subtotal || 0).toFixed(2);
    const total = Number(order.totalAmount || 0).toFixed(2);
    const deliveryAddress = order.deliveryAddress || 'N/A';
    const trackingUrl = `https://buffschicken.com/order-status?order=${encodeURIComponent(orderNumber)}`;

    const paymentMethodMap = {
      gcash: 'GCash',
      maya: 'Maya',
      maribank: 'Maribank',
      bpi: 'BPI',
    };
    const paymentMethodDisplay =
      paymentMethodMap[order.paymentMethod] || order.paymentMethod || 'GCash';

    const itemRowsHtml = buildItemRows(order.items || []);

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Buffs Chicken Order Receipt</title>
</head>
<body style="margin:0;padding:0;background-color:#f0e8d5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background-color:#f0e8d5;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
          style="max-width:600px;background-color:#FBF4E5;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- ─── HEADER ────────────────────────────────────────────── -->
          <tr>
            <td style="background-color:#FE601C;padding:28px 32px;text-align:center;">
              <p style="margin:0 0 4px 0;font-size:11px;letter-spacing:2px;color:rgba(255,255,255,0.8);text-transform:uppercase;">
                Food Ordering
              </p>
              <h1 style="margin:0;font-family:Arial,sans-serif;font-size:32px;font-weight:900;
                color:#ffffff;letter-spacing:-1px;">
                Buffs Chicken
              </h1>
              <p style="margin:6px 0 0 0;font-size:12px;color:rgba(255,255,255,0.85);">
                The Hood, Angeles City, Pampanga
              </p>
            </td>
          </tr>

          <!-- ─── CONFIRMATION MESSAGE ──────────────────────────────── -->
          <tr>
            <td style="padding:28px 32px 8px 32px;text-align:center;background-color:#FBF4E5;">
              <h2 style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:22px;
                font-weight:800;color:#1A4189;">
                Your order has been confirmed!
              </h2>
              <p style="margin:0;font-size:14px;color:#555;">
                Hi <strong>${user.name}</strong>, thank you for ordering from Buffs Chicken.
                We&rsquo;re getting your food ready!
              </p>
            </td>
          </tr>

          <!-- ─── ORDER NUMBER ──────────────────────────────────────── -->
          <tr>
            <td style="padding:16px 32px 24px 32px;text-align:center;">
              <div style="display:inline-block;background-color:#1A4189;
                border-radius:8px;padding:12px 28px;">
                <p style="margin:0 0 2px 0;font-size:11px;color:rgba(255,255,255,0.75);
                  text-transform:uppercase;letter-spacing:1.5px;">Order Number</p>
                <p style="margin:0;font-family:Arial,sans-serif;font-size:20px;
                  font-weight:900;color:#FEB90E;letter-spacing:1px;">
                  ${orderNumber}
                </p>
              </div>
            </td>
          </tr>

          <!-- ─── DIVIDER ───────────────────────────────────────────── -->
          <tr>
            <td style="padding:0 32px;">
              <hr style="border:none;border-top:2px solid #e8dfc8;margin:0;">
            </td>
          </tr>

          <!-- ─── ORDER ITEMS ───────────────────────────────────────── -->
          <tr>
            <td style="padding:20px 32px 0 32px;">
              <p style="margin:0 0 12px 0;font-family:Arial,sans-serif;font-size:13px;
                font-weight:700;color:#FE601C;text-transform:uppercase;letter-spacing:1px;">
                Your Order
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <thead>
                  <tr>
                    <th style="text-align:left;font-size:12px;color:#888;
                      text-transform:uppercase;letter-spacing:1px;padding-bottom:8px;
                      border-bottom:2px solid #e8dfc8;">Item</th>
                    <th style="text-align:right;font-size:12px;color:#888;
                      text-transform:uppercase;letter-spacing:1px;padding-bottom:8px;
                      border-bottom:2px solid #e8dfc8;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRowsHtml}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- ─── PRICING SUMMARY ───────────────────────────────────── -->
          <tr>
            <td style="padding:16px 32px 24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:4px 0;font-size:13px;color:#555;">Subtotal</td>
                  <td style="padding:4px 0;font-size:13px;color:#555;text-align:right;">
                    &#8369;${subtotal}
                  </td>
                </tr>
                ${order.voucher?.code ? `
                <tr>
                  <td style="padding:4px 0;font-size:13px;color:#16a34a;">
                    Voucher (${order.voucher.code})
                  </td>
                  <td style="padding:4px 0;font-size:13px;color:#16a34a;text-align:right;">
                    &minus;&#8369;${Number(order.voucher.discountAmount || 0).toFixed(2)}
                  </td>
                </tr>` : ''}
                <tr>
                  <td style="padding:10px 0 4px 0;border-top:2px solid #e8dfc8;">
                    <strong style="font-family:Arial,sans-serif;font-size:16px;color:#1A4189;">
                      Total
                    </strong>
                  </td>
                  <td style="padding:10px 0 4px 0;border-top:2px solid #e8dfc8;text-align:right;">
                    <strong style="font-family:Arial,sans-serif;font-size:16px;color:#1A4189;">
                      &#8369;${total}
                    </strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ─── DIVIDER ───────────────────────────────────────────── -->
          <tr>
            <td style="padding:0 32px;">
              <hr style="border:none;border-top:2px solid #e8dfc8;margin:0;">
            </td>
          </tr>

          <!-- ─── DELIVERY ADDRESS ──────────────────────────────────── -->
          <tr>
            <td style="padding:20px 32px 0 32px;">
              <p style="margin:0 0 6px 0;font-family:Arial,sans-serif;font-size:13px;
                font-weight:700;color:#FE601C;text-transform:uppercase;letter-spacing:1px;">
                Delivery Address
              </p>
              <p style="margin:0;font-size:14px;color:#333;line-height:1.6;">
                ${deliveryAddress}
              </p>
            </td>
          </tr>

          <!-- ─── PAYMENT METHOD ────────────────────────────────────── -->
          <tr>
            <td style="padding:16px 32px 24px 32px;">
              <p style="margin:0 0 6px 0;font-family:Arial,sans-serif;font-size:13px;
                font-weight:700;color:#FE601C;text-transform:uppercase;letter-spacing:1px;">
                Payment Method
              </p>
              <p style="margin:0;font-size:14px;color:#333;">
                Paid via ${paymentMethodDisplay}
              </p>
            </td>
          </tr>

          <!-- ─── SPECIAL INSTRUCTIONS ─────────────────────────────── -->
          ${order.notes ? `
          <tr>
            <td style="padding:16px 32px 24px 32px;">
              <p style="margin:0 0 6px 0;font-family:Arial,sans-serif;font-size:13px;
                font-weight:700;color:#FE601C;text-transform:uppercase;letter-spacing:1px;">
                Special Instructions
              </p>
              <p style="margin:0;font-size:14px;color:#333;line-height:1.6;
                background:#fff8ee;padding:12px;border-radius:6px;border-left:3px solid #FE601C;">
                ${order.notes}
              </p>
            </td>
          </tr>` : ''}

          <!-- ─── CTA BUTTON ────────────────────────────────────────── -->
          <tr>
            <td style="padding:0 32px 32px 32px;text-align:center;">
              <a href="${trackingUrl}"
                style="display:inline-block;background-color:#FE601C;color:#ffffff;
                  font-family:Arial,sans-serif;font-size:15px;font-weight:700;
                  text-decoration:none;padding:14px 32px;border-radius:8px;
                  letter-spacing:0.5px;">
                Track Your Order &rarr;
              </a>
            </td>
          </tr>

          <!-- ─── FOOTER ────────────────────────────────────────────── -->
          <tr>
            <td style="background-color:#1A4189;padding:20px 32px;text-align:center;">
              <p style="margin:0 0 6px 0;font-family:Arial,sans-serif;font-size:14px;
                font-weight:700;color:#FEB90E;">
                Thank you for ordering from Buffs Chicken!
              </p>
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.7);">
                The Hood, Angeles City, Pampanga
              </p>
              <p style="margin:8px 0 0 0;font-size:11px;color:rgba(255,255,255,0.5);">
                This is an automated receipt. Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
      from: FROM_EMAIL,
      to: user.email,
      subject: `Your Buffs Chicken Order ${orderNumber} is confirmed!`,
      html,
    });

    console.log(`[sendOrderReceipt] Receipt sent to ${user.email} for order ${orderNumber}`);
  } catch (err) {
    // Never propagate — receipt failure must not break the order flow
    console.error('[sendOrderReceipt] Failed to send receipt email:', err);
  }
}

module.exports = { sendOrderReceipt };