import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [eligibleApplicants, setEligibleApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchCompanyData();
  }, [id]);

  const handleRoundUpdate = async (applicantId, status) => {
    try {
      await axios.put(`http://localhost:5000/companies/${id}/applicants/${applicantId}/round`, {
        status
      });
      // Refresh data
      fetchCompanyData();
    } catch (error) {
      console.error('Error updating round status:', error);
      alert('Error updating round');
    }
  };

  if (loading) return <div>Loading company details...</div>;
  if (!company) return <div>Company not found.</div>;

  const eligibleRollNumbers = new Set(eligibleApplicants.map(a => a.roll));

  return (
    <div>
      <Link to="/companies" className="back-link">&larr; Back to Companies</Link>
      
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
              <th>Status</th>
              <th>Details</th>
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
                  <td>
                    {isEligible ? (
                      <span className="status-badge status-eligible">Eligible</span>
                    ) : (
                      <span className="status-badge status-ineligible">Not Eligible</span>
                    )}
                  </td>
                  <td>
                    <Link to={`/candidate/${id}/${applicant._id}`} className="btn-small">View</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">Eligible Applicants Interview Pipeline ({eligibleApplicants.length})</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll Number</th>
              <th>Current Phase</th>
              <th>Action</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {eligibleApplicants.length > 0 ? (
              eligibleApplicants.map(applicant => {
                const isCompleted = applicant.currentRound > 2;
                const isFailed = applicant.rounds.some(r => r.status === 'Failed');
                
                let phaseText = '';
                if (applicant.isShortlisted) phaseText = 'Shortlisted! 🏆';
                else if (isFailed) phaseText = 'Eliminated ❌';
                else phaseText = `Round ${applicant.currentRound + 1}: ${applicant.rounds[applicant.currentRound]?.roundName || 'Finished'}`;

                return (
                <tr key={`eligible-${applicant.roll}`}>
                  <td>{applicant.name}</td>
                  <td>{applicant.roll}</td>
                  <td><strong>{phaseText}</strong></td>
                  <td>
                    {!isCompleted && !isFailed && !applicant.isShortlisted && (
                      <div style={{display: 'flex', gap: '0.5rem'}}>
                        <button className="btn-success" onClick={() => handleRoundUpdate(applicant._id, 'Passed')}>Pass</button>
                        <button className="btn-danger" onClick={() => handleRoundUpdate(applicant._id, 'Failed')}>Fail</button>
                      </div>
                    )}
                  </td>
                  <td>
                    <Link to={`/candidate/${id}/${applicant._id}`} className="btn-small">Details</Link>
                  </td>
                </tr>
                );
              })
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
