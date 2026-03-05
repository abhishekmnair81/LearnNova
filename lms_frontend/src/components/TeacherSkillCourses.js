import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../TeacherSkillCourses.css";

const baseUrl = "http://127.0.0.1:8000/api";

function TeacherSkillCourses() {
    const [courseData, setCourseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const { skill_name, teacher_id } = useParams();

    useEffect(() => {
        axios
            .get(`${baseUrl}/course/?skill_name=${skill_name}&teacher=${teacher_id}`)
            .then((res) => {
                setCourseData(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching course data:", error);
                setLoading(false);
            });
    }, [skill_name, teacher_id]);

    return (
        <div className="container mt-4">
            <h3 className="section-title text-warning">{skill_name} Courses</h3>

            {loading ? (
                <p className="loading-text">Loading courses...</p>
            ) : courseData.length === 0 ? (
                <p className="no-data">No courses available for this skill.</p>
            ) : (
                <div className="row">
                    {courseData.map((course, index) => (
                        <div className="col-md-4 col-lg-3 mb-4" key={index}>
                            <div className="course-card">
                                <Link to={`/detail/${course.id}`}>
                                    <img
                                        src={course.featured_img}
                                        className="course-image"
                                        alt={course.title}
                                    />
                                </Link>
                                <div className="course-body">
                                    <h5 className="course-title">
                                        <Link to={`/detail/${course.id}`}>{course.title}</Link>
                                    </h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TeacherSkillCourses;
