import { useState } from "react";
import { useParams } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import "../../AddChapter.css"; // Same CSS as AddChapter

const baseUrl = "http://127.0.0.1:8000/api";

function AddAssignment() {
    const [assignmentData, setassignmentData] = useState({
        title: '',
        detail: '',
    });

    const handleChange = (event) => {
        setassignmentData({
            ...assignmentData,
            [event.target.name]: event.target.value
        });
    };

    const { student_id } = useParams();
    const { teacher_id } = useParams();

    const formSubmit = (event) => {
        event.preventDefault();
        const _formData = new FormData();
        _formData.append('teacher', teacher_id);
        _formData.append('student', student_id);
        _formData.append('title', assignmentData.title);
        _formData.append('detail', assignmentData.detail);
    
        axios.post(`${baseUrl}/student-assignment/${teacher_id}/${student_id}/`, _formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response) => {
            console.log("Assignment added successfully:", response.data);
            window.location.reload();
        })
        .catch((error) => {
            console.error("Error adding assignment:", error);
            if (error.response) {
                alert(`Error: ${error.response.data.detail || "Invalid data provided."}`);
            } else {
                alert("An unexpected error occurred. Please try again.");
            }
        });
    };

    return (
        <div className="add-chapter-addchapter-wrapper">
            <div className="container mt-4">
                <div className="row">
                    <aside className="col-md-3">
                        <TeacherSidebar />
                    </aside>
                    <section className="col-md-9">
                        <div className="add-chapter-card">
                            <div className="add-chapter-card-header">
                                <h1 className="add-chapter-card-title">Add New Assignment</h1>
                            </div>
                            <div className="add-chapter-card-body">
                                <form onSubmit={formSubmit} className="add-chapter-form">
                                    <div className="add-chapter-form-group">
                                        <label htmlFor="title" className="add-chapter-label">Assignment Title</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={assignmentData.title}
                                            onChange={handleChange}
                                            className="add-chapter-input"
                                            placeholder="e.g., Final Project Submission"
                                            required
                                        />
                                    </div>

                                    <div className="add-chapter-form-group">
                                        <label htmlFor="detail" className="add-chapter-label">Assignment Details</label>
                                        <textarea
                                            id="detail"
                                            name="detail"
                                            value={assignmentData.detail}
                                            onChange={handleChange}
                                            className="add-chapter-textarea"
                                            rows="6"
                                            placeholder="Provide detailed instructions, requirements, and deadlines..."
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="add-chapter-submit-btn"
                                    >
                                        Add Assignment
                                    </button>
                                </form>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default AddAssignment;