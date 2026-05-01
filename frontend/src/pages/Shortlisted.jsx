import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Shortlisted = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShortlisted = async () => {
    try {
      const response = await axios.get('http://localhost:5000/companies/shortlisted/all');
      setCandidates(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching shortlisted:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlisted();
  }, []);

  const handleOfferUpdate = async (companyId, applicantId, offerStatus, baseOffer) => {
    try {
      await axios.put(`http://localhost:5000/companies/${companyId}/applicants/${applicantId}/offer`, {
        offerStatus,
        baseOffer
      });
      fetchShortlisted();
    } catch (error) {
      console.error('Error updating offer:', error);
      alert('Error updating offer');
    }
  };

  if (loading) return <div>Loading shortlisted candidates...</div>;

  return (
    <div>
      <h1>Shortlisted Candidates</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll Number</th>
              <th>Company</th>
              <th>Base Offer (LPA)</th>
              <th>Offer Status</th>
              <th>Actions</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {candidates.length > 0 ? (
              candidates.map(candidate => (
                <tr key={`${candidate.companyId}-${candidate._id}`}>
                  <td>{candidate.name}</td>
                  <td>{candidate.roll}</td>
                  <td>{candidate.companyName}</td>
                  <td>
                    <input 
                      type="number" 
                      defaultValue={candidate.baseOffer}
                      onBlur={(e) => handleOfferUpdate(candidate.companyId, candidate._id, candidate.offerStatus, Number(e.target.value))}
                      style={{width: '80px'}}
                    />
                  </td>
                  <td>
                    <select 
                      value={candidate.offerStatus}
                      onChange={(e) => handleOfferUpdate(candidate.companyId, candidate._id, e.target.value, candidate.baseOffer)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Revoked">Revoked</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn-small" onClick={() => handleOfferUpdate(candidate.companyId, candidate._id, candidate.offerStatus, candidate.baseOffer)}>Save</button>
                  </td>
                  <td>
                    <Link to={`/candidate/${candidate.companyId}/${candidate._id}`} className="btn-small">View Round Details</Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No shortlisted candidates yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Shortlisted;
