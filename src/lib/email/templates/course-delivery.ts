interface CourseDeliveryProps {
  name: string;
  course: string;
  password: string;
  downloadUrl: string;
}

/**
 * Returns { subject, html, text } for the "course ready" email.
 * HTML uses inline styles so it renders consistently across mail clients.
 */
export function courseDeliveryEmail({
  name,
  course,
  password,
  downloadUrl,
}: CourseDeliveryProps) {
  const subject = "Your Barber Course is Ready";

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${subject}</title>
  </head>
  <body style="margin:0;background:#06060a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,sans-serif;color:#f5f5f7;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#06060a;padding:48px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
            <tr>
              <td style="padding:0 0 32px 0;">
                <div style="font-size:14px;letter-spacing:0.28em;text-transform:uppercase;color:#9b9ba6;font-weight:600;">AlfinSquare Academy</div>
              </td>
            </tr>
            <tr>
              <td style="background:linear-gradient(135deg,#1c1c22,#0e0e12);border:1px solid rgba(255,255,255,0.08);border-radius:28px;padding:40px;">
                <div style="font-size:32px;line-height:1.15;font-weight:700;letter-spacing:-0.02em;background:linear-gradient(110deg,#ffffff,#ff9b6b 60%,#ffffff);-webkit-background-clip:text;background-clip:text;color:transparent;margin:0 0 16px 0;">
                  Your course is ready, ${escapeHtml(name)}.
                </div>
                <p style="font-size:16px;line-height:1.6;color:#cfcfd6;margin:0 0 28px 0;">
                  Thank you for your purchase. Below is your secure download and the password required to open the PDF.
                </p>

                <div style="border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:20px;background:rgba(255,255,255,0.03);margin-bottom:28px;">
                  <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#9b9ba6;margin-bottom:8px;">Course</div>
                  <div style="font-size:18px;font-weight:600;color:#ffffff;">${escapeHtml(course)}</div>
                </div>

                <a href="${downloadUrl}" style="display:inline-block;text-decoration:none;border-radius:999px;padding:14px 28px;font-weight:600;font-size:15px;color:#ffffff;background:linear-gradient(120deg,#ff6b34,#ff4a8a 60%,#a06bff);box-shadow:0 10px 30px -10px rgba(255,75,120,0.55);">
                  Download your course
                </a>

                <div style="margin-top:28px;border:1px dashed rgba(255,255,255,0.18);border-radius:14px;padding:18px;background:rgba(255,255,255,0.02);">
                  <div style="font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#9b9ba6;margin-bottom:6px;">PDF Password</div>
                  <div style="font-family:'SFMono-Regular',Menlo,Consolas,monospace;font-size:18px;font-weight:600;color:#ffffff;letter-spacing:0.05em;">${escapeHtml(password)}</div>
                </div>

                <p style="font-size:14px;line-height:1.6;color:#9b9ba6;margin:32px 0 0 0;">
                  Keep this email safe — the password protects your PDF.
                  If you have any questions, just reply to this email.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 0 0 0;text-align:center;font-size:12px;color:#6f6f7a;">
                © ${new Date().getFullYear()} AlfinSquare Academy. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    `Hello ${name}`,
    "",
    "Thank you for your purchase.",
    "",
    "Your course is ready.",
    "",
    `Course: ${course}`,
    "",
    `Download: ${downloadUrl}`,
    "",
    `PDF Password: ${password}`,
    "",
    "If you have questions, please contact us.",
    "",
    "— AlfinSquare Academy",
  ].join("\n");

  return { subject, html, text };
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
