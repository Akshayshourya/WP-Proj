import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [eligibleApplicants, setEligibleApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const [companyRes, eligibleRes] = await Promise.all([
          axios.get(`http://localhost:5000/companies/${id}`),
          axios.get(`http://localhost:5000/companies/${id}/eligible`)
        ]);
        
        setCompany(companyRes.data);
        setEligibleApplicants(eligibleRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching company details:', error);
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [id]);

  if (loading) return <div>Loading company details...</div>;
  if (!company) return <div>Company not found.</div>;

  const eligibleRollNumbers = new Set(eligibleApplicants.map(a => a.roll));

  return (
    <div>
      <Link to="/companies" style={{ display: 'inline-block', marginBottom: '1rem', color: '#2563eb', textDecoration: 'none' }}>
        &larr; Back to Companies
      </Link>
      
      <div className="company-header">
        <h1>{company.name}</h1>
        <p><strong>Minimum CGPA Requirement:</strong> {company.minCGPA}</p>
        <p><strong>Allowed Branches:</strong> {company.allowedBranches.join(', ')}</p>
      </div>

      <h2 className="section-title">All Applicants ({company.applicants.length})</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll Number</th>
              <th>Branch</th>
              <th>CGPA</th>
              <th>Interests</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {company.applicants.map(applicant => {
              const isEligible = eligibleRollNumbers.has(applicant.roll);
              return (
                <tr key={applicant.roll} className={isEligible ? 'eligible-row' : ''}>
                  <td>{applicant.name}</td>
                  <td>{applicant.roll}</td>
                  <td>{applicant.branch}</td>
                  <td>{applicant.cgpa}</td>
                  <td>{applicant.interests || 'N/A'}</td>
                  <td>
                    {isEligible ? (
                      <span className="status-badge status-eligible">Eligible</span>
                    ) : (
                      <span className="status-badge status-ineligible">Not Eligible</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">Eligible Applicants ({eligibleApplicants.length})</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll Number</th>
              <th>Branch</th>
              <th>CGPA</th>
              <th>Interests</th>
            </tr>
          </thead>
          <tbody>
            {eligibleApplicants.length > 0 ? (
              eligibleApplicants.map(applicant => (
                <tr key={`eligible-${applicant.roll}`}>
                  <td>{applicant.name}</td>
                  <td>{applicant.roll}</td>
                  <td>{applicant.branch}</td>
                  <td>{applicant.cgpa}</td>
                  <td>{applicant.interests || 'N/A'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No eligible applicants found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyDetails;
