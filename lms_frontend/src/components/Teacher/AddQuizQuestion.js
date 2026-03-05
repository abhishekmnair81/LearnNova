import { useState } from "react";
import { useParams } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import Swal from "sweetalert2";
import "../../AddChapter.css"; // Same CSS as AddChapter

const baseUrl = "http://127.0.0.1:8000/api";

function AddQuizQuestion() {
    const [questionData, setquestionData] = useState({
        quiz: '',
        question: '',
        ans1: '',
        ans2: '',
        ans3: '',
        ans4: '',
        right_ans: ''
    });

    const handleChange = (event) => {
        setquestionData({
            ...questionData,
            [event.target.name]: event.target.value
        });
    };
    const { quiz_id } = useParams();

    const formSubmit = (event) => {
        event.preventDefault();
        
        Swal.fire({
            title: 'Adding question...',
            didOpen: () => {
                Swal.showLoading();
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false
        });
        
        const _formData = new FormData();
        _formData.append('quiz', quiz_id);
        _formData.append('question', questionData.question);
        _formData.append('ans1', questionData.ans1);
        _formData.append('ans2', questionData.ans2);
        _formData.append('ans3', questionData.ans3);
        _formData.append('ans4', questionData.ans4);
        _formData.append('right_ans', questionData.right_ans);

        axios.post(`${baseUrl}/quiz-questions/${quiz_id}/`, _formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response) => {
            Swal.fire({
                title: "Success",
                text: "Question added successfully!",
                icon: "success",
                confirmButtonColor: "#3085d6"
            }).then(() => {
                setquestionData({
                    quiz: '',
                    question: '',
                    ans1: '',
                    ans2: '',
                    ans3: '',
                    ans4: '',
                    right_ans: ''
                });
            });
        })
        .catch((error) => {
            console.error("Error adding question:", error);
            Swal.fire({
                title: "Error",
                text: error.response?.data?.message || "Failed to add question. Please try again.",
                icon: "error",
                confirmButtonColor: "#3085d6"
            });
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
                                <h1 className="add-chapter-card-title">Add Quiz Question</h1>
                            </div>
                            <div className="add-chapter-card-body">
                                <form onSubmit={formSubmit} className="add-chapter-form">
                                    <div className="add-chapter-form-group">
                                        <label htmlFor="question" className="add-chapter-label">Question</label>
                                        <input
                                            type="text"
                                            id="question"
                                            name="question"
                                            value={questionData.question}
                                            onChange={handleChange}
                                            className="add-chapter-input"
                                            placeholder="e.g., What is the capital of France?"
                                            required
                                        />
                                    </div>

                                    <div className="add-chapter-form-group">
                                        <label htmlFor="ans1" className="add-chapter-label">Answer 1</label>
                                        <input
                                            type="text"
                                            id="ans1"
                                            name="ans1"
                                            value={questionData.ans1}
                                            onChange={handleChange}
                                            className="add-chapter-input"
                                            placeholder="e.g., Paris"
                                            required
                                        />
                                    </div>

                                    <div className="add-chapter-form-group">
                                        <label htmlFor="ans2" className="add-chapter-label">Answer 2</label>
                                        <input
                                            type="text"
                                            id="ans2"
                                            name="ans2"
                                            value={questionData.ans2}
                                            onChange={handleChange}
                                            className="add-chapter-input"
                                            placeholder="e.g., London"
                                            required
                                        />
                                    </div>

                                    <div className="add-chapter-form-group">
                                        <label htmlFor="ans3" className="add-chapter-label">Answer 3</label>
                                        <input
                                            type="text"
                                            id="ans3"
                                            name="ans3"
                                            value={questionData.ans3}
                                            onChange={handleChange}
                                            className="add-chapter-input"
                                            placeholder="e.g., Berlin"
                                            required
                                        />
                                    </div>

                                    <div className="add-chapter-form-group">
                                        <label htmlFor="ans4" className="add-chapter-label">Answer 4</label>
                                        <input
                                            type="text"
                                            id="ans4"
                                            name="ans4"
                                            value={questionData.ans4}
                                            onChange={handleChange}
                                            className="add-chapter-input"
                                            placeholder="e.g., Madrid"
                                            required
                                        />
                                    </div>

                                    <div className="add-chapter-form-group">
                                        <label htmlFor="right_ans" className="add-chapter-label">Correct Answer</label>
                                        <input
                                            type="text"
                                            id="right_ans"
                                            name="right_ans"
                                            value={questionData.right_ans}
                                            onChange={handleChange}
                                            className="add-chapter-input"
                                            placeholder="Enter the correct answer exactly as above"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="add-chapter-submit-btn"
                                    >
                                        Add Question
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

export default AddQuizQuestion;