const nodemailer = require("nodemailer");
function emailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.NOTIFICATION_FROM && process.env.NOTIFICATION_TO);
}
async function sendEnquiryEmail(enquiry) {
  if (!emailConfigured()) return { sent: false, skipped: true, channel: "email", reason: "SMTP settings are not configured" };
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT) || 587,
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  await transporter.sendMail({
    from: process.env.NOTIFICATION_FROM, to: process.env.NOTIFICATION_TO,
    subject: `New website enquiry: ${String(enquiry.name).replace(/[<>]/g, "")}`,
    text: [
      "A new enquiry was submitted on the website.",
      `Name: ${enquiry.name}`, `Email: ${enquiry.email}`,
      `Phone: ${enquiry.phone || "Not provided"}`, `Company: ${enquiry.company || "Not provided"}`,
      `Service: ${enquiry.service || "Not specified"}`, `Message: ${enquiry.message}`
    ].join("\n")
  });
  return { sent: true, channel: "email" };
}
async function sendWhatsAppNotification(enquiry) {
  const { WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_RECIPIENT_NUMBER } = process.env;
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_RECIPIENT_NUMBER) {
    return { sent: false, skipped: true, channel: "whatsapp", reason: "WhatsApp Cloud API settings are not configured" };
  }
  const version = process.env.WHATSAPP_API_VERSION || "v21.0";
  const response = await fetch(`https://graph.facebook.com/${version}/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp", recipient_type: "individual", to: WHATSAPP_RECIPIENT_NUMBER,
      type: "text", text: { preview_url: false, body:
        `New website enquiry\nName: ${enquiry.name}\nEmail: ${enquiry.email}\nPhone: ${enquiry.phone || "Not provided"}\nService: ${enquiry.service || "Not specified"}\nMessage: ${enquiry.message}` }
    })
  });
  if (!response.ok) throw new Error(`WhatsApp notification failed with status ${response.status}: ${(await response.text()).slice(0, 300)}`);
  return { sent: true, channel: "whatsapp" };
}
async function notifyNewEnquiry(enquiry) {
  const results = await Promise.allSettled([sendEnquiryEmail(enquiry), sendWhatsAppNotification(enquiry)]);
  return results.map(result => result.status === "fulfilled" ? result.value :
    { sent: false, channel: "notification", error: result.reason.message });
}
module.exports = { notifyNewEnquiry, sendEnquiryEmail, sendWhatsAppNotification };
