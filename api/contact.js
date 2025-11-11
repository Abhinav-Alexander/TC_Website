// Nodemailer removed

// Allow only the production site origin by default; override via env if needed
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://therapycouncil.org';

function addCors(res) {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
}

export default async function handler(req, res) {
  addCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const contentType = req.headers['content-type'] || '';

    if (!contentType.includes('application/json')) {
      return res.status(400).json({ ok: false, error: 'Expected application/json' });
    }

    const body = req.body ?? {};

    const {
      name = '',
      email = '',
      phone = '',
      service = '',
      message = '',
      website = '',
      timestamp
    } = body;

    // Honeypot check
    if (website && String(website).trim() !== '') {
      // Silent success to avoid teaching bots
      return res.status(200).json({ ok: true });
    }

    // Basic validation
    const errors = [];
    if (!name || String(name).trim().length < 2) errors.push('name');
    const emailRegex = /^(?=.{3,254}$)[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(String(email))) errors.push('email');
    if (!message || String(message).trim().length < 10) errors.push('message');
    if (errors.length) {
      return res.status(400).json({ ok: false, error: 'ValidationError', fields: errors });
    }

    // Processed successfully without sending emails
    return res.status(200).json({ ok: true });
  } catch (error) {
    // Do not leak internals in production
    return res.status(500).json({ ok: false, error: 'InternalError' });
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}


