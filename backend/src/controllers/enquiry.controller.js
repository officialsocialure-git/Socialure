const { sendEnquiryEmail } = require("../services/notification.service");

async function createEnquiry(req, res) {
  const { name, email, phone, company, service, budget, message, source } = req.body;
  const enquiry = {
    name: String(name).trim(),
    email: email ? String(email).trim() : "",
    phone: String(phone).trim(),
    company: company ? String(company).trim() : "",
    service: String(service).trim(),
    budget: String(budget).trim(),
    message: message ? String(message).trim() : "",
    source: source ? String(source).trim() : "Website Contact Form",
    submittedAt: new Date().toISOString()
  };

  try {
    const emailResult = await sendEnquiryEmail(enquiry);
    if (!emailResult.sent) {
      console.error("Enquiry email was not sent because SMTP is not configured.");
      return res.status(503).json({
        success: false,
        message: "The contact form is temporarily unavailable. Please try again later."
      });
    }
    return res.status(200).json({
      success: true,
      message: "Thanks! Your enquiry has been sent successfully."
    });
  } catch (error) {
    console.error("Unable to send enquiry email:", error.message);
    return res.status(502).json({
      success: false,
      message: "We couldn't send your enquiry right now. Please try again in a moment."
    });
  }
}

module.exports = { createEnquiry };
