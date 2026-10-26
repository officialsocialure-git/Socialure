const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, trim: true, maxlength: 40, default: "" },
  company: { type: String, trim: true, maxlength: 160, default: "" },
  notes: { type: String, trim: true, maxlength: 3000, default: "" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null }
}, { timestamps: true });
contactSchema.index({ email: 1 }, { unique: true });
contactSchema.index({ name: "text", email: "text", company: "text" });
module.exports = mongoose.models.Contact || mongoose.model("Contact", contactSchema);
