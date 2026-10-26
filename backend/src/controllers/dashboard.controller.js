const Enquiry = require("../models/Enquiry");
const Contact = require("../models/Contact");
async function getStats(req, res, next) {
  try {
    const [totalEnquiries, newEnquiries, activeProjects, totalClients, statusBreakdown, recentEnquiries] = await Promise.all([
      Enquiry.countDocuments({}),
      Enquiry.countDocuments({ status: "New" }),
      Enquiry.countDocuments({ status: "In Progress" }),
      Contact.countDocuments({}),
      Enquiry.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
      Enquiry.find({}).sort({ createdAt: -1 }).limit(5).select("name email service status createdAt").lean()
    ]);
    res.json({ success: true, data: {
      totalEnquiries, newEnquiries, activeProjects, totalClients,
      statusBreakdown: statusBreakdown.map(item => ({ status: item._id, count: item.count })),
      recentEnquiries
    } });
  } catch (error) { next(error); }
}
module.exports = { getStats };
