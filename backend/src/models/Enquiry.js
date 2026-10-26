const mongoose = require("mongoose");
const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, trim: true, lowercase: true, maxlength: 254, default: "" },
  phone: { type: String, trim: true, maxlength: 40, default: "" },
  company: { type: String, trim: true, maxlength: 160, default: "" },
  service: { type: String, trim: true, maxlength: 120, default: "" },
  budget: { type: String, trim: true, maxlength: 120, default: "" },
  message: { type: String, required: true, trim: true, maxlength: 5000 },
  source: { type: String, trim: true, maxlength: 120, default: "Website" },
  status: { type: String, enum: ["New", "Contacted", "In Progress", "Completed", "Closed"], default: "New", index: true },
  notes: { type: String, trim: true, maxlength: 5000, default: "" },
  contactedAt: { type: Date, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null }
}, { timestamps: true });
enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ email: 1 });
enquirySchema.index({ name: "text", email: "text", company: "text", message: "text" });
module.exports = mongoose.models.Enquiry || mongoose.model("Enquiry", enquirySchema);
