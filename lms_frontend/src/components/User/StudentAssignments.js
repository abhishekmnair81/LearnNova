import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useState, useEffect } from "react";
import "../../TeacherCourses.css"; 
import Swal from "sweetalert2";

const baseUrl = 'http://127.0.0.1:8000/api';

function StudentAssignments() {
    const [assignmentData, setassignmentData] = useState([]);
    const studentId = localStorage.getItem('studentId');

    useEffect(() => {       
        axios
            .get(`${baseUrl}/my-asigs/${studentId}`)
            .then((res) => setassignmentData(res.data))
            .catch((error) => console.error("Error fetching assignments:", error));
    }, [studentId]);
    

    const markAsDone = (assignment_id) => {
        axios.put(`${baseUrl}/update-assignments/${assignment_id}/`, { student_status: true })
        .then((res) => {
            if (res.status === 200) {
                setassignmentData(prevAssignments =>
                    prevAssignments.map(assignment =>
                        assignment.id === assignment_id ? { ...assignment, student_status: true } : assignment
                    )
                );
    
                Swal.fire({
                    title: 'You have successfully completed this assignment',
                    icon: 'success',
                    toast: true,
                    position: "top-end",
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            }
        })
        .catch((error) => console.error("Error updating assignment:", error));
    };
        
    return (
        <div className="courseee-page__container">
            <div className="courseee-row">
                <aside className="courseee-col--sidebar">
                    <Sidebar />
                </aside>  
                <section className="courseee-col--main">
                    <div className="courseee-card courseee-course__card">
                        <h5 className="courseee-card__header">My Assignments</h5>
                        <div className="courseee-card__body">
                            <table className="courseee-table">
                                <thead className="courseee-table__header">
                                    <tr>
                                        <th>Title</th>
                                        <th>Detail</th>
                                        <th>Teacher</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {assignmentData.map((row, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Link to={`/detail/${row.id}`} className="courseee-course__title">
                                                {row.title}
                                            </Link>
                                        </td>
                                        <td>
                                            <Link to={`/detail/${row.id}`} className="courseee-course__title">
                                                {row.detail}
                                            </Link>
                                        </td>    
                                        
                                        <td>
                                            {row.teacher ? (
                                                <Link to={`/teacher-detail/${row.teacher.id}`} className="courseee-course__title">
                                                    {row.teacher.full_name}
                                                </Link>
                                            ) : (
                                                <span className="text-muted">Unknown Teacher</span>
                                            )}
                                        </td>
                                        <td className="courseee-text--center">
                                            {row.student_status ? (
                                                <span className="badge bg-warning text-dark">Completed</span>
                                            ) : (
                                                <button 
                                                    onClick={() => markAsDone(row.id)} 
                                                    className="courseee-btn courseee-btn--success courseee-me--sm"
                                                >
                                                    Mark as Done
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default StudentAssignments;