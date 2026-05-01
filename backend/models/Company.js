const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roll: { type: String, required: true },
  cgpa: { type: Number, required: true },
  branch: { type: String, required: true },
  interests: { type: String }
});

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  minCGPA: { type: Number, required: true },
  allowedBranches: [{ type: String, required: true }],
  applicants: [applicantSchema]
});

module.exports = mongoose.model('Company', companySchema);
