import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import React from "react";
import "../TeacherDetail.css";

const baseUrl = "http://127.0.0.1:8000/api";

function TeacherDetail() {
    const [courseData, setCourseData] = useState([]);
    const [teacherData, setTeacherData] = useState({});
    const [skillList, setSkillList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    let { teacher_id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch teacher data
                const teacherResponse = await axios.get(`${baseUrl}/teacher/${teacher_id}`);
                setTeacherData(teacherResponse.data);
                setSkillList(teacherResponse.data.skill_list || []);

                // Fetch courses
                const courseResponse = await axios.get(`${baseUrl}/teacher-courses/${teacher_id}`);
                setCourseData(Array.isArray(courseResponse.data) ? courseResponse.data : []);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data. Please try again later.");
                setCourseData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [teacher_id]);

    // Social media icons component
    const SocialIcon = ({ url, iconClass }) => (
        url && (
            <a href={url} target="_blank" rel="noopener noreferrer" className="instructor-social-link">
                <i className={`bi ${iconClass}`}></i>
            </a>
        )
    );

    if (loading) {
        return (
            <div className="instructor-profile-page">
                <div className="instructor-loading-container">
                    <div className="instructor-loading-spinner"></div>
                    <p className="instructor-loading-text">Loading instructor profile...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="instructor-profile-page">
                <div className="instructor-error-container">
                    <div className="instructor-error-icon">⚠️</div>
                    <p className="instructor-error-message">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="instructor-profile-page">
            {/* Hero Section */}
            <div className="instructor-hero-section">
                <div className="instructor-hero-container">
                    <div className="instructor-hero-layout">
                        <div className="instructor-profile-image-wrapper">
                            <img
                                src={teacherData.profile_img}
                                className="instructor-profile-image"
                                alt={teacherData.full_name}
                            />
                            <div className="instructor-verified-badge">
                                <i className="bi bi-check-lg instructor-verified-icon"></i>
                            </div>
                        </div>

                        <div className="instructor-profile-content">
                            <h1 className="instructor-profile-name">{teacherData.full_name}</h1>
                            <p className="instructor-profile-bio">{teacherData.detail}</p>

                            <div className="instructor-stats-bar">
                                <div className="instructor-stat-item">
                                    <span className="instructor-stat-value">{courseData.length}</span>
                                    <span className="instructor-stat-label">Courses</span>
                                </div>
                                <div className="instructor-stat-item">
                                    <span className="instructor-stat-value">{skillList.length}</span>
                                    <span className="instructor-stat-label">Skills</span>
                                </div>
                            </div>

                            {/* Skills Section
                            <div className="instructor-skills-section">
                                <h2 className="instructor-section-title">Expertise</h2>
                                <div className="instructor-skills-list">
                                    {skillList.map((skill, index) => (
                                        <Link
                                            to={`/teacher-skill-courses/${skill.trim()}/${teacherData.id}`}
                                            className="instructor-skill-tag"
                                            key={index}
                                        >
                                            {skill.trim()}
                                        </Link>
                                    ))}
                                </div>
                            </div> */}

                            {/* Recent Courses Section */}
                            <div className="instructor-recent-section">
                                <h2 className="instructor-section-title">Featured Courses</h2>
                                <div className="instructor-recent-list">
                                    {courseData.length > 0 ? (
                                        courseData.slice(0, 3).map((course, index) => (
                                            <Link
                                                key={index}
                                                to={`/detail/${course.id}`}
                                                className="instructor-recent-tag"
                                            >
                                                {course.title}
                                            </Link>
                                        ))
                                    ) : (
                                        <span className="instructor-no-courses">No courses available yet.</span>
                                    )}
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="instructor-social-section">
                                <SocialIcon url={teacherData.facebook_url} iconClass="bi-facebook" />
                                <SocialIcon url={teacherData.twitter_url} iconClass="bi-twitter" />
                                <SocialIcon url={teacherData.instagram_url} iconClass="bi-instagram" />
                                <SocialIcon url={teacherData.website_url} iconClass="bi-globe" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="instructor-content-section">
                <div className="instructor-content-container">
                    <div className="instructor-courses-section">
                        <h2 className="instructor-courses-header">All Courses by {teacherData.full_name}</h2>

                        <div className="instructor-courses-card">
                            <div className="instructor-courses-card-header">
                                {courseData.length} Course{courseData.length !== 1 ? 's' : ''}
                            </div>
                            <ul className="instructor-courses-list">
                                {courseData.length > 0 ? (
                                    courseData.map((course, index) => (
                                        <li key={index} className="instructor-course-item">
                                            <Link to={`/detail/${course.id}`} className="instructor-course-link">
                                                {course.title}
                                            </Link>
                                        </li>
                                    ))
                                ) : (
                                    <div className="instructor-no-courses-message">
                                        No courses found for this instructor.
                                    </div>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeacherDetail;