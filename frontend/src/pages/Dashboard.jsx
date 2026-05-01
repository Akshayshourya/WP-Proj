import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalApplicants: 0,
    totalEligible: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/companies');
        const companies = response.data;
        
        let totalApplicants = 0;
        let totalEligible = 0;

        companies.forEach(company => {
          totalApplicants += company.applicants.length;
          
          const eligible = company.applicants.filter(app => 
            app.cgpa >= company.minCGPA && 
            company.allowedBranches.includes(app.branch)
          );
          totalEligible += eligible.length;
        });

        setStats({
          totalCompanies: companies.length,
          totalApplicants,
          totalEligible
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Companies</h3>
          <p className="value">{stats.totalCompanies}</p>
        </div>
        <div className="stat-card">
          <h3>Total Applicants</h3>
          <p className="value">{stats.totalApplicants}</p>
        </div>
        <div className="stat-card">
          <h3>Total Eligible Students</h3>
          <p className="value">{stats.totalEligible}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
