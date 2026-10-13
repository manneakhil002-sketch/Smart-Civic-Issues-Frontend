
import { useState } from "react";
import "./ReportIssue.css";

function ReportIssue() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !category || !description.trim() || !location.trim()) {
      setMessageType("error");
      setMessage("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    const issue = {
      title: title.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      status: "Pending",
    };

    try {
      const response = await fetch("http://localhost:8080/api/issues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(issue),
      });

      const responseText = await response.text();
      let savedIssue = {};

      if (responseText) {
        try {
          savedIssue = JSON.parse(responseText);
        } catch {
          savedIssue = {};
        }
      }

      if (!response.ok) {
        throw new Error(
          responseText ||
            `Server returned HTTP ${response.status} ${response.statusText}`
        );
      }

      setMessageType("success");
      setMessage(
        `Issue submitted successfully! ${
          savedIssue.id != null
            ? `Complaint ID: CIV${String(savedIssue.id).padStart(3, "0")}`
            : "Please check the tracking page for your complaint details."
        }`
      );

      setTitle("");
      setCategory("");
      setDescription("");
      setLocation("");
    } catch (error) {
      console.error("Issue submission failed:", error);
      setMessageType("error");
      setMessage(
        `Unable to submit issue: ${error.message}. Check that the backend is running and inspect the browser console for details.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="report-page">
      <div className="report-heading">
        <span className="report-badge">CITIZEN SERVICES</span>
        <h1>Report a Civic Issue</h1>
        <p>
          Help improve your community. Tell us about the problem so the
          concerned department can review it.
        </p>
      </div>

      <section className="report-card">
        <div className="report-card-heading">
          <div className="report-heading-icon">📝</div>
          <div>
            <h2>Complaint Details</h2>
            <p>Fields marked with * are required.</p>
          </div>
        </div>

        <form className="report-form" onSubmit={handleSubmit}>
          <div className="report-field">
            <label htmlFor="issue-title">Issue Title *</label>
            <input
              id="issue-title"
              type="text"
              placeholder="Example: Damaged road near main street"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={150}
              required
            />
          </div>

          <div className="report-field">
            <label htmlFor="issue-category">Category *</label>
            <select
              id="issue-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              <option value="Road">Road</option>
              <option value="Garbage">Garbage</option>
              <option value="Drainage">Drainage</option>
              <option value="Street Light">Street Light</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="report-field">
            <label htmlFor="issue-description">Description *</label>
            <textarea
              id="issue-description"
              placeholder="Describe the problem and any important details..."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              required
            />
          </div>

          <div className="report-field">
            <label htmlFor="issue-location">Location *</label>
            <input
              id="issue-location"
              type="text"
              placeholder="Street, area, landmark or locality"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={250}
              required
            />
          </div>

          <div className="report-field">
            <label htmlFor="issue-photo">Upload Photo (optional)</label>
            <input
              id="issue-photo"
              className="report-file-input"
              type="file"
              accept="image/*"
              disabled
            />
            <small>
              Photo upload will be enabled after the backend supports storing
              complaint images.
            </small>
          </div>

          {message && (
            <div
              className={`report-message ${messageType}`}
              role="status"
              aria-live="polite"
            >
              {message}
            </div>
          )}

          <button className="report-submit" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Complaint →"}
          </button>
        </form>
      </section>

      <p className="report-note">
        Your complaint will be recorded for review by the concerned department.
      </p>
    </main>
  );
}

export default ReportIssue;
