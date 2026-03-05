"use client"

import { Link } from "react-router-dom"
import axios from "axios"
import { useState, useEffect } from "react"

const baseUrl = "http://127.0.0.1:8000/api"

function CheckQuizStatusForStudent(props) {
  const [quizStatus, setQuizStatus] = useState({ bool: false })
  const [loading, setLoading] = useState(true)
  const { quiz, student } = props

  useEffect(() => {
    if (!quiz || !student) {
      console.error("Missing quiz or student ID")
      setLoading(false)
      return
    }

    setLoading(true)
    axios
      .get(`${baseUrl}/fetch-quiz-attempt-status/${quiz}/${student}/`)
      .then((response) => {
        setQuizStatus(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching quiz status:", error)
        // Initialize with default value in case of error
        setQuizStatus({ bool: false })
        setLoading(false)
      })
  }, [quiz, student])

  if (loading) {
    return (
      <td>
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...
      </td>
    )
  }

  return (
    <td>
      {quizStatus.bool === false ? (
        <Link to={`/take-quiz/${quiz}`} className="btn btn-success btn-sm ms-2">
          Take Quiz
        </Link>
      ) : (
        <>
          <span className="text-success">Attempted</span>
            
        </>
      )}
    </td>
  )
}

export default CheckQuizStatusForStudent

