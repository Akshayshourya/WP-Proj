const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  roundName: { type: String, enum: ['Coding', 'Technical', 'HR'], required: true },
  status: { type: String, enum: ['Pending', 'Passed', 'Failed'], default: 'Pending' },
  marks: { type: Number, default: 0 }
});

const applicantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roll: { type: String, required: true },
  cgpa: { type: Number, required: true },
  branch: { type: String, required: true },
  interests: { type: String },
  rounds: {
    type: [roundSchema],
    default: () => [
      { roundName: 'Coding', status: 'Pending', marks: 0 },
      { roundName: 'Technical', status: 'Pending', marks: 0 },
      { roundName: 'HR', status: 'Pending', marks: 0 }
    ]
  },
  currentRound: { type: Number, default: 0 },
  isShortlisted: { type: Boolean, default: false },
  baseOffer: { type: Number, default: 0 },
  offerStatus: { type: String, enum: ['Pending', 'Accepted', 'Rejected', 'Revoked'], default: 'Pending' }
});

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  minCGPA: { type: Number, required: true },
  allowedBranches: [{ type: String, required: true }],
  applicants: [applicantSchema]
});

module.exports = mongoose.model('Company', companySchema);
