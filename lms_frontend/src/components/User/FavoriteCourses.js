import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useState, useEffect } from "react";
import "../../TeacherCourses.css"; // Same CSS as TeacherCourses

const baseUrl = 'http://127.0.0.1:8000/api';

function FavoriteCourses() {
    const [courseData, setCourseData] = useState([]);
    const studentId = localStorage.getItem('studentId');

    useEffect(() => {
        if (!studentId) return;
    
        axios
            .get(`${baseUrl}/fetch-favorite-courses/${studentId}`)
            .then((res) => {
                console.log("API Response:", res.data);
                setCourseData(res.data);
            })
            .catch((error) => {
                console.error("Error fetching courses:", error);
                alert("Failed to load favorite courses. Please check your server.");
            });
    }, [studentId]);
    

    return (
        <div className="courseee-page__container">
            <div className="courseee-row">
                <aside className="courseee-col--sidebar">
                    <Sidebar />
                </aside>  
                <section className="courseee-col--main">
                    <div className="courseee-card courseee-course__card">
                        <h5 className="courseee-card__header">Favorite Courses</h5>
                        <div className="courseee-card__body">
                            <table className="courseee-table">
                                <thead className="courseee-table__header">
                                    <tr>
                                        <th>Name</th>
                                        <th>Created By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courseData.length === 0 ? (
                                        <tr>
                                            <td colSpan="2" className="courseee-text--center text-muted">
                                                No favorite courses found.
                                            </td>
                                        </tr>
                                    ) : (
                                        courseData.map((row, index) => {
                                            if (!row.course || !row.course.teacher) {
                                                console.warn("Skipping row due to missing data:", row);
                                                return (
                                                    <tr key={index}>
                                                        <td colSpan="2" className="courseee-text--center text-danger">
                                                            Invalid course data (ID: {row.id})
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                            
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <Link 
                                                            to={`/detail/${row.course.id}`} 
                                                            className="courseee-course__title"
                                                        >
                                                            {row.course.title}
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <Link 
                                                            to={`/teacher-detail/${row.course.teacher.id}`} 
                                                            className="courseee-course__title"
                                                        >
                                                            {row.course.teacher.full_name}
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })
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

export default FavoriteCourses;