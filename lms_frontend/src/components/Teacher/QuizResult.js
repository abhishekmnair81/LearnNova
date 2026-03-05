"use client"

import axios from "axios"
import { useState, useEffect } from "react"
import "../../AttemptedStudents.css"

const baseUrl = "http://127.0.0.1:8000/api"

function QuizResult({ quiz, student }) {
  const [resultData, setResultData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${baseUrl}/fetch-quiz-result/${quiz}/${student}/`)
      .then((res) => {
        setResultData(res.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching quiz results:", error)
        setError("Failed to load quiz results")
        setLoading(false)
      })
  }, [quiz, student])

  // Calculate percentage score
  const calculatePercentage = () => {
    if (!resultData || resultData.total_questions === 0) return 0
    return Math.round((resultData.correct_answers / resultData.total_questions) * 100)
  }

  // Determine result status based on percentage
  const getResultStatus = () => {
    const percentage = calculatePercentage()
    if (percentage >= 70) return "Pass"
    return "Fail"
  }

  return (
    <div className="modal-dialog modal-lg">
      <div className="modal-content attempted-students-modal">
        <div className="modal-header">
          <h1 className="modal-title fs-5">Quiz Result</h1>
          <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div className="modal-body">
          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : resultData ? (
            <div>
              <table className="table">
                <tbody>
                  <tr>
                    <th>Total Questions</th>
                    <td>{resultData.total_questions}</td>
                  </tr>
                  <tr>
                    <th>Attempted Questions</th>
                    <td>{resultData.attempted_questions}</td>
                  </tr>
                  <tr>
                    <th>Correct Answers</th>
                    <td>{resultData.correct_answers || 0}</td>
                  </tr>
                  <tr>
                    <th>Score</th>
                    <td>
                      {resultData.correct_answers || 0} / {resultData.total_questions} ({calculatePercentage()}%)
                    </td>
                  </tr>
                  <tr>
                    <th>Result</th>
                    <td>
                      <span className={`badge ${getResultStatus() === "Pass" ? "bg-success" : "bg-danger"}`}>
                        {getResultStatus()}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p>No results available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizResult

