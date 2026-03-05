"use client"

import { Link, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import TeacherSidebar from "./TeacherSidebar"
import axios from "axios"
import QuizResult from "./QuizResult"
import "../../AttemptedStudents.css"

const baseUrl = "http://127.0.0.1:8000/api"

function AttemptedStudents() {
  const [studentData, setStudentData] = useState([])
  const [quizTitle, setQuizTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { quiz_id } = useParams()

  useEffect(() => {
    setLoading(true)

    axios
      .get(`${baseUrl}/teacher-quiz-detail/${quiz_id}/`)
      .then((res) => {
        setQuizTitle(res.data.title)
      })
      .catch((error) => {
        console.error("Error fetching quiz details:", error)
      })

    axios
      .get(`${baseUrl}/attempted-quiz/${quiz_id}/`)
      .then((res) => {
        const uniqueStudents = []
        const studentIds = new Set()

        res.data.forEach((attempt) => {
          if (!studentIds.has(attempt.student.id)) {
            studentIds.add(attempt.student.id)
            uniqueStudents.push(attempt)
          }
        })

        setStudentData(uniqueStudents)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching attempted students:", error)
        setError("Failed to load attempted students data")
        setLoading(false)
      })
  }, [quiz_id])

  return (
    <div className="ud-attempted-students">
      <div className="ud-container">
        <div className="ud-layout">
          <aside className="ud-sidebar">
            <TeacherSidebar />
          </aside>
          <main className="ud-main-content">
            <div className="ud-content-card">
              <div className="ud-card-header">
                <div className="ud-header-content">
                  <h1 className="ud-header-title">Students Who Attempted: {quizTitle}</h1>
                  <Link to={`/all-questions/${quiz_id}`} className="ud-btn ud-btn-primary">
                    Back to Quiz
                  </Link>
                </div>
              </div>
              <div className="ud-card-body">
                {loading ? (
                  <div className="ud-loading-state">
                    <div className="ud-spinner" role="status">
                      <span className="ud-sr-only">Loading...</span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="ud-alert ud-alert-error">{error}</div>
                ) : studentData.length === 0 ? (
                  <div className="ud-alert ud-alert-info">No students have attempted this quiz yet.</div>
                ) : (
                  <div className="ud-table-container">
                    <table className="ud-table">
                      <thead className="ud-table-header">
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Username</th>
                          <th>Result</th>
                        </tr>
                      </thead>
                      <tbody className="ud-table-body">
                        {studentData.map((row) => (
                          <tr key={row.id} className="ud-table-row">
                            <td className="ud-table-cell">{row.student.full_name}</td>
                            <td className="ud-table-cell">{row.student.email}</td>
                            <td className="ud-table-cell">{row.student.username}</td>
                            <td className="ud-table-cell">
                              <button
                                type="button"
                                className="ud-btn ud-btn-secondary ud-btn-sm"
                                data-bs-toggle="modal"
                                data-bs-target={`#resultModal${row.student.id}`}
                              >
                                View Result
                              </button>
                              <div
                                className="modal fade"
                                id={`resultModal${row.student.id}`}
                                tabIndex="-1"
                                aria-hidden="true"
                              >
                                <QuizResult quiz={row.quiz.id} student={row.student.id} />
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
          </main>
        </div>
      </div>
    </div>
  )
}

export default AttemptedStudents