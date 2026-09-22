// lib/mailer.ts
import { BrevoClient } from '@getbrevo/brevo';

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY!,
});

/**
 * Sends a notification email to the BLC admin whenever a BLC 2.0
 * registration is paid. Uses Brevo (no test-mode restrictions).
 */
export async function sendBlcPaymentNotification(reg: {
  reference: string;
  name: string;
  email: string;
  phone: string;
  ticketName: string;
  amount: number;
}) {
  const adminEmail = process.env.BLC_ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn(' BLC_ADMIN_EMAIL not set — skipping notification');
    return;
  }

  try {
    const result = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: 'BLC Payments',
        email: 'theblcglobal@gmail.com', //  Verified sender in Brevo
      },
      to: [{ email: adminEmail, name: 'BLC Admin' }],
      subject: ` New BLC 2.0 payment — ${reg.name} (GHS ${reg.amount.toFixed(2)})`,
      htmlContent: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9f7f3;border-radius:12px;">
          <h2 style="color:#0a5c2e;margin-top:0;"> New BLC 2.0 Payment</h2>
          <p style="color:#444;">Someone just registered and paid for <b>BLC 2.0</b>.</p>

          <table style="width:100%;border-collapse:collapse;background:white;border-radius:8px;overflow:hidden;margin-top:16px;">
            <tr>
              <td style="padding:12px;border-bottom:1px solid #eee;color:#666;width:140px;">Name</td>
              <td style="padding:12px;border-bottom:1px solid #eee;font-weight:bold;">${reg.name}</td>
            </tr>
            <tr>
              <td style="padding:12px;border-bottom:1px solid #eee;color:#666;">Email</td>
              <td style="padding:12px;border-bottom:1px solid #eee;">${reg.email}</td>
            </tr>
            <tr>
              <td style="padding:12px;border-bottom:1px solid #eee;color:#666;">Phone</td>
              <td style="padding:12px;border-bottom:1px solid #eee;">${reg.phone}</td>
            </tr>
            <tr>
              <td style="padding:12px;border-bottom:1px solid #eee;color:#666;">Ticket</td>
              <td style="padding:12px;border-bottom:1px solid #eee;">${reg.ticketName}</td>
            </tr>
            <tr>
              <td style="padding:12px;border-bottom:1px solid #eee;color:#666;">Amount Paid</td>
              <td style="padding:12px;border-bottom:1px solid #eee;font-weight:bold;color:#0a5c2e;font-size:18px;">GHS ${reg.amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding:12px;color:#666;">Reference</td>
              <td style="padding:12px;font-family:monospace;font-size:12px;">${reg.reference}</td>
            </tr>
          </table>

          <p style="color:#888;font-size:12px;margin-top:24px;">
            Sent automatically from your BLC 2.0 registration system.
          </p>
        </div>
      `,
    });

    // The v6 SDK throws on errors, so if we got here, it succeeded.
    console.log(`BLC admin notification sent to ${adminEmail}`);
  } catch (err) {
    console.error(' Failed to send BLC notification:', err);
  }
}