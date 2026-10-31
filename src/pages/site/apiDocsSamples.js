import { API_BASE_URL } from '../../data/site.js';

// Code samples of the public API documentation (/docs) and the home page. Illustrative: the
// merchant payment API isn't public yet, and keys shown are placeholders, never real credentials.
// REQUESTS holds each call in every language of the docs' code tabs (CODE_LANGUAGES).

const SANDBOX = API_BASE_URL.sandbox;
const KEY = 'sk_test_YOUR_PRIVATE_KEY';

export const CODE_LANGUAGES = [
  { key: 'curl', label: 'cURL' },
  { key: 'php', label: 'PHP' },
  { key: 'node', label: 'Node.js' },
  { key: 'python', label: 'Python' },
];

// One request in every language: `body` (an object) is sent as JSON when given, `headers` are
// extra request headers (e.g. Idempotency-Key).
function request(method, path, body, headers = {}) {
  const url = `${SANDBOX}${path}`;
  const extra = Object.entries(headers);
  const json = body ? JSON.stringify(body, null, 2) : null;
  const indent = (text, spaces) => text.replace(/\n/g, `\n${' '.repeat(spaces)}`);
  const phpArray = (value, depth = 1) => {
    const pad = '    '.repeat(depth);
    const entries = Object.entries(value).map(([k, v]) => {
      let rendered = JSON.stringify(v);
      if (v && typeof v === 'object') rendered = phpArray(v, depth + 1);
      else if (typeof v === 'string') rendered = `'${v.replace(/'/g, "\\'")}'`;
      return `${pad}'${k}' => ${rendered},`;
    });
    return `[\n${entries.join('\n')}\n${'    '.repeat(depth - 1)}]`;
  };
  const pythonDict = (value) =>
    JSON.stringify(value, null, 4)
      .replace(/\btrue\b/g, 'True')
      .replace(/\bfalse\b/g, 'False')
      .replace(/\bnull\b/g, 'None');

  return {
    curl: [
      `curl${method === 'GET' ? '' : ` -X ${method}`} ${url} \\`,
      `  -H "Authorization: Bearer ${KEY}"${json || extra.length ? ' \\' : ''}`,
      ...extra.map(([k, v], i) => `  -H "${k}: ${v}"${json || i < extra.length - 1 ? ' \\' : ''}`),
      ...(json ? ['  -H "Content-Type: application/json" \\', `  -d '${indent(json, 2)}'`] : []),
    ].join('\n'),

    php: `<?php
// composer require guzzlehttp/guzzle
$client = new GuzzleHttp\\Client();

$response = $client->request('${method}', '${url}', [
    'headers' => [
        'Authorization' => 'Bearer ' . getenv('TECKO_PRIVATE_KEY'),${extra.map(([k, v]) => `\n        '${k}' => '${v}',`).join('')}
    ],${body ? `\n    'json' => ${phpArray(body, 2)},` : ''}
]);

$${body ? 'result' : 'payment'} = json_decode($response->getBody(), true);`,

    node: `// Node.js 18+ (fetch is built in)
const response = await fetch('${url}', {
  method: '${method}',
  headers: {
    Authorization: \`Bearer \${process.env.TECKO_PRIVATE_KEY}\`,${extra.map(([k, v]) => `\n    '${k}': '${v}',`).join('')}${body ? "\n    'Content-Type': 'application/json'," : ''}
  },${body ? `\n  body: JSON.stringify(${indent(json, 2)}),` : ''}
});

const ${body ? 'result' : 'payment'} = await response.json();`,

    python: `# pip install requests
import os
import requests

response = requests.${method.toLowerCase()}(
    "${url}",
    headers={"Authorization": f"Bearer {os.environ['TECKO_PRIVATE_KEY']}"${extra.map(([k, v]) => `, "${k}": "${v}"`).join('')}},${body ? `\n    json=${indent(pythonDict(body), 4)},` : ''}
)

${body ? 'result' : 'payment'} = response.json()`,
  };
}

export const REQUESTS = {
  createPayment: request('POST', '/payin', {
    amount: 25000,
    currency: 'XOF',
    country: 'SN',
    method: 'WAVE_SN',
    customer: { phone: '+221770000000' },
    reference: 'CMD-10482',
    ipn_url: 'https://example.com/webhooks/payments',
  }),
  getPayment: request('GET', '/payin/PAY261004A3F09C21B7D4'),
  createPayout: request('POST', '/payout', {
    amount: 40000,
    currency: 'XOF',
    country: 'BJ',
    method: 'MTN_BJ',
    beneficiary: { phone: '+22990000000', name: 'Koffi A.' },
    reference: 'PAYOUT-2210',
  }),
  createIntent: request(
    'POST',
    '/payment_intents',
    {
      amount: 25000,
      currency: 'XOF',
      description: 'Commande #10482',
      reference: 'CMD-10482',
      customer: { name: 'Awa Diop', email: 'awa@example.com' },
      return_url: 'https://example.com/commande/10482/merci',
      metadata: { order_id: '10482' },
    },
    { 'Idempotency-Key': 'cmd-10482' },
  ),
  createSession: request('POST', '/checkout/sessions', {
    line_items: [
      { name: 'Sac en wax', unit_amount: 12500, quantity: 2, image_url: 'https://example.com/sac.jpg' },
      { name: 'Bracelet', unit_amount: 7500, quantity: 1 },
    ],
    success_url: 'https://example.com/merci?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://example.com/panier',
    client_reference_id: 'CMD-10482',
    metadata: { order_id: '10482' },
  }),
  listPayins: request('GET', '/payins?limit=20&starting_after=PAY261004A3F09C21B7D4'),
  createWebhook: request('POST', '/webhook_endpoints', {
    url: 'https://example.com/webhooks/gamapay',
    enabled_events: ['payment_intent.succeeded', 'payment_intent.payment_failed', 'payout.*'],
    description: 'Boutique en ligne',
  }),
  createTransfer: request('POST', '/transfer', {
    amount: 150000,
    currency: 'XOF',
    destination: 'BJ12 4500 8318 0637',
    reference: 'TRF-0318',
    description: 'Stock Cotonou',
  }),
};

export const CODE_SAMPLES = {
  // Also shown on the home page.
  createPayment: REQUESTS.createPayment.curl,

  paymentResponse: `{
  "id": "PAY261004A3F09C21B7D4",
  "object": "payin",
  "livemode": false,
  "status": "pending",
  "amount": 25000,
  "fee": 375,
  "currency": "XOF",
  "country": "SN",
  "method": "WAVE_SN",
  "reference": "CMD-10482",
  "customer": { "phone": "+221770000000" },
  "next_action": { "type": "redirect", "url": "https://pay.wave.com/c/cos-1x2y3z" },
  "created_at": "2026-10-04T09:12:44Z",
  "updated_at": "2026-10-04T09:12:44Z"
}`,

  getPaymentResponse: `{
  "id": "PAY261004A3F09C21B7D4",
  "object": "payin",
  "livemode": false,
  "status": "succeeded",
  "amount": 25000,
  "fee": 375,
  "currency": "XOF",
  "country": "SN",
  "method": "WAVE_SN",
  "reference": "CMD-10482",
  "customer": { "phone": "+221770000000" },
  "next_action": null,
  "created_at": "2026-10-04T09:12:44Z",
  "updated_at": "2026-10-04T09:13:20Z"
}`,

  payoutResponse: `{
  "id": "PAY261004C7E21B05F9A3",
  "object": "payout",
  "livemode": false,
  "status": "pending",
  "amount": 40000,
  "fee": 400,
  "currency": "XOF",
  "country": "BJ",
  "method": "MTN_BJ",
  "reference": "PAYOUT-2210",
  "beneficiary": { "phone": "+22990000000", "name": "Koffi A." },
  "created_at": "2026-10-04T10:02:11Z",
  "updated_at": "2026-10-04T10:02:11Z"
}`,

  transferResponse: `{
  "id": "PAY261004E5B83D17A260",
  "object": "transfer",
  "livemode": false,
  "status": "succeeded",
  "amount": 150000,
  "fee": 0,
  "currency": "XOF",
  "source": { "account_number": "SN47450083180112" },
  "destination": { "account_number": "BJ12450083180637", "amount": 150000, "currency": "XOF" },
  "exchange_rate": null,
  "reference": "TRF-0318",
  "description": "Stock Cotonou",
  "created_at": "2026-10-04T11:30:05Z"
}`,

  ipnPayload: `POST https://example.com/webhooks/payments
X-MMP-Signature: t=1759569164,v1=5f1c0b…

{
  "event": "payment.succeeded",
  "data": {
    "id": "PAY261004A3F09C21B7D4",
    "object": "payin",
    "livemode": false,
    "status": "succeeded",
    "amount": 25000,
    "fee": 375,
    "currency": "XOF",
    "country": "SN",
    "method": "WAVE_SN",
    "reference": "CMD-10482",
    "customer": { "phone": "+221770000000" },
    "next_action": null,
    "created_at": "2026-10-04T09:12:44Z",
    "updated_at": "2026-10-04T09:13:20Z"
  }
}`,

  error: `{
  "error": {
    "type": "payment_error",
    "code": "insufficient_balance",
    "message": "The account balance is too low for this payout (amount + fee).",
    "field": "amount",
    "request_id": "req_8f3a1c2e9b7d4a60"
  }
}`,

  sessionResponse: `{
  "id": "cs_4d1e9a7b3c5f2e8a0b6d1c9f7e3a5b2d",
  "object": "checkout.session",
  "livemode": false,
  "status": "open",
  "payment_status": "unpaid",
  "url": "https://api.tecko.com/pay/cs_4d1e9a7b3c5f2e8a0b6d1c9f7e3a5b2d",
  "amount_total": 32500,
  "currency": "XOF",
  "line_items": {
    "object": "list",
    "data": [
      { "id": "li_0a1b2c…", "object": "line_item", "name": "Sac en wax", "unit_amount": 12500, "quantity": 2, "amount_total": 25000, "…": "…" },
      { "id": "li_3d4e5f…", "object": "line_item", "name": "Bracelet", "unit_amount": 7500, "quantity": 1, "amount_total": 7500, "…": "…" }
    ],
    "has_more": false
  },
  "payment_intent": "pi_3f9c21b7d4a0e5c8b1f26d90",
  "client_reference_id": "CMD-10482",
  "success_url": "https://example.com/merci?session_id={CHECKOUT_SESSION_ID}",
  "cancel_url": "https://example.com/panier",
  "locale": "auto",
  "submit_type": "pay",
  "metadata": { "order_id": "10482" },
  "expires_at": "2026-10-05T09:12:44Z",
  "completed_at": null,
  "created_at": "2026-10-04T09:12:44Z"
}`,

  // Opening the hosted page from the merchant's site.
  openCheckout: `<!-- Your shop — npm install @gamapay/gamapay-js, or the <script> build -->
<button id="pay">Payer 32 500 FCFA</button>

<script type="module">
  import { openCheckout } from '@gamapay/gamapay-js';

  document.getElementById('pay').addEventListener('click', async () => {
    // Your server creates the session and answers { url }. Pass the request itself:
    // a new tab must open during the click.
    const session = fetch('/create-checkout-session', { method: 'POST' }).then((r) => r.json());

    const result = await openCheckout(session, { mode: 'modal' }); // 'modal' | 'tab' | 'redirect'
    // Paid in the modal: the browser goes to success_url (or pass onComplete).
    if (result.status === 'closed') console.log('Paiement abandonné');
  });
</script>`,

  checkoutRedirect: `// Your server (Node.js, Express) — the simplest way: a form posts here, the payer is redirected.
app.post('/create-checkout-session', async (req, res) => {
  const session = await gamapay.checkout.sessions.create({
    line_items: [{ name: 'Sac en wax', unit_amount: 12500, quantity: 2 }],
    success_url: 'https://example.com/merci?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://example.com/panier',
  });
  res.redirect(303, session.url);
});`,

  intentResponse: `{
  "id": "pi_3f9c21b7d4a0e5c8b1f26d90",
  "object": "payment_intent",
  "livemode": false,
  "status": "requires_payment_method",
  "amount": 25000,
  "currency": "XOF",
  "country": "SN",
  "client_secret": "pi_3f9c21b7d4a0e5c8b1f26d90_secret_9b1e…",
  "allowed_methods": [],
  "description": "Commande #10482",
  "next_action": null,
  "latest_payment": null,
  "last_payment_error": null,
  "return_url": "https://example.com/commande/10482/merci",
  "cancellation_reason": null,
  "expires_at": "2026-10-05T09:12:44Z",
  "created_at": "2026-10-04T09:12:44Z",
  "customer": { "name": "Awa Diop", "email": "awa@example.com" },
  "reference": "CMD-10482",
  "attempts": 0,
  "metadata": { "order_id": "10482" },
  "updated_at": "2026-10-04T09:12:44Z"
}`,

  paymentMethodsResponse: `{
  "object": "list",
  "data": [
    {
      "code": "WAVE_SN",
      "object": "payment_method",
      "type": "mobile_money",
      "name": "Wave Sénégal",
      "country": "SN",
      "requires_phone": true,
      "requires_otp": false,
      "otp_hint": null
    },
    {
      "code": "ORANGE_MONEY_CI",
      "object": "payment_method",
      "type": "mobile_money",
      "name": "Orange Money Côte d'Ivoire",
      "country": "CI",
      "requires_phone": true,
      "requires_otp": true,
      "otp_hint": "Composez le #144*82# pour obtenir votre code de paiement."
    },
    {
      "code": "CARD",
      "object": "payment_method",
      "type": "card",
      "name": "Carte bancaire",
      "country": null,
      "requires_phone": false,
      "requires_otp": false,
      "otp_hint": null
    }
  ],
  "countries": [
    { "code": "SN", "name": "Sénégal", "calling_code": "+221" },
    { "code": "CI", "name": "Côte d'Ivoire", "calling_code": "+225" }
  ],
  "default_country": "SN",
  "currency": "XOF",
  "amount": 25000
}`,

  listResponse: `{
  "object": "list",
  "data": [
    { "id": "PAY261003B81E4C90D2F7", "object": "payin", "status": "succeeded", "amount": 12000, "…": "…" },
    { "id": "PAY261003F02A7B3C61E5", "object": "payin", "status": "failed", "amount": 5000, "…": "…" }
  ],
  "has_more": true,
  "url": "/v1/payins"
}`,

  webhookResponse: `{
  "id": "we_5d2c8e1a7f3b9c04e6a1d7b2",
  "object": "webhook_endpoint",
  "livemode": false,
  "url": "https://example.com/webhooks/gamapay",
  "enabled_events": ["payment_intent.succeeded", "payment_intent.payment_failed", "payout.*"],
  "description": "Boutique en ligne",
  "status": "enabled",
  "created_at": "2026-10-04T08:00:00Z",
  "secret": "whsec_4b8e…"
}`,

  eventPayload: `POST https://example.com/webhooks/gamapay
GamaPay-Signature: t=1759569200,v1=9a41d3…

{
  "id": "evt_7c1e9a3f5b2d8e4a0c6f1b93",
  "object": "event",
  "type": "payment_intent.succeeded",
  "api_version": "2026-11-01",
  "livemode": false,
  "created_at": "2026-10-04T09:13:20Z",
  "data": {
    "object": {
      "id": "pi_3f9c21b7d4a0e5c8b1f26d90",
      "object": "payment_intent",
      "status": "succeeded",
      "amount": 25000,
      "currency": "XOF",
      "latest_payment": { "id": "PAY261004A3F09C21B7D4", "method": "WAVE_SN", "status": "succeeded" },
      "metadata": { "order_id": "10482" },
      "…": "…"
    }
  }
}`,

  // The checkout page with the browser SDK: your server creates the intent, the page confirms it.
  checkoutServer: `// Your server — npm install gamapay
import express from 'express';
import GamaPay from 'gamapay';

const gamapay = new GamaPay(process.env.GAMAPAY_SECRET_KEY); // sk_test_… / sk_live_…
const app = express();

app.post('/create-payment-intent', express.json(), async (req, res) => {
  const order = await findOrder(req.body.orderId); // the amount comes from your data, never from the page
  const intent = await gamapay.paymentIntents.create({
    amount: order.total,
    description: \`Commande #\${order.id}\`,
    metadata: { order_id: String(order.id) },
  });
  res.json({ clientSecret: intent.client_secret });
});`,

  checkoutPage: `<!-- Your checkout page — npm install @gamapay/gamapay-js -->
<form id="payment-form">
  <div id="payment-element"></div>
  <button type="submit">Payer</button>
  <p id="error" role="alert"></p>
</form>

<script type="module">
  import { loadGamaPay } from '@gamapay/gamapay-js';

  const gamapay = await loadGamaPay('pk_test_YOUR_PUBLISHABLE_KEY');
  const { clientSecret } = await fetch('/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId: 10482 }),
  }).then((r) => r.json());

  // Country first, then that country's wallets and cards, the phone and, when needed, the payment code.
  const elements = gamapay.elements({ clientSecret, locale: 'fr', appearance: { theme: 'gamapay' } });
  elements.create('payment').mount('#payment-element');

  document.getElementById('payment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const { error, paymentIntent } = await gamapay.confirmPayment({
      elements,
      confirmParams: { return_url: 'https://example.com/commande/10482/merci' },
    });
    if (error) document.getElementById('error').textContent = error.message;
    else if (paymentIntent.status === 'succeeded') location.href = '/commande/10482/merci';
  });
</script>`,
};

// Signature check of a webhook event (GamaPay-Signature, signed with the endpoint's whsec_ secret).
// After a secret rotation the header carries two v1 values for 24 hours: accept either.
export const WEBHOOK_SIGNATURE_SAMPLES = {
  node: `// Node.js — with the gamapay SDK (npm install gamapay)
import express from 'express';
import GamaPay from 'gamapay';

const gamapay = new GamaPay(process.env.GAMAPAY_SECRET_KEY);

app.post('/webhooks/gamapay', express.raw({ type: 'application/json' }), (req, res) => {
  let event;
  try {
    // Checks the signature and its age (5 minutes), then parses the event.
    event = gamapay.webhooks.constructEvent(req.body, req.get('GamaPay-Signature'), process.env.GAMAPAY_WEBHOOK_SECRET);
  } catch {
    return res.sendStatus(400);
  }
  if (event.type === 'payment_intent.succeeded') {
    fulfilOrder(event.data.object.metadata.order_id);
  }
  res.sendStatus(200);
});`,

  php: `<?php
// PHP — reject any event whose signature doesn't match.
function isValidEvent(string $rawBody, string $header, string $secret): bool
{
    $t = 0;
    $signatures = [];
    foreach (explode(',', $header) as $part) {
        [$key, $value] = array_pad(explode('=', $part, 2), 2, '');
        if ('t' === $key) {
            $t = (int) $value;
        } elseif ('v1' === $key) {
            $signatures[] = $value;
        }
    }
    $expected = hash_hmac('sha256', $t . '.' . $rawBody, $secret);
    foreach ($signatures as $signature) {
        if (hash_equals($expected, $signature)) {
            return abs(time() - $t) < 300;
        }
    }

    return false;
}

$valid = isValidEvent(file_get_contents('php://input'), $_SERVER['HTTP_GAMAPAY_SIGNATURE'] ?? '', getenv('GAMAPAY_WEBHOOK_SECRET'));`,

  python: `# Python — reject any event whose signature doesn't match.
import hashlib
import hmac
import time

def is_valid_event(raw_body: bytes, header: str, secret: str) -> bool:
    pairs = [p.split("=", 1) for p in header.split(",") if "=" in p]
    t = next((v for k, v in pairs if k == "t"), "0")
    expected = hmac.new(secret.encode(), f"{t}.".encode() + raw_body, hashlib.sha256).hexdigest()
    signed = any(hmac.compare_digest(expected, v) for k, v in pairs if k == "v1")
    return signed and abs(time.time() - int(t)) < 300`,
};

// Signature check of a legacy IPN notification (X-MMP-Signature, signed with the private key).
export const SIGNATURE_SAMPLES = {
  node: `// Node.js — reject any notification whose signature doesn't match.
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

  php: `<?php
// PHP — reject any notification whose signature doesn't match.
function isValidSignature(string $rawBody, string $header, string $privateKey): bool
{
    parse_str(str_replace(',', '&', $header), $parts);
    $t = (int) ($parts['t'] ?? 0);
    $expected = hash_hmac('sha256', $t . '.' . $rawBody, $privateKey);

    return abs(time() - $t) < 300 && hash_equals($expected, (string) ($parts['v1'] ?? ''));
}

$valid = isValidSignature(file_get_contents('php://input'), $_SERVER['HTTP_X_MMP_SIGNATURE'] ?? '', getenv('TECKO_PRIVATE_KEY'));`,

  python: `# Python — reject any notification whose signature doesn't match.
import hashlib
import hmac
import time

def is_valid_signature(raw_body: bytes, header: str, private_key: str) -> bool:
    parts = dict(p.split("=", 1) for p in header.split(","))
    t = parts.get("t", "0")
    expected = hmac.new(private_key.encode(), f"{t}.".encode() + raw_body, hashlib.sha256).hexdigest()
    return abs(time.time() - int(t)) < 300 and hmac.compare_digest(expected, parts.get("v1", ""))`,
};
