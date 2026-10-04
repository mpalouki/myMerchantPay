import { API_BASE_URL } from '../../data/site.js';

// Code samples of the public API documentation (/docs) and the home page. Illustrative: the
// merchant payment API isn't public yet, and keys shown are placeholders, never real credentials.

const SANDBOX = API_BASE_URL.sandbox;

export const CODE_SAMPLES = {
  createPayment: `curl -X POST ${SANDBOX}/payments \\
  -H "Authorization: Bearer sk_test_YOUR_PRIVATE_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 25000,
    "currency": "XOF",
    "country": "SN",
    "method": "WAVE_SENEGAL",
    "customer": { "phone": "+221770000000" },
    "reference": "CMD-10482",
    "ipn_url": "https://example.com/webhooks/mymerchantpay"
  }'`,

  paymentResponse: `{
  "id": "pay_8f2c1a7e",
  "status": "pending",
  "amount": 25000,
  "currency": "XOF",
  "country": "SN",
  "method": "WAVE_SENEGAL",
  "reference": "CMD-10482",
  "created_at": "2026-10-04T09:12:44Z"
}`,

  getPayment: `curl ${SANDBOX}/payments/pay_8f2c1a7e \\
  -H "Authorization: Bearer sk_test_YOUR_PRIVATE_KEY"`,

  createPayout: `curl -X POST ${SANDBOX}/payouts \\
  -H "Authorization: Bearer sk_test_YOUR_PRIVATE_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 40000,
    "currency": "XOF",
    "country": "BJ",
    "method": "MTN_BENIN",
    "beneficiary": { "phone": "+22990000000", "name": "Koffi A." },
    "reference": "PAYOUT-2210"
  }'`,

  ipnPayload: `POST https://example.com/webhooks/mymerchantpay
X-MMP-Signature: t=1759569164,v1=5f1c0b…

{
  "event": "payment.succeeded",
  "data": {
    "id": "pay_8f2c1a7e",
    "status": "succeeded",
    "amount": 25000,
    "currency": "XOF",
    "reference": "CMD-10482"
  }
}`,

  verifySignature: `// Node.js — reject any notification whose signature doesn't match.
import crypto from 'node:crypto';

function isValidSignature(rawBody, header, privateKey) {
  const { t, v1 } = Object.fromEntries(header.split(',').map((p) => p.split('=')));
  const expected = crypto
    .createHmac('sha256', privateKey)
    .update(\`\${t}.\${rawBody}\`)
    .digest('hex');
  const fresh = Math.abs(Date.now() / 1000 - Number(t)) < 300;
  return fresh && v1?.length === expected.length
    && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(v1));
}`,

  error: `{
  "error": {
    "code": "insufficient_balance",
    "message": "The account balance is too low for this payout.",
    "field": null
  }
}`,
};
