import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import Swal from "sweetalert2";
import "../../Dashboard.css";

const baseUrl = "http://127.0.0.1:8000/api";

function Dashboard() {
    const [studentData, setStudentData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState("");
    const studentId = localStorage.getItem("studentId");

    const [dashboardData, setDashboardData] = useState({
        enrolled_courses: 0,
        favorite_courses: 0,
        complete_assignments: 0,
        pending_assignments: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dashboardResponse = await axios.get(`${baseUrl}/student/dashboard/${studentId}`);
                console.log("Dashboard Data:", dashboardResponse.data);
                setDashboardData(dashboardResponse.data);

                const studentResponse = await axios.get(`${baseUrl}/student/${studentId}/`);
                console.log("Student Data:", studentResponse.data);
                setStudentData(studentResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                Swal.fire("Error", "Failed to load dashboard data", "error");
            }
        };

        fetchData();
    }, [studentId]);

    const handleImageClick = (imgUrl) => {
        setModalImage(imgUrl);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalImage("");
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <aside className="dashboard-sidebar">
                    <Sidebar />
                </aside>
                <section className="dashboard-main">
                    <div className="dashboard-header">
                        <h1 className="dashboard-title">My Learning</h1>
                        <div className="profile-section">
                            {studentData.profile_img ? (
                                <div className="profile-container">
                                    <img
                                        src={studentData.profile_img}
                                        alt="Profile"
                                        className="profile-img"
                                        onClick={() => handleImageClick(studentData.profile_img)}
                                    />
                                    <Link to={`/profile-setting/`} className="profile-link">
                                        {studentData.full_name}
                                    </Link>
                                </div>
                            ) : (
                                <p className="no-profile-text">Complete your profile</p>
                            )}
                        </div>
                    </div>

                    <div className="stats-overview">
                        <h2 className="stats-overview-title">Your Stats</h2>
                        <div className="dashboard-grid">
                            <div className="dashboard-card">
                                <div className="card-icon">📚</div>
                                <h3 className="card-title">Enrolled Courses</h3>
                                <Link to="/my-courses" className="card-link">
                                    <p className="card-count">{dashboardData.enrolled_courses || 0}</p>
                                </Link>
                            </div>

                            <div className="dashboard-card">
                                <div className="card-icon">❤️</div>
                                <h3 className="card-title">Favorite Courses</h3>
                                <Link to="/favorite-courses" className="card-link">
                                    <p className="card-count">{dashboardData.favorite_courses || 0}</p>
                                </Link>
                            </div>

                            <div className="dashboard-card">
                                <div className="card-icon">✓</div>
                                <h3 className="card-title">Assignments</h3>
                                <div className="assignment-stats">
                                    <div className="assignment-stat-item">
                                        <Link to="/my-assignments" className="stat-link">
                                            <span className="stat-label">Completed</span>
                                            <span className="stat-value">{dashboardData.complete_assignments || 0}</span>
                                        </Link>
                                    </div>
                                    <div className="assignment-stat-item">
                                        <Link to="/my-assignments" className="stat-link">
                                            <span className="stat-label">Pending</span>
                                            <span className="stat-value">{dashboardData.pending_assignments || 0}</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <img src={modalImage} alt="Profile Full" className="modal-image" />
                        <button className="close-btn" onClick={closeModal}>
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;