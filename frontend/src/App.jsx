import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CompaniesList from './pages/CompaniesList';
import CompanyDetails from './pages/CompanyDetails';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <h2>Placement Cell</h2>
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/companies">Companies</Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/companies" element={<CompaniesList />} />
            <Route path="/companies/:id" element={<CompanyDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
