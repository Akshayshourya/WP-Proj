import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CandidateDetails = () => {
  const { companyId, applicantId } = useParams();
  const [applicant, setApplicant] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/companies/${companyId}`);
        const company = response.data;
        setCompanyName(company.name);
        
        const foundApplicant = company.applicants.find(app => app._id === applicantId);
        setApplicant(foundApplicant);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching candidate details:', error);
        setLoading(false);
      }
    };

    fetchDetails();
  }, [companyId, applicantId]);

  if (loading) return <div>Loading details...</div>;
  if (!applicant) return <div>Candidate not found.</div>;

  return (
    <div>
      <Link to={`/companies/${companyId}`} className="back-link">&larr; Back to Company</Link>
      
      <div className="company-header">
        <h1>{applicant.name} ({applicant.roll})</h1>
        <p><strong>Branch:</strong> {applicant.branch}</p>
        <p><strong>CGPA:</strong> {applicant.cgpa}</p>
        <p><strong>Applying to:</strong> {companyName}</p>
      </div>

      <h2 className="section-title">Interview Rounds Details</h2>
      <div className="table-container" style={{maxWidth: '800px'}}>
        <table>
          <thead>
            <tr>
              <th>Round #</th>
              <th>Round Name</th>
              <th>Marks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {applicant.rounds.map((round, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{round.roundName}</td>
                <td>
                  {round.marks === null || round.marks === undefined 
                    ? 'N/A' 
                    : round.maxMarks 
                      ? `${round.marks} / ${round.maxMarks}` 
                      : round.marks}
                </td>
                <td>
                  <span className={`status-badge status-${round.status.toLowerCase()}`}>
                    {round.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">Offer Status</h2>
      <div className="stat-card" style={{maxWidth: '400px', textAlign: 'left', padding: '1.5rem'}}>
        <p><strong>Shortlisted:</strong> {applicant.isShortlisted ? 'Yes ✅' : 'No ❌'}</p>
        <p><strong>Base Offer:</strong> {applicant.baseOffer > 0 ? `${applicant.baseOffer} LPA` : 'N/A'}</p>
        <p><strong>Current Status:</strong> {applicant.offerStatus}</p>
      </div>
    </div>
  );
};

export default CandidateDetails;
