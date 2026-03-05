import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../PopularCourses.css";

const baseUrl = 'http://127.0.0.1:8000/api';
function PopularTeacher() {
    const [teacher, setTeacher] = useState(null);
    const [popularteacherData, setteacherData] = useState([]);
    useEffect(() => {
        axios.get(baseUrl + '/popular-teachers/?popular=1')
            .then((res) => {
                setteacherData(res.data);
            })
            .catch((error) => {
                console.error("Error fetching courses:", error);
            });
    }, []);
    return (
        <div className="popular-container">
            <h3 className="section-title text-warning">Popular Courses</h3>
            <div className="course-grid">
            {popularteacherData && popularteacherData.map((teacher, index) => (
                    <div className="course-card" key={index}>
                        <div className="course-info">
                            <Link to={`/teacher-detail/${teacher.id}`}><img src={teacher.profile_img} className="course-img" alt={teacher.title} /></Link>
                            <div className="card-body">
                                <h5 className="card-title"><Link to={`/teacher-detail/${teacher.id}`}>{teacher.full_name}
                            </Link></h5>
                            </div>
                            <div className="course-footer">
                                <span>Total Courses: {teacher.total_teacher_courses}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <nav aria-label="Page navigation" className="pagination-container">
                <ul className="pagination">
                    <li className="page-item"><Link className="page-link bg-warning" to="#">Previous</Link></li>
                    <li className="page-item"><Link className="page-link bg-warning" to="#">1</Link></li>
                    <li className="page-item"><Link className="page-link bg-warning" to="#">2</Link></li>
                    <li className="page-item"><Link className="page-link bg-warning" to="#">3</Link></li>
                    <li className="page-item"><Link className="page-link bg-warning" to="#">Next</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default PopularTeacher;