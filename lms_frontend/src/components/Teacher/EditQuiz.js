import { useState, useEffect } from "react";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../EditCourse.css"; // Same CSS as EditCourse

const baseUrl = "http://127.0.0.1:8000/api";

function EditQuiz() {
    const [quizData, setquizData] = useState({
        title: "",
        detail: "", 
    });

    const { quiz_id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${baseUrl}/teacher-quiz-detail/${quiz_id}/`)
            .then((res) => {
                const data = res.data;
                setquizData({
                    title: data.title || "",
                    detail: data.detail || "",
                });
            })
            .catch((error) => console.error("Error fetching quiz data:", error));
    }, [quiz_id]);

    const handleChange = (e) => {
        setquizData({
            ...quizData,
            [e.target.name]: e.target.value,
        });
    };

    const formSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("teacher", localStorage.getItem("teacherId"));
        formData.append("title", quizData.title);
        formData.append("detail", quizData.detail);

        axios.put(`${baseUrl}/teacher-quiz-detail/${quiz_id}/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
            if (res.status === 200) {
                Swal.fire({
                    title: "Quiz Updated Successfully",
                    icon: "success",
                    toast: true,
                    timer: 3000,
                    position: "top-right",
                    timerProgressBar: true,
                    showCancelButton: false,
                }).then(() => {
                    navigate(`/quiz`);
                });
            }
        })
        .catch((error) => console.error("Error updating quiz:", error));
    };

    return (
        <div className="course-edit-container">
            <div className="course-edit-layout">
                <aside className="course-edit-sidebar">
                    <TeacherSidebar />
                </aside>
                <main className="course-edit-main">
                    <div className="course-edit-header">
                        <h1 className="course-edit-title">Edit Quiz</h1>
                        <p className="course-edit-subtitle">
                            Update your quiz title and instructions
                        </p>
                    </div>

                    <div className="course-edit-card">
                        <div className="course-edit-card-header">
                            <h2 className="course-edit-card-title">Quiz Details</h2>
                        </div>

                        <form onSubmit={formSubmit}>
                            <div className="course-edit-card-body">
                                <div className="course-edit-info-card">
                                    <div className="course-edit-info-icon">Tip</div>
                                    <div className="course-edit-info-content">
                                        <p className="course-edit-info-title">Best Practice</p>
                                        <p className="course-edit-info-text">
                                            Use a clear, descriptive title and provide detailed instructions so students know what to expect.
                                        </p>
                                    </div>
                                </div>

                                <div className="course-edit-form-group">
                                    <label htmlFor="title" className="course-edit-form-label course-edit-form-label-required">
                                        Quiz Title
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        name="title"
                                        className="course-edit-form-input"
                                        onChange={handleChange}
                                        value={quizData.title}
                                        placeholder="e.g., Final Assessment: React Fundamentals"
                                        required
                                    />
                                    <span className="course-edit-form-hint">
                                        Choose a title that reflects the quiz content
                                    </span>
                                </div>

                                <div className="course-edit-form-group">
                                    <label htmlFor="detail" className="course-edit-form-label course-edit-form-label-required">
                                        Instructions
                                    </label>
                                    <textarea
                                        id="detail"
                                        name="detail"
                                        className="course-edit-form-textarea"
                                        onChange={handleChange}
                                        value={quizData.detail}
                                        placeholder="Provide clear instructions, time limits, and any rules..."
                                        rows="6"
                                        required
                                    ></textarea>
                                    <span className="course-edit-form-hint">
                                        Help students understand how to complete the quiz
                                    </span>
                                </div>
                            </div>

                            <div className="course-edit-form-actions">
                                <button type="submit" className="btn-course-update">
                                    Update Quiz
                                </button>
                                <button
                                    type="button"
                                    className="btn-course-cancel"
                                    onClick={() => navigate('/quiz')}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default EditQuiz;