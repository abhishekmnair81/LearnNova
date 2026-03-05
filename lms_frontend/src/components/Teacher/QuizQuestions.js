"use client"

import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import TeacherSidebar from "./TeacherSidebar"
import axios from "axios"
import Swal from "sweetalert2"
import "../../CourseChapters.css"

const baseUrl = "http://127.0.0.1:8000/api"

function QuizQuestions() {
  const [questionData, setQuestionData] = useState([])
  const [totalResult, setTotalResult] = useState(0)
  const [quizTitle, setQuizTitle] = useState("")
  const [attemptCount, setAttemptCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { quiz_id } = useParams()

  useEffect(() => {
    setLoading(true)

    // Fetch quiz details
    axios
      .get(`${baseUrl}/teacher-quiz-detail/${quiz_id}/`)
      .then((res) => {
        setQuizTitle(res.data.title)
      })
      .catch((error) => {
        console.error("Error fetching quiz details:", error)
        setError("Failed to load quiz details")
      })

    // Fetch quiz questions
    axios
      .get(`${baseUrl}/quiz-questions/${quiz_id}`)
      .then((response) => {
        setQuestionData(response.data)
        setTotalResult(response.data.length)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching quiz questions:", error)
        setError("Failed to load quiz questions")
        setLoading(false)
      })

    // Fetch attempt count
    axios
      .get(`${baseUrl}/quiz-attempt-count/${quiz_id}/`)
      .then((res) => {
        setAttemptCount(res.data.count)
      })
      .catch((error) => {
        console.error("Error fetching attempt count:", error)
      })
  }, [quiz_id])

  const handleDeleteClick = (question_id) => {
    Swal.fire({
      title: "Confirm",
      text: "Are you sure you want to delete this question?",
      icon: "warning",
      confirmButtonText: "Yes, delete it",
      showCancelButton: true,
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${baseUrl}/question/${question_id}/`)
          .then(() => {
            Swal.fire("Success", "Question has been deleted!", "success")
            // Update the question list after deletion
            setQuestionData(questionData.filter((question) => question.id !== question_id))
            setTotalResult((prev) => prev - 1)
          })
          .catch((error) => {
            Swal.fire("Error", "Failed to delete question. Please try again.", "error")
            console.error("Error deleting question:", error)
          })
      }
    })
  }

  return (
    <div className="course-chap-container">
      <div className="course-chap-layout">
        <aside className="course-chap-sidebar">
          <TeacherSidebar />
        </aside>
        <section className="course-chap-main-content">
          <div className="course-chap-content-card">
            <div className="course-chap-card-header">
              <h2 className="course-chap-header-title">Quiz: {quizTitle} ({totalResult} Questions)</h2>
              <div className="course-chap-header-actions">
                <Link className="course-chap-btn course-chap-btn-warning" to={`/add-quiz-question/${quiz_id}`}>
                  Add Question
                </Link>
                {attemptCount > 0 && (
                  <Link className="course-chap-btn course-chap-btn-success" to={`/attempted-students/${quiz_id}`}>
                    View Attempts ({attemptCount})
                  </Link>
                )}
              </div>
            </div>
            <div className="course-chap-card-body">
              {loading ? (
                <div className="course-chap-loading-state">
                  <div className="course-chap-spinner" role="status">
                    <span className="course-chap-sr-only">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="course-chap-alert course-chap-alert-error">{error}</div>
              ) : questionData.length === 0 ? (
                <div className="course-chap-alert course-chap-alert-info">
                  No questions available for this quiz.
                  <Link to={`/add-quiz-question/${quiz_id}`} className="course-chap-alert-link">
                    Add your first question
                  </Link>
                </div>
              ) : (
                <div className="course-chap-table-wrapper">
                  <table className="course-chap-chapters-table">
                    <thead className="course-chap-table-head">
                      <tr>
                        <th className="course-chap-th">Question</th>
                        <th className="course-chap-th">Correct Answer</th>
                        <th className="course-chap-th course-chap-th-actions">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="course-chap-table-body">
                      {questionData.map((row, index) => (
                        <tr key={index} className="course-chap-table-row">
                          <td className="course-chap-td course-chap-td-title">
                            <Link to={`/edit-question/${row.id}`} className="course-chap-chapter-link">
                              {row.question}
                            </Link>
                          </td>
                          <td className="course-chap-td">{row.right_ans}</td>
                          <td className="course-chap-td course-chap-td-actions">
                            <div className="course-chap-action-buttons">
                              <Link to={`/edit-question/${row.id}`} className="course-chap-btn course-chap-btn-edit">
                                <i className="bi bi-pencil-square"></i>
                              </Link>
                              <button onClick={() => handleDeleteClick(row.id)} className="course-chap-btn course-chap-btn-delete">
                                <i className="bi bi-trash3"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default QuizQuestions