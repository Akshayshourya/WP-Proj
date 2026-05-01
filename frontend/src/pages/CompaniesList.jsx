import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CompaniesList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get('http://localhost:5000/companies');
        setCompanies(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching companies:', error);
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (loading) return <div>Loading companies...</div>;

  return (
    <div>
      <h1>Companies</h1>
      <div className="companies-grid">
        {companies.map(company => (
          <Link to={`/companies/${company._id}`} key={company._id} className="company-card">
            <h3>{company.name}</h3>
            <p><strong>Min CGPA:</strong> {company.minCGPA}</p>
            <p><strong>Allowed Branches:</strong> {company.allowedBranches.join(', ')}</p>
            <p><strong>Applicants:</strong> {company.applicants.length}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CompaniesList;
