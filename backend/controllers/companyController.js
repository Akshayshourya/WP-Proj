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

// Update applicant round status
exports.updateApplicantRound = async (req, res) => {
  try {
    const { cid, aid } = req.params;
    const { status, marks } = req.body;

    const company = await Company.findById(cid);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    const applicant = company.applicants.id(aid);
    if (!applicant) return res.status(404).json({ message: 'Applicant not found' });

    if (applicant.currentRound > 2) {
      return res.status(400).json({ message: 'All rounds already completed' });
    }

    // Update current round status
    applicant.rounds[applicant.currentRound].status = status;
    if (marks !== undefined) {
      applicant.rounds[applicant.currentRound].marks = marks;
    }

    if (status === 'Passed') {
      if (applicant.currentRound === 2) {
        // Passed final HR round
        applicant.isShortlisted = true;
        // Advance current round so it doesn't show as pending active
        applicant.currentRound += 1;
      } else {
        // Move to next round
        applicant.currentRound += 1;
      }
    } else if (status === 'Failed') {
      // Failed, doesn't move to next round
    }

    await company.save();
    res.json(applicant);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Update applicant offer
exports.updateApplicantOffer = async (req, res) => {
  try {
    const { cid, aid } = req.params;
    const { offerStatus, baseOffer } = req.body;

    const company = await Company.findById(cid);
    if (!company) return res.status(404).json({ message: 'Company not found' });

    const applicant = company.applicants.id(aid);
    if (!applicant) return res.status(404).json({ message: 'Applicant not found' });

    if (offerStatus !== undefined) applicant.offerStatus = offerStatus;
    if (baseOffer !== undefined) applicant.baseOffer = baseOffer;

    await company.save();
    res.json(applicant);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get all shortlisted candidates
exports.getShortlisted = async (req, res) => {
  try {
    const companies = await Company.find({});
    let shortlisted = [];

    companies.forEach(company => {
      const candidates = company.applicants.filter(app => app.isShortlisted);
      candidates.forEach(candidate => {
        // Attach company info for the frontend
        const candObj = candidate.toObject();
        candObj.companyName = company.name;
        candObj.companyId = company._id;
        shortlisted.push(candObj);
      });
    });

    res.json(shortlisted);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Get all placed students
exports.getPlaced = async (req, res) => {
  try {
    const companies = await Company.find({});
    let placed = [];

    companies.forEach(company => {
      const candidates = company.applicants.filter(app => app.offerStatus === 'Accepted');
      candidates.forEach(candidate => {
        const candObj = candidate.toObject();
        candObj.companyName = company.name;
        candObj.companyId = company._id;
        placed.push(candObj);
      });
    });

    res.json(placed);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};
