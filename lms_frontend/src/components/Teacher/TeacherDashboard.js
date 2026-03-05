import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import Swal from "sweetalert2";
import "../../TeacherDashboard.css";

const baseUrl = "http://127.0.0.1:8000/api";

function TeacherDashboard() {
    const [dashboardData, setDashboardData] = useState({});
    const [teacherData, setTeacherData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState('');
    const [loading, setLoading] = useState(true);
    const teacherId = localStorage.getItem("teacherId");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch dashboard summary (courses, chapters)
                const dashboardResponse = await axios.get(`${baseUrl}/teacher/dashboard/${teacherId}`);

                // Fetch enrolled students to count UNIQUE students
                const enrolledResponse = await axios.get(`${baseUrl}/fetch-all-enrolled-students/${teacherId}`);

                // Deduplicate students by ID
                const uniqueStudents = enrolledResponse.data.reduce((acc, current) => {
                    if (!acc.find(item => item.student.id === current.student.id)) {
                        acc.push(current);
                    }
                    return acc;
                }, []);

                // Update dashboard data with correct unique student count
                setDashboardData({
                    total_teacher_courses: dashboardResponse.data.total_teacher_courses || 0,
                    total_teacher_chapters: dashboardResponse.data.total_teacher_chapters || 0,
                    total_teacher_students: uniqueStudents.length // Correct unique count
                });

                // Fetch teacher profile
                const teacherResponse = await axios.get(`${baseUrl}/teacher/${teacherId}/`);
                setTeacherData(teacherResponse.data);

            } catch (error) {
                console.error("Error fetching data:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to load dashboard data",
                    confirmButtonColor: "#a435f0"
                });
            } finally {
                setLoading(false);
            }
        };

        if (teacherId) {
            fetchData();
        }
    }, [teacherId]);

    const handleImageClick = (imgUrl) => {
        setModalImage(imgUrl);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalImage('');
    };

    if (loading) {
        return (
            <div className="teacher-dashboard">
                <div className="teacher-dashboard__container">
                    <aside className="teacher-dashboard__sidebar">
                        <TeacherSidebar />
                    </aside>
                    <section className="teacher-dashboard__content">
                        <div className="teacher-dashboard__loader">Loading...</div>
                    </section>
                </div>
            </div>
        );
    }

    return (
        <div className="teacher-dashboard">
            <div className="teacher-dashboard__container">
                <aside className="teacher-dashboard__sidebar">
                    <TeacherSidebar />
                </aside>
                <section className="teacher-dashboard__content">
                    <div className="dashboard-header">
                        <h1 className="teacher-dashboard__title">Dashboard</h1>
                        {teacherData.profile_img && (
                            <div className="teacher-profile">
                                <img
                                    src={teacherData.profile_img}
                                    alt={teacherData.full_name || "Profile"}
                                    className="teacher-profile__img"
                                    onClick={() => handleImageClick(teacherData.profile_img)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && handleImageClick(teacherData.profile_img)}
                                />
                                <Link to="/teacher-profile-setting/" className="teacher-profile__name">
                                    {teacherData.full_name}
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="dashboard-stats">
                        <DashboardCard 
                            title="Total Courses" 
                            count={dashboardData.total_teacher_courses}
                            link="/teacher-courses" 
                            icon="📚"
                            color="primary"
                        />
                        <DashboardCard 
                            title="Total Students" 
                            count={dashboardData.total_teacher_students} 
                            link="/my-users" 
                            icon="👥"
                            color="success"
                        />
                        <DashboardCard 
                            title="Total Chapters" 
                            count={dashboardData.total_teacher_chapters}
                            link="/teacher-courses" 
                            icon="📖"
                            color="info"
                        />
                    </div>
                </section>
            </div>

            {showModal && (
                <div 
                    className="image-modal" 
                    onClick={closeModal}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div className="image-modal__content" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="image-modal__close" 
                            onClick={closeModal}
                            aria-label="Close modal"
                        >
                            <i className="bi bi-x"></i>
                        </button>
                        <img 
                            src={modalImage} 
                            alt="Profile" 
                            className="image-modal__img" 
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function DashboardCard({ title, count, link, icon, color }) {
    return (
        <div className="dashboard-card">
            <Link to={link} className={`dashboard-card__link dashboard-card__link--${color}`}>
                <div className="dashboard-card__icon">{icon}</div>
                <div className="dashboard-card__body">
                    <h3 className="dashboard-card__title">{title}</h3>
                    <p className="dashboard-card__count">{count || 0}</p>
                </div>
            </Link>
        </div>
    );
}

export default TeacherDashboard;