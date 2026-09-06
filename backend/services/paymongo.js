const axios = require('axios');

const BASE_URL = 'https://api.paymongo.com/v1';

/**
 * Basic-auth headers for the PayMongo REST API.
 * Uses the secret key from the environment — never hardcoded, never logged.
 */
function getAuthHeaders() {
  const token = Buffer.from(`${process.env.PAYMONGO_SECRET_KEY}:`).toString('base64');
  return {
    Authorization: `Basic ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
}

/**
 * Create a QR Ph payment for an order using the PaymentIntent flow.
 *
 * PayMongo's Sources API does NOT support `qrph`. The correct flow is:
 *   1. POST /payment_intents      (payment_method_allowed: ['qrph'], capture_type: automatic)
 *   2. POST /payment_methods      (type: 'qrph' + billing)
 *   3. POST /payment_intents/:id/attach
 * The attach response carries the QR image as a base64 data URI at
 * attributes.next_action.code.image_url. Settlement arrives via the
 * `payment.paid` webhook (joined back on payment_intent_id).
 *
 * @param {Object} params
 * @param {number} params.amountPeso - Order total in PHP pesos (NOT centavos). From order.totalAmount.
 * @param {string} params.orderId    - MongoDB Order _id as a string (used in the description).
 * @param {Object} params.billing    - { name, email, phone, addressLine } for the payment method.
 * @returns {Promise<{ paymentIntentId: string, paymentMethodId: string, clientKey: string,
 *                      status: string, qrCodeImageUrl: (string|null) }>}
 * @throws {Error} Propagates the axios error on any non-2xx response. Caller must handle.
 */
async function createQRPhPayment({ amountPeso, orderId, billing = {} }) {
  const amountCentavos = Math.round(amountPeso * 100);

  // 1. Payment Intent
  const piRes = await axios.post(
    `${BASE_URL}/payment_intents`,
    {
      data: {
        attributes: {
          amount: amountCentavos,
          currency: 'PHP',
          capture_type: 'automatic',
          description: `Buffs Chicken Order #${orderId}`,
          payment_method_allowed: ['qrph'],
        },
      },
    },
    { headers: getAuthHeaders() }
  );
  const pi = piRes.data.data;

  // 2. Payment Method (type: qrph)
  const pmRes = await axios.post(
    `${BASE_URL}/payment_methods`,
    {
      data: {
        attributes: {
          type: 'qrph',
          billing: {
            name: billing.name || 'Buffs Chicken Customer',
            email: billing.email || process.env.EMAIL_USER,
            phone: billing.phone || '0000000000',
            address: {
              line1: billing.addressLine || 'N/A',
              city: 'Manila',
              state: 'Metro Manila',
              postal_code: '1000',
              country: 'PH',
            },
          },
        },
      },
    },
    { headers: getAuthHeaders() }
  );
  const pm = pmRes.data.data;

  // 3. Attach
  const attachRes = await axios.post(
    `${BASE_URL}/payment_intents/${pi.id}/attach`,
    {
      data: {
        attributes: {
          payment_method: pm.id,
          return_url: `${process.env.FRONTEND_URL}/order-status?orderId=${orderId}`,
        },
      },
    },
    { headers: getAuthHeaders() }
  );
  const attached = attachRes.data.data;

  const code = attached.attributes.next_action?.code || {};
  return {
    paymentIntentId: pi.id,
    paymentMethodId: pm.id,
    clientKey: pi.attributes.client_key,
    status: attached.attributes.status, // 'awaiting_next_action' | 'processing' | 'succeeded' | ...
    qrCodeImageUrl: code.image_url || null,
    // test_url is only present when livemode is false — used to simulate payment
    // without scanning a real QR or moving real money.
    testUrl: code.test_url || null,
    liveMode: attached.attributes.livemode === true,
  };
}

/**
 * Fetch a PaymentIntent (with its payments array) — used to reconcile order state
 * when a webhook may have been missed.
 * @param {string} paymentIntentId
 * @returns {Promise<Object>} PaymentIntent resource ({ id, attributes: { status, payments, ... } })
 */
async function getPaymentIntent(paymentIntentId) {
  const { data } = await axios.get(`${BASE_URL}/payment_intents/${paymentIntentId}`, {
    headers: getAuthHeaders(),
  });
  return data.data;
}

module.exports = { createQRPhPayment, getPaymentIntent };
