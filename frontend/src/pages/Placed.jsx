import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Placed = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaced = async () => {
      try {
        const response = await axios.get('http://localhost:5000/companies/placed/all');
        setCandidates(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching placed students:', error);
        setLoading(false);
      }
    };

    fetchPlaced();
  }, []);

  if (loading) return <div>Loading placed students...</div>;

  return (
    <div>
      <h1>Final Placed Students</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll Number</th>
              <th>Branch</th>
              <th>Company</th>
              <th>Final Package (LPA)</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {candidates.length > 0 ? (
              candidates.map(candidate => (
                <tr key={`${candidate.companyId}-${candidate._id}`} className="eligible-row">
                  <td>{candidate.name}</td>
                  <td>{candidate.roll}</td>
                  <td>{candidate.branch}</td>
                  <td>{candidate.companyName}</td>
                  <td><strong>{candidate.baseOffer} LPA</strong></td>
                  <td>
                    <Link to={`/candidate/${candidate.companyId}/${candidate._id}`} className="btn-small">View Details</Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No students placed yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Placed;
