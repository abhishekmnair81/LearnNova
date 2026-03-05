import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import "../../AddCourse.css"; // Use existing CSS file for both forms

const baseUrl = "http://127.0.0.1:8000/api";

function AddQuiz() {
  const [quizData, setquizData] = useState({
    title: "",
    detail: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setquizData({
      ...quizData,
      [e.target.name]: e.target.value,
    });
  };

  const formSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    const teacherId = localStorage.getItem("teacherId");

    if (!teacherId) {
      console.error("Teacher ID is missing in localStorage");
      return;
    }

    formData.append("teacher", teacherId);
    formData.append("title", quizData.title);
    formData.append("detail", quizData.detail);

    axios
      .post(`${baseUrl}/quiz/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log("Quiz added successfully:", res.data);
        navigate("/quiz");
      })
      .catch((error) => console.error("Error adding quiz:", error));
  };

  return (
    <div className="course-create-container">
      <div className="course-create-layout">
        <aside className="course-create-sidebar">
          <TeacherSidebar />
        </aside>
        <main className="course-create-main">
          <div className="course-create-header">
            <h1 className="course-create-title">Add Quiz</h1>
            <p className="course-create-subtitle">
              Create a new quiz for your course
            </p>
          </div>

          <div className="course-form-card">
            <div className="course-form-header">
              <h2 className="course-form-header-title">Quiz Information</h2>
            </div>

            <form onSubmit={formSubmit}>
              <div className="course-form-body">
                <div className="form-field-group">
                  <label className="form-field-label form-field-label-required">Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-field-input"
                    onChange={handleChange}
                    value={quizData.title}
                    placeholder="Quiz Title"
                    required
                  />
                </div>
                <div className="form-field-group">
                  <label className="form-field-label form-field-label-required">Detail</label>
                  <textarea
                    name="detail"
                    className="form-field-textarea"
                    onChange={handleChange}
                    value={quizData.detail}
                    placeholder="Describe the quiz details, instructions, etc."
                    required
                  ></textarea>
                </div>
              </div>
              <div className="course-form-actions">
                <button type="submit" className="btn-course-submit">Submit</button>
                <button
                  type="button"
                  className="btn-course-cancel"
                  onClick={() => window.history.back()}>
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

export default AddQuiz;
