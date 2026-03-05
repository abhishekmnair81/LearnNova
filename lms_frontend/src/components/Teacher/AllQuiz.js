"use client"
import { FaUsers, FaClipboardCheck, FaPlus, FaQuestionCircle } from 'react-icons/fa';
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import TeacherSidebar from "./TeacherSidebar"
import axios from "axios"
import Swal from "sweetalert2"
import "../../QuizList.css"

const baseUrl = "http://127.0.0.1:8000/api"

function AllQuiz(props) {
  const [quizData, setQuizData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [attemptCounts, setAttemptCounts] = useState({})

  useEffect(() => {
    const teacherId = localStorage.getItem("teacherId")
    if (!teacherId) {
      setError("Teacher ID not found. Please log in again.")
      setLoading(false)
      return
    }

    axios
      .get(`${baseUrl}/teacher-quiz/${teacherId}/`)
      .then((res) => {
        setQuizData(res.data)

        const quizIds = res.data.map((quiz) => quiz.id)
        fetchAttemptCounts(quizIds)
      })
      .catch((error) => {
        console.error("Error fetching quizzes:", error)
        setError("Failed to load quizzes. Please try again.")
        setLoading(false)
      })
  }, [])

  const fetchAttemptCounts = (quizIds) => {
    const countPromises = quizIds.map((quizId) =>
      axios
        .get(`${baseUrl}/quiz-attempt-count/${quizId}/`)
        .then((res) => ({ quizId, count: res.data.count }))
        .catch((error) => {
          console.error(`Error fetching attempt count for quiz ${quizId}:`, error)
          return { quizId, count: 0 }
        }),
    )

    Promise.all(countPromises)
      .then((results) => {
        const counts = {}
        results.forEach((result) => {
          counts[result.quizId] = result.count
        })
        setAttemptCounts(counts)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching attempt counts:", error)
        setLoading(false)
      })
  }

  const handleDeleteClick = (quiz_id) => {
    Swal.fire({
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this quiz? This action cannot be undone.",
      icon: "warning",
      confirmButtonText: "Yes, delete it",
      confirmButtonColor: "#ef4444",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      cancelButtonColor: "#6a6f73",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${baseUrl}/quiz/${quiz_id}/`)
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Quiz has been deleted successfully.",
              icon: "success",
              confirmButtonColor: "#a435f0",
            })
            // Update the quiz list after deletion
            setQuizData(quizData.filter((quiz) => quiz.id !== quiz_id))
          })
          .catch((error) => {
            Swal.fire({
              title: "Error",
              text: "Failed to delete quiz. Please try again.",
              icon: "error",
              confirmButtonColor: "#ef4444",
            })
            console.error("Error deleting quiz:", error)
          })
      }
    })
  }

  return (
    <div className="all-quiz-quiz-container">
      <div className="all-quiz-quiz-layout">
        <aside className="all-quiz-quiz-sidebar">
          <TeacherSidebar />
        </aside>
        <main className="all-quiz-quiz-main">
          <div className="all-quiz-quiz-header">
            <div className="all-quiz-quiz-header-content">
              <h1 className="all-quiz-quiz-title">My Quizzes</h1>
              <div className="all-quiz-quiz-actions">
                <Link to="/add-quiz" className="all-quiz-btn all-quiz-btn-primary all-quiz-btn-create">
                  <FaPlus />
                  Create New Quiz
                </Link>
              </div>
            </div>
          </div>

          <div className="all-quiz-quiz-content">
            {loading ? (
              <div className="all-quiz-loading-state">
                <div className="all-quiz-spinner"></div>
                <p className="all-quiz-loading-text">Loading quizzes...</p>
              </div>
            ) : error ? (
              <div className="all-quiz-alert all-quiz-alert-error">{error}</div>
            ) : quizData.length === 0 ? (
              <div className="all-quiz-empty-state">
                <div className="all-quiz-empty-icon">📝</div>
                <h3 className="all-quiz-empty-title">No Quizzes Yet</h3>
                <p className="all-quiz-empty-text">
                  Create your first quiz to test your stall-quizents' knowledge
                </p>
                <Link to="/add-quiz" className="all-quiz-btn all-quiz-btn-primary all-quiz-btn-empty">
                  <FaPlus style={{ marginRight: '8px' }} />
                  Create Your First Quiz
                </Link>
              </div>
            ) : (
              <div className="all-quiz-table-container">
                <table className="all-quiz-table">
                  <thead className="all-quiz-table-header">
                    <tr>
                      <th className="all-quiz-table-head">Quiz Name</th>
                      <th className="all-quiz-table-head">Questions</th>
                      <th className="all-quiz-table-head">Student Attempts</th>
                      <th className="all-quiz-table-head all-quiz-actions-head">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="all-quiz-table-body">
                    {quizData.map((quiz) => (
                      <tr key={quiz.id} className="all-quiz-table-row">
                        <td className="all-quiz-table-cell">
                          <Link to={`/all-questions/${quiz.id}`} className="all-quiz-quiz-title-link">
                            {quiz.title}
                          </Link>
                        </td>
                        <td className="all-quiz-table-cell">
                          <Link to={`/all-questions/${quiz.id}`} className="all-quiz-questions-link">
                            <FaQuestionCircle />
                            View Questions
                          </Link>
                        </td>
                        <td className="all-quiz-table-cell">
                          <div className="all-quiz-attempts-container">
                            <Link 
                              to={`/attempted-students/${quiz.id}`} 
                              className="all-quiz-attempts-badge"
                              title={`${attemptCounts[quiz.id] || 0} stall-quizents attempted this quiz`}
                            >
                              <div className="all-quiz-attempts-icon">
                                <FaUsers size={20} />
                                <FaClipboardCheck 
                                  size={12} 
                                  className="all-quiz-attempts-check"
                                />
                              </div>
                              <span className="all-quiz-attempts-count">
                                {attemptCounts[quiz.id] || 0} students
                              </span>
                            </Link>
                          </div>
                        </td>
                        <td className="all-quiz-table-cell all-quiz-actions-cell">
                          <div className="all-quiz-actions-group">
                            <Link 
                              to={`/edit-quiz/${quiz.id}`} 
                              className="all-quiz-btn all-quiz-btn-action all-quiz-btn-edit"
                              data-tooltip="Edit Quiz"
                            >
                              <i className="bi bi-pencil-square"></i>
                            </Link>
                            <Link 
                              to={`/add-quiz-question/${quiz.id}`} 
                              className="all-quiz-btn all-quiz-btn-action all-quiz-btn-add"
                              data-tooltip="Add Question"
                            >
                              <i className="bi bi-plus-lg"></i>
                            </Link>
                            <button 
                              onClick={() => handleDeleteClick(quiz.id)} 
                              className="all-quiz-btn all-quiz-btn-action all-quiz-btn-delete"
                              data-tooltip="Delete Quiz"
                            >
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
        </main>
      </div>
    </div>
  )
}

export default AllQuiz