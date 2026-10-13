
import { useState } from "react";
import "./TrackIssue.css";

function TrackIssue() {
  const [complaintId, setComplaintId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();

    const enteredId = complaintId.trim().toUpperCase();

    if (!enteredId) {
      setError("Please enter your complaint ID.");
      setComplaint(null);
      return;
    }

    setLoading(true);
    setError("");
    setComplaint(null);

    try {
      const response = await fetch("http://localhost:8080/api/issues");

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data = await response.json();

      const foundComplaint = data.find((item) => {
        const id = String(item.id);

        return (
          id === enteredId ||
          `CIV${id.padStart(3, "0")}` === enteredId
        );
      });

      if (foundComplaint) {
        setComplaint(foundComplaint);
      } else {
        setError("Complaint ID not found. Please check the ID and try again.");
      }
    } catch (err) {
      console.error("Track issue error:", err);
      setError(
        "Unable to retrieve your complaint. Please check the backend connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const status = String(complaint?.status || "Pending");
  const normalizedStatus = status.toLowerCase().replace(/[_-]/g, " ");

  let statusClass = "pending";

  if (normalizedStatus.includes("progress")) {
    statusClass = "in-progress";
  } else if (
    normalizedStatus.includes("resolved") ||
    normalizedStatus.includes("completed")
  ) {
    statusClass = "resolved";
  } else if (
    normalizedStatus.includes("reject") ||
    normalizedStatus.includes("closed")
  ) {
    statusClass = "rejected";
  }

  return (
    <main className="track-page">
      <div className="track-heading">
        <span className="track-badge">CITIZEN SERVICES</span>
        <h1>Track Your Complaint</h1>
        <p>
          Follow the progress of your civic issue and check its latest status.
        </p>
      </div>

      <section className="track-card">
        <div className="track-card-heading">
          <div className="track-heading-icon">🔍</div>
          <div>
            <h2>Complaint Tracking</h2>
            <p>Enter the complaint ID you received after reporting an issue.</p>
          </div>
        </div>

        <form className="track-form" onSubmit={handleTrack}>
          <div className="track-field">
            <label htmlFor="complaint-id">Complaint ID *</label>
            <input
              id="complaint-id"
              type="text"
              placeholder="Example: CIV001"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              maxLength={30}
              required
            />
            <small>Example: CIV001 or the numeric ID provided by the system.</small>
          </div>

          <button
            className="track-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Checking..." : "Track Complaint →"}
          </button>
        </form>

        {error && (
          <div className="track-message error" role="alert">
            {error}
          </div>
        )}

        {complaint && (
          <section className="track-result" aria-live="polite">
            <div className="track-result-heading">
              <div>
                <span className="result-label">COMPLAINT NUMBER</span>
                <h2>
                  CIV{String(complaint.id).padStart(3, "0")}
                </h2>
              </div>

              <span className={`status-badge ${statusClass}`}>
                {status}
              </span>
            </div>

            <div className="track-detail">
              <span>Issue Title</span>
              <p>{complaint.title || "Not provided"}</p>
            </div>

            <div className="track-detail">
              <span>Category</span>
              <p>{complaint.category || "Not provided"}</p>
            </div>

            {complaint.description && (
              <div className="track-detail">
                <span>Description</span>
                <p>{complaint.description}</p>
              </div>
            )}

            {complaint.location && (
              <div className="track-detail">
                <span>Location</span>
                <p>{complaint.location}</p>
              </div>
            )}

            <div className="track-progress">
              <h3>Resolution Progress</h3>

              <div className="progress-steps">
                <div className="progress-step completed">
                  <span>1</span>
                  <p>Reported</p>
                </div>

                <div
                  className={`progress-step ${
                    statusClass === "in-progress" ||
                    statusClass === "resolved"
                      ? "completed"
                      : ""
                  }`}
                >
                  <span>2</span>
                  <p>In Progress</p>
                </div>

                <div
                  className={`progress-step ${
                    statusClass === "resolved" ? "completed" : ""
                  }`}
                >
                  <span>3</span>
                  <p>Resolved</p>
                </div>
              </div>

              {statusClass === "rejected" && (
                <p className="track-status-note">
                  This complaint is marked as {status}.
                </p>
              )}
            </div>
          </section>
        )}
      </section>

      <p className="track-note">
        Keep your complaint ID safe so you can check its status later.
      </p>
    </main>
  );
}

export default TrackIssue;
