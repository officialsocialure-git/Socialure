const Contact = require("../models/Contact");
function escapeRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
async function listContacts(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 50));
    const filter = {};
    if (req.query.search) {
      const search = String(req.query.search).trim().slice(0, 100);
      if (search) filter.$or = ["name", "email", "company", "phone"].map(field => ({ [field]: { $regex: escapeRegex(search), $options: "i" } }));
    }
    const [data, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Contact.countDocuments(filter)
    ]);
    res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) { next(error); }
}
async function createContact(req, res, next) {
  try {
    const { name, email, phone = "", company = "", notes = "" } = req.body;
    const contact = await Contact.create({ name, email, phone, company, notes, createdBy: req.admin?.id || null });
    res.status(201).json({ success: true, message: "Contact created.", data: contact });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: "A contact with this email already exists." });
    next(error);
  }
}
async function updateContact(req, res, next) {
  try {
    const updates = {};
    for (const key of ["name", "email", "phone", "company", "notes"]) if (req.body[key] !== undefined) updates[key] = req.body[key];
    const contact = await Contact.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!contact) return res.status(404).json({ success: false, message: "Contact not found." });
    res.json({ success: true, message: "Contact updated.", data: contact });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: "A contact with this email already exists." });
    next(error);
  }
}
async function deleteContact(req, res, next) {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: "Contact not found." });
    res.json({ success: true, message: "Contact deleted." });
  } catch (error) { next(error); }
}
module.exports = { listContacts, createContact, updateContact, deleteContact };
