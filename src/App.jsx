
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

import ReportIssue from "./pages/ReportIssue";
import MyComplaints from "./pages/MyComplaints";
import TrackIssue from "./pages/TrackIssue";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <div className="badge">
            🏛️ SMART DIGITAL CIVIC SERVICES
          </div>

          <h1>
            Smart Civic Issues
            <br />
            <span>Reporting System</span>
          </h1>

          <p>
            Report local problems, track complaints, and help
            build a cleaner, safer, and smarter city.
          </p>

          <h2 className="role-heading">Choose Your Role</h2>

          <div className="hero-buttons role-buttons">
            <Link
              to="/admin-login"
              className="primary-btn role-choice-btn"
            >
              🛡️ Admin
            </Link>

            <Link
              to="/citizen"
              className="secondary-btn role-choice-btn"
            >
              👤 Citizen
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading">
          <h2>Our Services</h2>
          <p>
            Making civic issue reporting simple and transparent.
          </p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Easy Reporting</h3>
            <p>
              Report damaged roads, garbage, drainage and other civic problems.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Complaint Tracking</h3>
            <p>Check the progress of your reported civic issue.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Status Updates</h3>
            <p>Follow complaint progress from submission to resolution.</p>
          </div>
        </div>
      </section>

      <footer>
        <h3>Smart Civic Issues Reporting System</h3>
        <p>
          Building transparent and citizen-friendly digital governance.
        </p>
        <p className="copyright">
          © 2026 Smart Civic Issues System
        </p>
      </footer>
    </div>
  );
}

function CitizenPage() {
  return (
    <div className="citizen-page">
      <section className="hero">
        <div className="hero-content">
          <div className="badge">👤 CITIZEN SERVICES</div>

          <h1>
            Welcome, <span>Citizen!</span>
          </h1>

          <p>
            Report a new civic issue or track an existing complaint
            without creating an account.
          </p>

          <div className="hero-buttons citizen-actions">
            <Link to="/report" className="primary-btn role-choice-btn">
              📝 Report Issue
            </Link>

            <Link to="/track" className="secondary-btn role-choice-btn">
              🔍 Track Issue
            </Link>
          </div>

          <Link to="/" className="back-link">
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/" className="logo">
          🏛️ Smart Civic
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/citizen" element={<CitizenPage />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/track" element={<TrackIssue />} />
        <Route path="/complaints" element={<MyComplaints />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
