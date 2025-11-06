import nodemailer from 'nodemailer';

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
    const { name = '', email = '', phone = '', service = '', message = '', website = '', timestamp } = body;

    if (website && String(website).trim() !== '') {
      return res.status(200).json({ ok: true });
    }

    const errors = [];
    if (!name || String(name).trim().length < 2) errors.push('name');
    const emailRegex = /^(?=.{3,254}$)[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(String(email))) errors.push('email');
    if (!message || String(message).trim().length < 10) errors.push('message');
    if (errors.length) {
      return res.status(400).json({ ok: false, error: 'ValidationError', fields: errors });
    }

    const submittedAt = timestamp ? new Date(Number(timestamp)) : new Date();
    const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').toString().split(',')[0].trim();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 465),
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_USER;
    const ownerEmail = process.env.OWNER_EMAIL;
    if (!fromEmail || !ownerEmail) {
      return res.status(500).json({ ok: false, error: 'ServerMisconfigured' });
    }

    const ownerMail = {
      from: { name: 'Therapy Council', address: fromEmail },
      to: ownerEmail,
      replyTo: email,
      subject: `New contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n${phone ? `Phone: ${phone}\n` : ''}${service ? `Service: ${service}\n` : ''}Message: ${message}\nSubmitted: ${submittedAt.toISOString()}${ip ? `\nIP: ${ip}` : ''}`,
      html: `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;line-height:1.5;color:#111827">
          <h2 style="margin:0 0 8px">New contact submission</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
          ${service ? `<p><strong>Service:</strong> ${escapeHtml(service)}</p>` : ''}
          <p><strong>Submitted:</strong> ${submittedAt.toISOString()}</p>
          ${ip ? `<p><strong>IP:</strong> ${escapeHtml(ip)}</p>` : ''}
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
          <p style="margin:0 0 4px"><strong>Message</strong></p>
          <pre style="white-space:pre-wrap;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin:8px 0 0">${escapeHtml(message)}</pre>
        </div>
      `
    };

    const userMail = {
      from: { name: 'Therapy Council', address: fromEmail },
      to: email,
      subject: 'Thanks for reaching out to Therapy Council',
      text: `Hi ${name},\n\nThanks for contacting Therapy Council. A therapist will get back to you within 4 hours.\n\nIf your need is urgent, call us at (+91) 9211-750-322.\n\n— Therapy Council`,
      html: `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial,sans-serif;line-height:1.6;color:#111827">
          <p>Hi ${escapeHtml(name)},</p>
          <p>Thanks for contacting Therapy Council. A therapist will get back to you within <strong>4 hours</strong>.</p>
          <p>If your need is urgent, call us at <strong>(+91) 9211-750-322</strong>.</p>
          <p style="margin-top:16px">— Therapy Council</p>
        </div>
      `
    };

    await transporter.sendMail(ownerMail);
    await transporter.sendMail(userMail);

    return res.status(200).json({ ok: true });
  } catch (error) {
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


