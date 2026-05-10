import nodemailer from "nodemailer";
import { db, settingsTable } from "@workspace/db";
import { logger } from "./logger";

interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  licenseKey: string | null;
}

interface DeliveryPayload {
  orderId: number;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  discount: number | null;
  paymentMethod: string;
}

async function getSmtpSettings(): Promise<{
  host: string;
  port: number;
  user: string;
  pass: string;
  siteName: string;
  contactEmail: string;
} | null> {
  const rows = await db.select().from(settingsTable);
  const s: Record<string, string> = {};
  for (const row of rows) s[row.key] = row.value;

  if (!s.smtp_host || !s.smtp_user || !s.smtp_pass) return null;

  return {
    host: s.smtp_host,
    port: parseInt(s.smtp_port ?? "587", 10),
    user: s.smtp_user,
    pass: s.smtp_pass,
    siteName: s.site_name ?? "SoftKeys Store",
    contactEmail: s.contact_email ?? s.smtp_user,
  };
}

function buildEmailHtml(payload: DeliveryPayload, siteName: string, contactEmail: string): string {
  const itemRows = payload.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 16px;border-bottom:1px solid #1a1a1a;">
          <strong style="color:#ffffff;display:block;">${item.productName}</strong>
          <span style="color:#888;font-size:13px;">Qty: ${item.quantity} &times; €${item.unitPrice.toFixed(2)}</span>
        </td>
        <td style="padding:12px 16px;border-bottom:1px solid #1a1a1a;text-align:right;vertical-align:top;">
          ${
            item.licenseKey
              ? `<code style="display:inline-block;background:#111;border:1px solid #c6f135;color:#c6f135;padding:4px 10px;border-radius:6px;font-size:13px;letter-spacing:1px;font-family:monospace;">${item.licenseKey}</code>`
              : `<span style="color:#888;">No key</span>`
          }
        </td>
      </tr>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#050505;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Header -->
        <tr>
          <td style="padding-bottom:32px;text-align:center;">
            <div style="display:inline-flex;align-items:center;gap:10px;">
              <div style="width:36px;height:36px;background:#c6f135;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;">
                <span style="font-size:18px;font-weight:900;color:#000;">&#9889;</span>
              </div>
              <span style="font-size:22px;font-weight:900;color:#ffffff;vertical-align:middle;">${siteName}</span>
            </div>
          </td>
        </tr>

        <!-- Card -->
        <tr>
          <td style="background:#0d0d0d;border:1px solid #1a1a1a;border-radius:16px;overflow:hidden;">

            <!-- Success banner -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:linear-gradient(135deg,#c6f135 0%,#a8d420 100%);padding:24px 32px;">
                  <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#000;opacity:.7;">Order Confirmed</p>
                  <p style="margin:6px 0 0;font-size:24px;font-weight:900;color:#000;">Your license keys are ready! &#127775;</p>
                </td>
              </tr>
            </table>

            <!-- Greeting -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:24px 32px 8px;">
                  <p style="margin:0;color:#aaa;font-size:15px;line-height:1.6;">
                    Hi <strong style="color:#fff;">${payload.customerName}</strong>,<br>
                    Thank you for your order <strong style="color:#c6f135;">#${payload.orderId}</strong>.
                    Your software license keys are below — copy them and activate right away.
                  </p>
                </td>
              </tr>
            </table>

            <!-- Keys table -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #1a1a1a;margin-top:16px;">
              <thead>
                <tr>
                  <th style="padding:10px 16px;text-align:left;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#555;background:#0a0a0a;">Product</th>
                  <th style="padding:10px 16px;text-align:right;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#555;background:#0a0a0a;">License Key</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
              </tbody>
            </table>

            <!-- Total -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #1a1a1a;">
              <tr>
                <td style="padding:16px 32px;text-align:right;">
                  ${payload.discount ? `<p style="margin:0 0 4px;color:#888;font-size:13px;">Discount: <span style="color:#c6f135;">-€${payload.discount.toFixed(2)}</span></p>` : ""}
                  <p style="margin:0;font-size:18px;font-weight:900;color:#fff;">Total: <span style="color:#c6f135;">€${payload.total.toFixed(2)}</span></p>
                  <p style="margin:4px 0 0;color:#666;font-size:12px;text-transform:capitalize;">Payment: ${payload.paymentMethod}</p>
                </td>
              </tr>
            </table>

            <!-- Activation help -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #1a1a1a;background:#0a0a0a;">
              <tr>
                <td style="padding:20px 32px;">
                  <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#555;">How to activate</p>
                  <p style="margin:0;color:#666;font-size:13px;line-height:1.7;">
                    1. Copy your license key above.<br>
                    2. Open the software and locate the activation/license screen.<br>
                    3. Paste the key and complete activation.<br>
                    4. Need help? Visit our <a href="#" style="color:#c6f135;text-decoration:none;">Activation Guides</a>.
                  </p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 0 0;text-align:center;">
            <p style="margin:0;color:#444;font-size:12px;">
              Questions? Reply to this email or contact us at <a href="mailto:${contactEmail}" style="color:#c6f135;text-decoration:none;">${contactEmail}</a>
            </p>
            <p style="margin:8px 0 0;color:#333;font-size:11px;">&copy; ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildEmailText(payload: DeliveryPayload, siteName: string): string {
  const lines = [
    `${siteName} — Order Confirmation #${payload.orderId}`,
    ``,
    `Hi ${payload.customerName},`,
    ``,
    `Thank you for your order! Here are your license keys:`,
    ``,
    ...payload.items.map(
      (item) =>
        `• ${item.productName} (x${item.quantity})\n  License Key: ${item.licenseKey ?? "N/A"}`,
    ),
    ``,
    `Total: €${payload.total.toFixed(2)}${payload.discount ? ` (discount: -€${payload.discount.toFixed(2)})` : ""}`,
    `Payment method: ${payload.paymentMethod}`,
    ``,
    `Keep this email safe — your license keys won't be re-generated.`,
  ];
  return lines.join("\n");
}

export async function sendOrderDeliveryEmail(payload: DeliveryPayload): Promise<{ sent: boolean; error?: string }> {
  const smtp = await getSmtpSettings();

  if (!smtp) {
    logger.warn({ orderId: payload.orderId }, "SMTP not configured — skipping delivery email");
    return { sent: false, error: "SMTP not configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: { user: smtp.user, pass: smtp.pass },
    });

    await transporter.sendMail({
      from: `"${smtp.siteName}" <${smtp.user}>`,
      to: payload.customerEmail,
      subject: `Your license keys for Order #${payload.orderId} — ${smtp.siteName}`,
      text: buildEmailText(payload, smtp.siteName),
      html: buildEmailHtml(payload, smtp.siteName, smtp.contactEmail),
    });

    logger.info({ orderId: payload.orderId, to: payload.customerEmail }, "Delivery email sent");
    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error({ orderId: payload.orderId, err: message }, "Failed to send delivery email");
    return { sent: false, error: message };
  }
}
