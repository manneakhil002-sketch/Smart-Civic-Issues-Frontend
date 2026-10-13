
import { useEffect, useState } from "react";
import "./AdminDashboard.css";

const API = "http://localhost:8080/api/issues";

function Admin() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [busyId, setBusyId] = useState(null);

  const loadIssues = async () => {
    setLoading(true);
    try {
      const response = await fetch(API);
      if (!response.ok) throw new Error("Unable to load complaints");

      const data = await response.json();
      setIssues(Array.isArray(data) ? data : []);
      setMessage("");
    } catch (error) {
      console.error(error);
      setMessage("Unable to load complaints. Check the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const updateStatus = async (id, status) => {
    setBusyId(id);
    setMessage("");

    try {
      const response = await fetch(`${API}/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Status update failed");

      setIssues((previous) =>
        previous.map((issue) =>
          issue.id === id ? { ...issue, status } : issue
        )
      );
      setMessage("Complaint status updated successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Unable to update status.");
    } finally {
      setBusyId(null);
    }
  };

  const deleteIssue = async (id) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete complaint CIV${String(
        id
      ).padStart(3, "0")}?`
    );

    if (!confirmed) return;

    setBusyId(id);
    setMessage("");

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed. Check the backend API.");
      }

      setIssues((previous) =>
        previous.filter((issue) => issue.id !== id)
      );
      setMessage("Complaint deleted successfully.");
    } catch (error) {
      console.error(error);
      setMessage("Unable to delete complaint. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  const query = search.toLowerCase().trim();

  const filteredIssues = issues.filter((issue) => {
    const searchableText = [
      `CIV${String(issue.id).padStart(3, "0")}`,
      issue.title,
      issue.category,
      issue.location,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return (
      searchableText.includes(query) &&
      (filterStatus === "All" || issue.status === filterStatus)
    );
  });

  const pending = issues.filter((i) => i.status === "Pending").length;
  const inProgress = issues.filter(
    (i) => i.status === "In Progress"
  ).length;
  const resolved = issues.filter((i) => i.status === "Resolved").length;

  if (loading) {
    return <div className="admin-loading">Loading complaints...</div>;
  }

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-brand">🏛 Smart Civic</div>
        <p className="sidebar-heading">MANAGEMENT</p>
        <div className="admin-nav-item active">▦ Dashboard</div>
        <div className="admin-nav-item">▤ Complaints</div>
        <div className="sidebar-footer">Civic Management Portal</div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="dashboard-eyebrow">CIVIC MANAGEMENT PORTAL</p>
            <h1>Admin Dashboard</h1>
            <p className="admin-subtitle">
              Manage and track reported civic issues.
            </p>
          </div>

          <button
            type="button"
            className="refresh-button"
            onClick={loadIssues}
          >
            ↻ Refresh Issues
          </button>
        </header>

        {message && (
          <div
            className={
              message.startsWith("Unable")
                ? "admin-error"
                : "admin-message"
            }
            role="status"
          >
            {message}
          </div>
        )}

        <section className="admin-stats">
          <div className="admin-stat-card total-card">
            <p>Total Complaints</p>
            <h2>{issues.length}</h2>
            <span>All reported issues</span>
          </div>
          <div className="admin-stat-card pending-card">
            <p>Pending</p>
            <h2>{pending}</h2>
            <span>Awaiting action</span>
          </div>
          <div className="admin-stat-card progress-card">
            <p>In Progress</p>
            <h2>{inProgress}</h2>
            <span>Being handled</span>
          </div>
          <div className="admin-stat-card resolved-card">
            <p>Resolved</p>
            <h2>{resolved}</h2>
            <span>Completed issues</span>
          </div>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Reported Complaints</h2>
              <p>Review complaints and manage their status.</p>
            </div>
            <span className="record-count">
              {filteredIssues.length} records
            </span>
          </div>

          <div className="admin-controls">
            <input
              type="search"
              className="admin-search"
              placeholder="Search ID, issue or location..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search complaints"
            />

            <select
              className="admin-filter"
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value)}
              aria-label="Filter complaints by status"
            >
              <option value="All">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          {filteredIssues.length === 0 ? (
            <div className="admin-empty">
              <h3>No complaints found</h3>
              <p>Try changing your search or status filter.</p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Complaint ID</th>
                    <th>Issue</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Update Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIssues.map((issue) => {
                    const status = issue.status || "Pending";
                    const statusClass = status
                      .toLowerCase()
                      .replace(/\s+/g, "-");

                    return (
                      <tr key={issue.id}>
                        <td>
                          <span className="complaint-id">
                            CIV{String(issue.id).padStart(3, "0")}
                          </span>
                        </td>
                        <td className="issue-title">
                          {issue.title || "Untitled issue"}
                        </td>
                        <td>{issue.category || "Other"}</td>
                        <td>{issue.location || "Not specified"}</td>
                        <td>
                          <span
                            className={`status-badge status-${statusClass}`}
                          >
                            {status}
                          </span>
                        </td>
                        <td>
                          <select
                            className="status-select"
                            value={status}
                            disabled={busyId === issue.id}
                            onChange={(event) =>
                              updateStatus(issue.id, event.target.value)
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="delete-button"
                            disabled={busyId === issue.id}
                            onClick={() => deleteIssue(issue.id)}
                          >
                            {busyId === issue.id ? "Please wait..." : "Delete"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="dashboard-footer">
          Smart Civic Issues Reporting System
        </footer>
      </main>
    </div>
  );
}

export default Admin;
