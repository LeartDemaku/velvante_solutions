import nodemailer from 'nodemailer';
import type { ContactInput, ProjectInquiryInput } from '../validation/contact';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: { user: string; pass: string };
  from: string;
  targetEmail: string;
}

function getEmailConfig(): EmailConfig | null {
  const host = process.env.SMTP_HOST || 'smtp-mail.outlook.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || 'velvantesolutions@outlook.com';
  const pass = process.env.SMTP_PASS || '';
  const secure = process.env.SMTP_SECURE === 'true';
  const from = process.env.SMTP_FROM || `Velvante Solutions <${user}>`;
  const targetEmail = process.env.CONTACT_EMAIL || 'velvantesolutions@outlook.com';

  if (!pass) {
    return null;
  }

  return {
    host,
    port,
    secure,
    auth: { user, pass },
    from,
    targetEmail,
  };
}

function createTransporter(config: EmailConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.auth.user,
      pass: config.auth.pass,
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false,
    },
  });
}

function sanitizeText(str?: string | null): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function sendViaResend(params: {
  to: string | string[];
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'RESEND_API_KEY is not set' };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Velvante Solutions <onboarding@resend.dev>',
        to: Array.isArray(params.to) ? params.to : [params.to],
        reply_to: params.replyTo,
        subject: params.subject,
        html: params.html,
        text: params.text,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { ok: false, error: data.message || 'Resend error' };
    }
    return { ok: true, messageId: data.id };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Resend network error' };
  }
}

export async function sendContactNotification(data: ContactInput): Promise<{ success: boolean; messageId?: string }> {
  const cleanName = sanitizeText(data.name);
  const cleanEmail = sanitizeText(data.email);
  const cleanCompany = sanitizeText(data.company) || '—';
  const cleanPhone = sanitizeText(data.phone) || '—';
  const cleanService = sanitizeText(data.service) || (data.locale === 'sq' ? 'Kërkesë e Përgjithshme' : 'General Inquiry');
  const cleanMessage = sanitizeText(data.message);
  const localeUpper = (data.locale || 'sq').toUpperCase();

  const isSq = data.locale === 'sq';
  const subject = isSq
    ? `📬 Mesazh i Ri Kontakti: ${data.name} — ${data.service || 'Kërkesë e Përgjithshme'}`
    : `📬 New Contact Submission: ${data.name} — ${data.service || 'General Inquiry'}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin: 0; padding: 0; background-color: #070710; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f0f0f8;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #070710; padding: 40px 15px;">
          <tr>
            <td align="center">
              <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #0f0f1a; border: 1px solid #1e1e32; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <tr>
                  <td style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); padding: 30px; text-align: center; border-bottom: 1px solid #3730a3;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">Velvante Solutions</h1>
                    <p style="margin: 6px 0 0 0; font-size: 13px; color: #a5b4fc; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em;">
                      ${isSq ? 'Njoftim i Formularit të Kontaktit' : 'Contact Form Notification'}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 30px;">
                    <div style="background-color: #16162a; border: 1px solid #222238; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 14px;">
                        <tr>
                          <td style="padding: 8px 0; color: #8888a8; width: 35%; font-weight: 600;">${isSq ? 'Emri i Plotë' : 'Full Name'}:</td>
                          <td style="padding: 8px 0; color: #f0f0f8; font-weight: bold;">${cleanName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #8888a8; font-weight: 600;">Email:</td>
                          <td style="padding: 8px 0;"><a href="mailto:${cleanEmail}" style="color: #818cf8; text-decoration: none; font-weight: 600;">${cleanEmail}</a></td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #8888a8; font-weight: 600;">${isSq ? 'Numri i Telefonit' : 'Phone Number'}:</td>
                          <td style="padding: 8px 0; color: #f0f0f8;">${cleanPhone}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #8888a8; font-weight: 600;">${isSq ? 'Kompania' : 'Company'}:</td>
                          <td style="padding: 8px 0; color: #f0f0f8;">${cleanCompany}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #8888a8; font-weight: 600;">${isSq ? 'Shërbimi i Kërkuar' : 'Requested Service'}:</td>
                          <td style="padding: 8px 0; color: #38bdf8; font-weight: 600;">${cleanService}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #8888a8; font-weight: 600;">${isSq ? 'Gjuha' : 'Language'}:</td>
                          <td style="padding: 8px 0; color: #4ade80; font-family: monospace;">${localeUpper}</td>
                        </tr>
                      </table>
                    </div>

                    <div style="margin-bottom: 24px;">
                      <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #8888a8; text-transform: uppercase; letter-spacing: 0.05em;">
                        ${isSq ? 'Mesazhi i Dërguar' : 'Submitted Message'}:
                      </p>
                      <div style="background-color: #070710; border: 1px solid #1e1e32; border-radius: 12px; padding: 20px; font-size: 14px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap;">${cleanMessage}</div>
                    </div>

                    <div style="text-align: center; padding-top: 10px;">
                      <a href="mailto:${cleanEmail}?subject=Re: Velvante Solutions" style="display: inline-block; background-color: #6366f1; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: bold; text-decoration: none; box-shadow: 0 4px 14px rgba(99,102,241,0.4);">
                        ${isSq ? 'Kthe Përgjigje Direkt' : 'Reply Directly to Client'}
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #0b0b14; padding: 20px; text-align: center; border-top: 1px solid #1a1a2e; font-size: 12px; color: #64748b; font-family: monospace;">
                    © ${new Date().getFullYear()} Velvante Solutions • velvantesolutions@outlook.com
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const text = `New Contact Submission:\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nCompany: ${data.company || 'N/A'}\nService: ${data.service || 'N/A'}\n\nMessage:\n${data.message}`;

  if (process.env.RESEND_API_KEY) {
    const resendResult = await sendViaResend({
      to: 'velvantesolutions@outlook.com',
      replyTo: data.email,
      subject,
      html,
      text,
    });
    if (resendResult.ok) {
      return { success: true, messageId: resendResult.messageId };
    }
  }

  const config = getEmailConfig();
  if (!config) {
    return { success: false };
  }

  try {
    const transporter = createTransporter(config);
    const info = await transporter.sendMail({
      from: config.from,
      to: config.targetEmail,
      replyTo: data.email,
      subject,
      html,
      text,
    });
    return { success: true, messageId: info.messageId };
  } catch {
    return { success: false };
  }
}

export async function sendProjectInquiryNotification(data: ProjectInquiryInput): Promise<{ success: boolean; messageId?: string }> {
  const fullName = `${sanitizeText(data.firstName)} ${sanitizeText(data.lastName)}`.trim();
  const cleanEmail = sanitizeText(data.email);
  const cleanPhone = sanitizeText(data.phone) || '—';
  const cleanCompany = sanitizeText(data.company) || '—';
  const cleanType = sanitizeText(data.projectType);
  const cleanBudget = sanitizeText(data.budget) || (data.budgetMin || data.budgetMax ? `€${data.budgetMin || 0} - €${data.budgetMax || 'Max'}` : 'Not specified');
  const cleanTimeline = sanitizeText(data.timeline) || '—';
  const cleanServices = data.services.map((s) => sanitizeText(s)).join(', ') || 'General';
  const cleanDesc = sanitizeText(data.description) || '—';
  const cleanGoals = sanitizeText(data.goals);
  const isSq = data.locale === 'sq';

  const subject = isSq
    ? `🚀 Kërkesë e Re Projekti: ${fullName} — ${cleanType}`
    : `🚀 New Project Request: ${fullName} — ${cleanType}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin: 0; padding: 0; background-color: #070710; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f0f0f8;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #070710; padding: 40px 15px;">
          <tr>
            <td align="center">
              <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #0f0f1a; border: 1px solid #1e1e32; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <tr>
                  <td style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); padding: 30px; text-align: center; border-bottom: 1px solid #3730a3;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">Velvante Solutions</h1>
                    <p style="margin: 6px 0 0 0; font-size: 13px; color: #a5b4fc; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em;">
                      ${isSq ? 'Kërkesë e Re e Detajuar Projekti' : 'Detailed Project Inquiry'}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 30px;">
                    <div style="background-color: #16162a; border: 1px solid #222238; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-size: 14px;">
                        <tr>
                          <td style="padding: 8px 0; color: #8888a8; width: 35%; font-weight: 600;">Client:</td>
                          <td style="padding: 8px 0; color: #f0f0f8; font-weight: bold;">${fullName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #8888a8; font-weight: 600;">Email:</td>
                          <td style="padding: 8px 0;"><a href="mailto:${cleanEmail}" style="color: #818cf8; text-decoration: none; font-weight: 600;">${cleanEmail}</a></td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #8888a8; font-weight: 600;">Phone:</td>
                          <td style="padding: 8px 0; color: #f0f0f8;">${cleanPhone}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #8888a8; font-weight: 600;">Company:</td>
                          <td style="padding: 8px 0; color: #f0f0f8;">${cleanCompany}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #8888a8; font-weight: 600;">Project Type:</td>
                          <td style="padding: 8px 0; color: #6366f1; font-weight: bold;">${cleanType}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #8888a8; font-weight: 600;">Budget:</td>
                          <td style="padding: 8px 0; color: #4ade80; font-weight: bold; font-family: monospace;">${cleanBudget}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #8888a8; font-weight: 600;">Timeline:</td>
                          <td style="padding: 8px 0; color: #f0f0f8;">${cleanTimeline}</td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0; color: #8888a8; font-weight: 600;">Services:</td>
                          <td style="padding: 8px 0; color: #38bdf8;">${cleanServices}</td>
                        </tr>
                      </table>
                    </div>

                    <div style="margin-bottom: 24px;">
                      <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #8888a8; text-transform: uppercase;">Description:</p>
                      <div style="background-color: #070710; border: 1px solid #1e1e32; border-radius: 12px; padding: 18px; font-size: 14px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap;">${cleanDesc}</div>
                    </div>

                    ${cleanGoals ? `
                    <div style="margin-bottom: 24px;">
                      <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #8888a8; text-transform: uppercase;">Goals:</p>
                      <div style="background-color: #070710; border: 1px solid #1e1e32; border-radius: 12px; padding: 18px; font-size: 14px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap;">${cleanGoals}</div>
                    </div>` : ''}

                    <div style="text-align: center; padding-top: 10px;">
                      <a href="mailto:${cleanEmail}?subject=Re: Velvante Solutions Project Proposal" style="display: inline-block; background-color: #6366f1; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: bold; text-decoration: none; box-shadow: 0 4px 14px rgba(99,102,241,0.4);">
                        ${isSq ? 'Filloni Propozimin Teknik' : 'Start Technical Proposal'}
                      </a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #0b0b14; padding: 20px; text-align: center; border-top: 1px solid #1a1a2e; font-size: 12px; color: #64748b; font-family: monospace;">
                    © ${new Date().getFullYear()} Velvante Solutions • velvantesolutions@outlook.com
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const text = `New Project Request:\nClient: ${fullName}\nEmail: ${data.email}\nPhone: ${data.phone || 'N/A'}\nType: ${data.projectType}\nBudget: ${cleanBudget}\nTimeline: ${cleanTimeline}\n\nDescription:\n${data.description || 'N/A'}`;

  if (process.env.RESEND_API_KEY) {
    const resendResult = await sendViaResend({
      to: 'velvantesolutions@outlook.com',
      replyTo: data.email,
      subject,
      html,
      text,
    });
    if (resendResult.ok) {
      return { success: true, messageId: resendResult.messageId };
    }
  }

  const config = getEmailConfig();
  if (!config) {
    return { success: false };
  }

  try {
    const transporter = createTransporter(config);
    const info = await transporter.sendMail({
      from: config.from,
      to: config.targetEmail,
      replyTo: data.email,
      subject,
      html,
      text,
    });
    return { success: true, messageId: info.messageId };
  } catch {
    return { success: false };
  }
}

export async function sendAutoReply(email: string, name: string, locale: string = 'sq'): Promise<void> {
  const cleanName = sanitizeText(name);
  const isSq = locale === 'sq';

  const subject = isSq
    ? 'Kemi marrë mesazhin tuaj — Velvante Solutions'
    : 'We received your message — Velvante Solutions';

  const messageBody = isSq
    ? `Faleminderit që kontaktuat <strong>Velvante Solutions</strong>. Kemi marrë me sukses kërkesën tuaj dhe inxhinierët tanë do t'ju përgjigjen me një vlerësim të përshtatur brenda 24 orëve të ardhshme.`
    : `Thank you for contacting <strong>Velvante Solutions</strong>. We have successfully received your inquiry and our team will get back to you with a tailored assessment within the next 24 hours.`;

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin: 0; padding: 0; background-color: #070710; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f0f0f8;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding: 40px 15px;">
          <tr>
            <td align="center">
              <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background-color: #0f0f1a; border: 1px solid #1e1e32; border-radius: 16px; overflow: hidden;">
                <tr>
                  <td style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); padding: 24px; text-align: center;">
                    <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff;">Velvante Solutions</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px; font-size: 15px; line-height: 1.6; color: #cbd5e1;">
                    <h2 style="margin: 0 0 16px 0; color: #f8fafc; font-size: 18px;">${isSq ? 'Përshëndetje' : 'Hello'}, ${cleanName}</h2>
                    <p style="margin: 0 0 20px 0;">${messageBody}</p>
                    <p style="margin: 0; color: #94a3b8; font-size: 13px;">— ${isSq ? 'Ekipi i Velvante Solutions' : 'The Velvante Solutions Team'}</p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #0b0b14; padding: 16px; text-align: center; border-top: 1px solid #1a1a2e; font-size: 12px; color: #64748b; font-family: monospace;">
                    velvantesolutions@outlook.com
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  if (process.env.RESEND_API_KEY) {
    try {
      await sendViaResend({
        to: email,
        subject,
        html,
        text: `${isSq ? 'Përshëndetje' : 'Hello'} ${name},\n\n${isSq ? 'Kemi marrë me sukses mesazhin tuaj dhe do t\'ju përgjigjemi brenda 24 orëve.' : 'We have received your message and will respond within 24 hours.'}\n\n— Velvante Solutions`,
      });
      return;
    } catch {
    }
  }

  const config = getEmailConfig();
  if (!config) return;

  try {
    const transporter = createTransporter(config);
    await transporter.sendMail({
      from: config.from,
      to: email,
      subject,
      html,
      text: `${isSq ? 'Përshëndetje' : 'Hello'} ${name},\n\n${isSq ? 'Kemi marrë me sukses mesazhin tuaj dhe do t\'ju përgjigjemi brenda 24 orëve.' : 'We have received your message and will respond within 24 hours.'}\n\n— Velvante Solutions`,
    });
  } catch {
  }
}

export async function verifySmtpConnection(): Promise<{ ok: boolean; error?: string }> {
  if (process.env.RESEND_API_KEY) {
    return { ok: true };
  }

  const config = getEmailConfig();
  if (!config) {
    return { ok: false, error: 'Email configuration missing.' };
  }

  try {
    const transporter = createTransporter(config);
    await transporter.verify();
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Failed to connect to SMTP server' };
  }
}

export async function sendTestEmail(): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  const subject = '✅ Velvante Solutions — Test i Suksesshëm i Konfigurimit të Email-it';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; background: #0f0f1a; color: #ffffff; border: 1px solid #1e1e32; border-radius: 12px;">
      <h2 style="color: #4ade80; margin: 0 0 10px 0;">Konfigurimi i Email-it Funksionon me Sukses!</h2>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.5;">Ky është një email prove nga sistemi i <strong>Velvante Solutions</strong> drejtuar tek <strong>velvantesolutions@outlook.com</strong>.</p>
      <div style="background: #16162a; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 12px; color: #a5b4fc; margin-top: 15px;">
        Marrësi: velvantesolutions@outlook.com<br/>
        Shërbimi: Resend Infrastructure<br/>
        Koha: ${new Date().toISOString()}
      </div>
    </div>
  `;

  if (process.env.RESEND_API_KEY) {
    const resendResult = await sendViaResend({
      to: 'velvantesolutions@outlook.com',
      subject,
      html,
      text: 'Velvante Solutions — Test i Suksesshëm i Konfigurimit të Email-it tek velvantesolutions@outlook.com',
    });
    return resendResult;
  }

  const config = getEmailConfig();
  if (!config) {
    return { ok: false, error: 'Email credentials missing.' };
  }

  try {
    const transporter = createTransporter(config);
    const info = await transporter.sendMail({
      from: config.from,
      to: config.targetEmail,
      subject,
      html,
    });
    return { ok: true, messageId: info.messageId };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'SMTP sending failed' };
  }
}

export async function sendPasswordResetEmail(email: string, resetLink: string): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  const subject = '🔐 Velvante Solutions — Rivendosja e Fjalëkalimit të Administratorit';
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin: 0; padding: 0; background-color: #070710; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f0f0f8;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #070710; padding: 40px 15px;">
          <tr>
            <td align="center">
              <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #0f0f1a; border: 1px solid #1e1e32; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <tr>
                  <td style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); padding: 30px; text-align: center; border-bottom: 1px solid #3730a3;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">Velvante Solutions</h1>
                    <p style="margin: 6px 0 0 0; font-size: 13px; color: #a5b4fc; font-family: monospace; text-transform: uppercase; letter-spacing: 0.1em;">
                      Kërkesë për Rivendosjen e Fjalëkalimit
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px 30px;">
                    <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #f0f0f8;">
                      Përshëndetje Administrator,
                    </p>
                    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #a5b4fc;">
                      Kemi marrë një kërkesë për ndryshimin e fjalëkalimit të llogarisë tuaj administrative në <strong>Velvante Solutions CMS</strong>.
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${resetLink}" style="display: inline-block; background-color: #6366f1; color: #ffffff; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 18px rgba(99,102,241,0.45); letter-spacing: 0.02em;">
                        Rivendos Fjalëkalimin Tani &rarr;
                      </a>
                    </div>
                    <div style="background-color: #16162a; border: 1px solid #222238; border-radius: 12px; padding: 16px; margin: 24px 0 16px 0; font-size: 12px; line-height: 1.6; color: #8888a8;">
                      <strong style="color: #f0f0f8;">Shënim Sigurie:</strong> Ky link mbetet i vlefshëm për <strong>60 minuta</strong>. Nëse nuk e keni kërkuar ju këtë ndryshim, mund ta injoroni këtë email me siguri të plotë.
                    </div>
                    <p style="margin: 16px 0 0 0; font-size: 11px; color: #64748b; word-break: break-all;">
                      Nëse butoni më sipër nuk hapet, kopjoni dhe hapni këtë link në shfletues:<br/>
                      <a href="${resetLink}" style="color: #818cf8; text-decoration: underline;">${resetLink}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #0b0b14; padding: 16px; text-align: center; border-top: 1px solid #1a1a2e; font-size: 12px; color: #64748b; font-family: monospace;">
                    © ${new Date().getFullYear()} Velvante Solutions • velvantesolutions@outlook.com
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
  const text = `Velvante Solutions - Rivendosja e Fjalëkalimit\n\nPërshëndetje,\n\nKlikoni linkun e mëposhtëm për të ndryshuar fjalëkalimin tuaj:\n${resetLink}\n\nKy link skadon brenda 60 minutave.\n\nVelvante Solutions`;

  if (process.env.RESEND_API_KEY) {
    const resendResult = await sendViaResend({
      to: email,
      subject,
      html,
      text,
    });
    if (resendResult.ok) return resendResult;
  }

  const config = getEmailConfig();
  if (!config) {
    return { ok: false, error: 'Email configuration not found' };
  }

  try {
    const transporter = createTransporter(config);
    const info = await transporter.sendMail({
      from: config.from,
      to: email,
      subject,
      html,
      text,
    });
    return { ok: true, messageId: info.messageId };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'SMTP sending failed' };
  }
}
