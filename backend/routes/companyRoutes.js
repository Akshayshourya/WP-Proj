const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');

router.get('/', companyController.getAllCompanies);
router.post('/', companyController.createCompany);
router.get('/:id', companyController.getCompanyDetails);
router.get('/:id/eligible', companyController.getEligibleApplicants);

module.exports = router;
