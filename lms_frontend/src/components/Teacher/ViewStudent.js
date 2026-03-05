import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../../ViewStudent.css";

const baseUrl = "http://127.0.0.1:8000/api";

function ViewStudent() {
  const { student_id } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${baseUrl}/student/${student_id}/`)
      .then((res) => {
        setStudentData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching student:", err);
        setError("Failed to load student profile.");
        setLoading(false);
      });
  }, [student_id]);

  if (loading) {
    return (
      <div className="student-profile-page">
        <div className="student-loading-container">
          <div className="student-loading-spinner"></div>
          <p className="student-loading-text">Loading student profile...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="student-profile-page">
        <div className="student-error-container">
          <div className="student-error-icon">Warning</div>
          <p className="student-error-message">{error}</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="student-profile-page">
        <div className="student-error-container">
          <div className="student-error-icon">Warning</div>
          <p className="student-error-message">Student not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-profile-page">
      <div className="student-hero-section">
        <div className="student-hero-container">
          <div className="student-hero-layout">
            <div className="student-profile-image-wrapper">
              {studentData.profile_img ? (
                <img
                  src={studentData.profile_img}
                  alt="Profile"
                  className="student-profile-image"
                />
              ) : (
                <div className="student-profile-image student-avatar-placeholder">
                  <span className="student-avatar-initials">
                    {studentData.full_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            <div className="student-profile-content">
              <div className="student-stats-bar">
                <div className="student-stat-item">
                  <span className="student-stat-label">Email</span>
                  <span className="student-stat-value">{studentData.email}</span>
                </div>

                <div className="student-stat-item">
                  <span className="student-stat-label">Username</span>
                  <span className="student-stat-value">{studentData.username}</span>
                </div>

                <div className="student-stat-item">
                  <span className="student-stat-label">Interested Categories</span>
                  <span className="student-stat-value">
                    {studentData.interested_categories || "N/A"}
                  </span>
                </div>
              </div>

              <div className="student-social-section">
                <Link
                  to={`/show-assignment/${student_id}/${localStorage.getItem(
                    "teacherId"
                  )}`}
                  className="student-btn student-btn-secondary"
                >
                  View Assignments
                </Link>
                <Link
                  to={`/add-assignment/${student_id}/${localStorage.getItem(
                    "teacherId"
                  )}`}
                  className="student-btn student-btn-primary"
                >
                  Add Assignment
                </Link>
                <Link to="/my-users" className="student-btn student-btn-ghost">
                  Back to Students
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewStudent;