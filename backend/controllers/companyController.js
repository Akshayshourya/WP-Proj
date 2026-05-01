const Company = require('../models/Company');

// Get all companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({});
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Create a new company
exports.createCompany = async (req, res) => {
  try {
    const newCompany = new Company(req.body);
    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany);
  } catch (error) {
    res.status(400).json({ message: 'Error creating company', error });
  }
};

// Get company details
exports.getCompanyDetails = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get eligible applicants for a company
exports.getEligibleApplicants = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const { minCGPA, allowedBranches, applicants } = company;

    // Filter logic: CGPA >= minCGPA AND branch is in allowedBranches
    const eligibleApplicants = applicants.filter(
      (applicant) => 
        applicant.cgpa >= minCGPA && 
        allowedBranches.includes(applicant.branch)
    );

    res.json(eligibleApplicants);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
