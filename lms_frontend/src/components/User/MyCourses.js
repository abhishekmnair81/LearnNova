import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useState, useEffect } from "react";
import "../../TeacherCourses.css"; // Same CSS as TeacherCourses
import { FaBook } from 'react-icons/fa';

const baseUrl = 'http://127.0.0.1:8000/api';

function MyCourses() {
    const [courseData, setCourseData] = useState([]);
    const studentId = localStorage.getItem('studentId');

    useEffect(() => {
        if (!studentId) {
            console.error("Error: studentId is missing in localStorage.");
            return;
        }

        axios
            .get(`${baseUrl}/fetch-enrolled-courses/${studentId}`)
            .then((res) => {
                console.log("Fetched courses:", res.data);
                setCourseData(res.data);
            })
            .catch((error) => console.error("Error fetching courses:", error));
    }, [studentId]);

    return (
        <div className="courseee-page__container">
            <div className="courseee-row">
                <aside className="courseee-col--sidebar">
                    <Sidebar />
                </aside>
                <section className="courseee-col--main">
                    <div className="courseee-card courseee-course__card">
                        <h5 className="courseee-card__header">My Courses</h5>
                        <div className="courseee-card__body">
                            <table className="courseee-table">
                                <thead className="courseee-table__header">
                                    <tr>
                                        <th>Name</th>
                                        <th>Created By</th>
                                        <th>Quiz</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courseData.length > 0 ? (
                                        courseData.map((row, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <Link 
                                                        to={`/detail/${row.course?.id}`} 
                                                        className="courseee-course__title"
                                                    >
                                                        {row.course?.title || "No Title"}
                                                    </Link>
                                                </td>

                                                <td>
                                                    <Link 
                                                        to={`/teacher-detail/${row.course?.teacher?.id}`} 
                                                        className="courseee-course__title"
                                                    >
                                                        {row.course?.teacher?.full_name || "Unknown Teacher"}
                                                    </Link>
                                                </td>

                                                <td className="courseee-text--center">
                                                    <Link 
                                                        to={`/course-quiz/${row.course?.id}`} 
                                                        className="courseee-btn courseee-btn--warning courseee-me--sm"
                                                    >
                                                        Quiz List
                                                    </Link>
                                                    <Link 
                                                        to={`/user/study-materials/${row.course?.id}`} 
                                                        className="courseee-btn courseee-btn--secondary courseee-me--sm"
                                                    >
                                                        <FaBook size={21} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="courseee-text--center text-muted">
                                                No courses enrolled.
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

export default MyCourses;