import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import "../../CourseChapters.css";

const baseUrl = 'http://127.0.0.1:8000/api';

function ShowAssignment() {
    const [assignmentData, setassignmentData] = useState([]);
    const [totalResult, setTotalResult] = useState([0]);
    const { student_id } = useParams();
    const { teacher_id } = useParams();

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const response = await axios.get(`${baseUrl}/student-assignment/${teacher_id}/${student_id}`);
                console.log('Fetched chapters:', response.data);
                setassignmentData(response.data);
                setTotalResult(response.data.length);
            } catch (error) {
                console.error('Error fetching course chapters:', error);
            }
        };
    
        fetchChapters();
    }, [student_id, teacher_id]);

    return (
        <div className="course-chap-container">
            <div className="course-chap-layout">
                <aside className="course-chap-sidebar">
                    <TeacherSidebar />
                </aside>
                <section className="course-chap-main-content">
                    <div className="course-chap-content-card">
                        <div className="course-chap-card-header">
                            <h2 className="course-chap-header-title">All Assignments ({totalResult})</h2>
                            <Link className="course-chap-btn course-chap-btn-primary" to={`/add-assignment/${student_id}/${teacher_id}`}>
                                <i className="bi bi-plus-circle"></i> Add Assignment
                            </Link>
                        </div>
                        <div className="course-chap-card-body">
                            {assignmentData.length > 0 ? (
                                <div className="course-chap-table-wrapper">
                                    <table className="course-chap-chapters-table">
                                        <thead className="course-chap-table-head">
                                            <tr>
                                                <th className="course-chap-th">Title</th>
                                                <th className="course-chap-th course-chap-th-actions">Student Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="course-chap-table-body">
                                            {assignmentData.map((row, index) => (
                                                <tr key={index} className="course-chap-table-row">
                                                    <td className="course-chap-td course-chap-td-title">
                                                        {row.title}
                                                    </td>
                                                    <td className="course-chap-td course-chap-td-actions">
                                                        {row.student_status ? (
                                                            <span className="badge bg-success text-dark">Completed</span>
                                                        ) : (
                                                            <span className="badge bg-warning text-dark">Pending</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="course-chap-empty-state">
                                    <i className="bi bi-collection-play"></i>
                                    <p className="course-chap-empty-text">No Assignments yet. Start creating assignments for this student!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ShowAssignment;