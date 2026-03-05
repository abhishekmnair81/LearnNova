"use client"

import Sidebar from "./Sidebar"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import "../../TakeQuiz.css"

const baseUrl = "http://127.0.0.1:8000/api"

function TakeQuiz() {
  const [questionData, setQuestionData] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [attemptedQuestions, setAttemptedQuestions] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { quiz_id } = useParams()
  const studentId = localStorage.getItem("studentId")
  const navigate = useNavigate()

  useEffect(() => {
    if (!studentId) {
      setError("Student ID not found. Please log in again.")
      setLoading(false)
      return
    }

    setLoading(true)
    axios
      .get(`${baseUrl}/quiz-questions/${quiz_id}`)
      .then((response) => {
        if (response.data.length === 0) {
          setError("No questions available for this quiz.")
        } else {
          setQuestionData(response.data)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching quiz questions:", error)
        setError("Failed to load quiz questions. Please try again.")
        setLoading(false)
      })
  }, [quiz_id, studentId])

  const handleOptionSelect = (option) => {
    setSelectedOption(option)
  }

  const submitAnswer = () => {
    if (!questionData.length || !selectedOption) return

    const questionId = questionData[currentQuestion].id
    setAttemptedQuestions((prev) => new Set([...prev, questionId]))

    const formData = new FormData()
    formData.append("student", studentId)
    formData.append("quiz", quiz_id)
    formData.append("question", questionId)
    formData.append("right_ans", selectedOption) // This is the student's answer, not whether it's right

    // Show loading indicator
    Swal.fire({
      title: "Submitting...",
      didOpen: () => {
        Swal.showLoading()
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
    })

    axios
      .post(`${baseUrl}/attempt-quiz/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        Swal.close()

        if (currentQuestion >= questionData.length - 1) {
          // Last question completed
          Swal.fire({
            title: "Quiz Completed!",
            text: "You have answered all questions.",
            icon: "success",
            confirmButtonText: "View My Courses",
          }).then(() => {
            navigate(`/my-courses`)
          })
        } else {
          // Move to next question
          setCurrentQuestion((prev) => prev + 1)
          setSelectedOption(null)
        }
      })
      .catch((error) => {
        console.error("Error submitting answer:", error)
        Swal.fire({
          title: "Error",
          text: "Failed to submit your answer. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        })
      })
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questionData.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedOption(null)
    } else {
      // If last question is skipped, redirect to my-courses
      Swal.fire({
        title: "Quiz Completed!",
        text: "You have finished the quiz.",
        icon: "success",
        confirmButtonText: "View My Courses",
      }).then(() => {
        navigate(`/my-courses`)
      })
    }
  }

  if (loading) {
    return (
      <div className="take-quiz-container">
        <div className="take-quiz-row">
          <aside className="take-quiz-sidebar">
            <Sidebar />
          </aside>
          <section className="take-quiz-main">
            <div className="take-quiz-card">
              <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading quiz questions...</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="take-quiz-container">
        <div className="take-quiz-row">
          <aside className="take-quiz-sidebar">
            <Sidebar />
          </aside>
          <section className="take-quiz-main">
            <div className="take-quiz-card">
              <div className="alert alert-danger m-4">{error}</div>
              <div className="text-center mb-4">
                <button className="btn btn-primary" onClick={() => navigate("/my-courses")}>
                  Back to My Courses
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="take-quiz-container">
      <div className="take-quiz-row">
        <aside className="take-quiz-sidebar">
          <Sidebar />
        </aside>
        <section className="take-quiz-main">
          <div className="take-quiz-card">
            <h5 className="take-quiz-header">
              Question {currentQuestion + 1} of {questionData.length}
            </h5>
            <div className="take-quiz-body">
              <div className="take-quiz-question">{questionData[currentQuestion].question}</div>
              <div className="take-quiz-options">
                {[
                  questionData[currentQuestion].ans1,
                  questionData[currentQuestion].ans2,
                  questionData[currentQuestion].ans3,
                  questionData[currentQuestion].ans4,
                ].map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`take-quiz-option ${selectedOption === option ? "selected" : ""}`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    <input
                      type="radio"
                      id={`option-${optIndex}`}
                      name="quiz-option"
                      checked={selectedOption === option}
                      onChange={() => handleOptionSelect(option)}
                    />
                    <label htmlFor={`option-${optIndex}`}>{option}</label>
                  </div>
                ))}
              </div>
              <div className="take-quiz-actions">
                <button className="take-quiz-skip" onClick={handleNextQuestion}>
                  {currentQuestion < questionData.length - 1 ? "Skip" : "Finish Quiz"}
                </button>
                <button className="take-quiz-submit" onClick={submitAnswer} disabled={!selectedOption}>
                  Submit
                </button>
              </div>
              <div className="take-quiz-progress">
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${(currentQuestion / questionData.length) * 100}%` }}
                    aria-valuenow={(currentQuestion / questionData.length) * 100}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <span className="progress-text">
                  {Math.round((currentQuestion / questionData.length) * 100)}% Complete
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default TakeQuiz

