"use client"
import Sidebar from "./Sidebar"
import axios from "axios"
import { useParams } from "react-router-dom"
import CheckQuizStatusForStudent from "./CheckQuizStatusForStudent"
import { useState, useEffect } from "react"
import "../../TeacherCourses.css" // Same CSS as TeacherCourses

const baseUrl = "http://127.0.0.1:8000/api"

function CourseQuizList() {
  const [quizData, setquizData] = useState([])
  const studentId = localStorage.getItem("studentId")
  const { course_id } = useParams()

  useEffect(() => {
    if (!studentId) {
      console.error("Error: studentId is missing in localStorage.")
      return
    }

    axios
      .get(`${baseUrl}/fetch-assigned-quiz/${course_id}`)
      .then((res) => {
        setquizData(res.data)
      })
      .catch((error) => console.error("Error fetching courses:", error))
  }, [course_id, studentId])

  return (
    <div className="courseee-page__container">
      <div className="courseee-row">
        <aside className="courseee-col--sidebar">
          <Sidebar />
        </aside>
        <section className="courseee-col--main">
          <div className="courseee-card courseee-course__card">
            <h5 className="courseee-card__header">Quiz List</h5>
            <div className="courseee-card__body">
              <table className="courseee-table">
                <thead className="courseee-table__header">
                  <tr>
                    <th>Quiz</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {quizData.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <span className="courseee-course__title">
                          {row.quiz.title}
                        </span>
                      </td>
                      <td className="courseee-text--center">
                        <CheckQuizStatusForStudent quiz={row.quiz.id} student={studentId} />
                      </td>
                    </tr>
                  ))}
                  {quizData.length === 0 && (
                    <tr>
                      <td colSpan="2" className="courseee-text--center text-muted">
                        No quizzes assigned to this course.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default CourseQuizList