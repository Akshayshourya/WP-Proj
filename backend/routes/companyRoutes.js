const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

// Global endpoints (must be defined before /:id routes to prevent conflict)
router.get('/shortlisted/all', companyController.getShortlisted);
router.get('/placed/all', companyController.getPlaced);

// Company endpoints
router.get('/', companyController.getAllCompanies);
router.post('/', companyController.createCompany);
router.get('/:id', companyController.getCompanyDetails);
router.get('/:id/eligible', companyController.getEligibleApplicants);

// Applicant tracking endpoints
router.put('/:cid/applicants/:aid/round', companyController.updateApplicantRound);
router.put('/:cid/applicants/:aid/offer', companyController.updateApplicantOffer);

module.exports = router;
