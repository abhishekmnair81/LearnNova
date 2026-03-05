import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import "../../EnrolledStudents.css"; // Importing the new CSS file

const baseUrl = 'http://127.0.0.1:8000/api';

function EnrolledStudents() {
    const [Studentdata, setStudentData] = useState([]);
    let { course_id } = useParams();

    useEffect(() => {
        axios
            .get(`${baseUrl}/fetch-enrolled-students/${course_id}`)
            .then((res) => setStudentData(res.data))
            .catch((error) => console.error("Error fetching students:", error));
    }, [course_id]);

    return (
        <div className="enrolled-students-container container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    <TeacherSidebar />
                </aside>
                <section className="col-md-9">
                    <div className="card enrolled-students-card">
                        <h5 className="card-header">Enrolled Students</h5>
                        <div className="card-body">
                            <table className="table table-hover enrolled-students-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Username</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Studentdata.length > 0 ? (
                                        Studentdata.map((row) => (
                                            <tr key={row.student.id}>
                                                <td>
                                                    <Link to={`/view-student/${row.student.id}`} className="student-name">
                                                        {row.student.full_name}
                                                    </Link>
                                                </td>
                                                <td>{row.student.email}</td>
                                                <td>{row.student.username}</td>
                                                <td className="text-center">
                                                    <Link to={`/view-student/${row.student.id}`} className="btn btn-view">
                                                        View <i className="bi bi-eye-fill"></i>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center text-muted">No students enrolled yet.</td>
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

export default EnrolledStudents;
