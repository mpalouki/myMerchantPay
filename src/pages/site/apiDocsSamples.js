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

// One request in every language: `body` (an object) is sent as JSON when given.
function request(method, path, body) {
  const url = `${SANDBOX}${path}`;
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
      `  -H "Authorization: Bearer ${KEY}"${json ? ' \\' : ''}`,
      ...(json ? ['  -H "Content-Type: application/json" \\', `  -d '${indent(json, 2)}'`] : []),
    ].join('\n'),

    php: `<?php
// composer require guzzlehttp/guzzle
$client = new GuzzleHttp\\Client();

$response = $client->request('${method}', '${url}', [
    'headers' => ['Authorization' => 'Bearer ' . getenv('TECKO_PRIVATE_KEY')],${body ? `\n    'json' => ${phpArray(body, 2)},` : ''}
]);

$${body ? 'result' : 'payment'} = json_decode($response->getBody(), true);`,

    node: `// Node.js 18+ (fetch is built in)
const response = await fetch('${url}', {
  method: '${method}',
  headers: {
    Authorization: \`Bearer \${process.env.TECKO_PRIVATE_KEY}\`,${body ? "\n    'Content-Type': 'application/json'," : ''}
  },${body ? `\n  body: JSON.stringify(${indent(json, 2)}),` : ''}
});

const ${body ? 'result' : 'payment'} = await response.json();`,

    python: `# pip install requests
import os
import requests

response = requests.${method.toLowerCase()}(
    "${url}",
    headers={"Authorization": f"Bearer {os.environ['TECKO_PRIVATE_KEY']}"},${body ? `\n    json=${indent(pythonDict(body), 4)},` : ''}
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
    "code": "insufficient_balance",
    "message": "The account balance is too low for this payout (amount + fee).",
    "field": "amount"
  }
}`,
};

// Signature check of a notification, in the languages servers usually receive them in.
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
