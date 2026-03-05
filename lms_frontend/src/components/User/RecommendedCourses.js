import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useState, useEffect } from "react";
import "../../TeacherCourses.css"; // Same CSS as TeacherCourses

const baseUrl = 'http://127.0.0.1:8000/api';

function RecommendedCourses() {
    const [courseData, setCourseData] = useState([]);
    const studentId = localStorage.getItem('studentId');

    useEffect(() => {       
        if (studentId) {
            axios
                .get(`${baseUrl}/fetch-recommended-courses/${studentId}/`)
                .then((res) => setCourseData(res.data))
                .catch((error) => console.error("Error fetching courses:", error));
        }
    }, [studentId]);

    return (
        <div className="courseee-page__container">
            <div className="courseee-row">
                <aside className="courseee-col--sidebar">
                    <Sidebar />
                </aside>  
                <section className="courseee-col--main">
                    <div className="courseee-card courseee-course__card">
                        <h5 className="courseee-card__header">Recommended Courses</h5>
                        <div className="courseee-card__body">
                            <table className="courseee-table">
                                <thead className="courseee-table__header">
                                    <tr>
                                        <th>Name</th>
                                        <th>Technologies</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courseData.length > 0 ? (
                                        courseData.map((row, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <Link 
                                                        to={`/detail/${row.id}`} 
                                                        className="courseee-course__title"
                                                    >
                                                        {row.title}
                                                    </Link>
                                                </td>
                                                <td className="courseee-text--muted">
                                                    {row.techs}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="courseee-text--center text-muted">
                                                No recommended courses found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default RecommendedCourses;