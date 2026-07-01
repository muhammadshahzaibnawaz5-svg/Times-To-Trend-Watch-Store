'use server';

import { z } from 'zod';
import { Resend } from 'resend';
import { validateEnv } from '@/lib/env';

const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone is required'),
  subject: z.string().optional().default(''),
  message: z.string().min(1, 'Message is required'),
});

type ContactFormInput = z.infer<typeof contactFormSchema>;

function buildEmailHtml(data: ContactFormInput): string {
  const subject = data.subject || 'No Subject';
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <tr>
            <td style="background-color:#000000;padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Times to Trend</h1>
              <p style="margin:6px 0 0;color:#999999;font-size:11px;letter-spacing:1px;text-transform:uppercase;">New Contact Form Submission</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:24px;">
                    <p style="margin:0;font-size:14px;color:#666666;">You received a new message from the contact form.</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:8px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                      <tr>
                        <td style="padding:12px 16px;background-color:#f9f9f9;border-bottom:1px solid #eeeeee;font-size:12px;font-weight:700;color:#333333;text-transform:uppercase;letter-spacing:0.5px;width:120px;">Name</td>
                        <td style="padding:12px 16px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;">${data.name}</td>
                      </tr>
                      <tr>
                        <td style="padding:12px 16px;background-color:#f9f9f9;border-bottom:1px solid #eeeeee;font-size:12px;font-weight:700;color:#333333;text-transform:uppercase;letter-spacing:0.5px;">Email</td>
                        <td style="padding:12px 16px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;"><a href="mailto:${data.email}" style="color:#000000;">${data.email}</a></td>
                      </tr>
                      <tr>
                        <td style="padding:12px 16px;background-color:#f9f9f9;border-bottom:1px solid #eeeeee;font-size:12px;font-weight:700;color:#333333;text-transform:uppercase;letter-spacing:0.5px;">Phone</td>
                        <td style="padding:12px 16px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;">${data.phone}</td>
                      </tr>
                      <tr>
                        <td style="padding:12px 16px;background-color:#f9f9f9;border-bottom:1px solid #eeeeee;font-size:12px;font-weight:700;color:#333333;text-transform:uppercase;letter-spacing:0.5px;">Subject</td>
                        <td style="padding:12px 16px;border-bottom:1px solid #eeeeee;font-size:14px;color:#333333;">${subject}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:16px;">
                    <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#333333;text-transform:uppercase;letter-spacing:0.5px;">Message</p>
                    <div style="background-color:#f9f9f9;border-radius:4px;padding:16px;font-size:14px;color:#333333;line-height:1.6;white-space:pre-wrap;">${data.message}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f9f9f9;padding:24px 40px;text-align:center;border-top:1px solid #eeeeee;">
              <p style="margin:0;font-size:11px;color:#999999;">This email was sent from the contact form on Times to Trend.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendContactEmail(formData: FormData) {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  };

  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || 'Invalid form data';
    return { error: firstError };
  }

  const env = validateEnv();
  const resend = new Resend(env.RESEND_API_KEY);

  try {
    const subjectLine = parsed.data.subject
      ? `Contact Form: ${parsed.data.subject} from ${parsed.data.name}`
      : `Contact Form: New message from ${parsed.data.name}`;

    const { error } = await resend.emails.send({
      from: env.CONTACT_EMAIL_FROM,
      to: env.CONTACT_EMAIL_TO,
      replyTo: parsed.data.email,
      subject: subjectLine,
      html: buildEmailHtml(parsed.data),
    });

    if (error) {
      console.error('Resend send error:', error);
      return { error: 'Failed to send message. Please try again later.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Resend exception:', err);
    return { error: 'Failed to send message. Please try again later.' };
  }
}
