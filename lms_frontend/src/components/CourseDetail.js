"use client"

import { useParams, Link } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import Swal from "sweetalert2"
import "../CourseDetail.css"

const siteUrl = "http://127.0.0.1:8000/"
const baseUrl = "http://127.0.0.1:8000/api"

function CourseDetail() {
  const { course_id } = useParams()
  const [courseData, setCourseData] = useState({})
  const [chapterData, setChapterData] = useState([])
  const [teacherData, setTeacherData] = useState({})
  const [relatedCourseData, setRelatedCourseData] = useState([])
  const [techListData, setTechListData] = useState([])
  const [userLoginStatus, setUserLoginStatus] = useState(false)
  const [enrollStatus, setEnrollStatus] = useState(false)
  const [ratingStatus, setRatingStatus] = useState(false)
  const [avgRating, setAvgRating] = useState(0)
  const [rating, setRating] = useState(0)
  const [courseViews, setcourseViews] = useState(0)
  const [review, setReview] = useState("")
  const [isFavorite, setIsFavorite] = useState(false)

  const isTeacher = localStorage.getItem("isTeacher") === "true"
  const studentId = localStorage.getItem("studentId")

  const videoRefs = useRef({})

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await axios.get(`${baseUrl}/course/${course_id}/`)
        setCourseData(res.data)
        setChapterData(res.data.course_chapters || [])
        setTeacherData(res.data.teacher || {})
        setRelatedCourseData(res.data.related_videos ? JSON.parse(res.data.related_videos) : [])
        setTechListData(res.data.tech_list || [])
        setAvgRating(res.data.avg_rating || 0)

        axios.get(`${baseUrl}/update-view/${course_id}/`).then((res) => {
          setcourseViews(res.data.views)
        })
      } catch (error) {
        console.error("Error fetching course data:", error)
      }
    }

    const fetchUserStatus = async () => {
      if (localStorage.getItem("studentLoginStatus") === "true" && !isTeacher) {
        setUserLoginStatus(true)
        try {
          const [favoriteRes, enrollRes, ratingRes] = await Promise.all([
            axios.get(`${baseUrl}/fetch-favorite-status/${studentId}/${course_id}/`),
            axios.get(`${baseUrl}/fetch-enroll-status/${studentId}/${course_id}/`),
            axios.get(`${baseUrl}/fetch-rating-status/${studentId}/${course_id}/`),
          ])
          setIsFavorite(favoriteRes.data.bool)
          setEnrollStatus(enrollRes.data.bool)
          setRatingStatus(ratingRes.data.bool)
        } catch (error) {
          console.error("Error fetching user status:", error)
        }
      }
    }

    fetchCourseDetails()
    fetchUserStatus()
  }, [course_id, studentId, isTeacher])

  useEffect(() => {
    const handleModalOpen = (event) => {
      const modalId = event.relatedTarget.getAttribute("data-bs-target")
      const chapterIndex = modalId.replace("#videoModal", "")
      setTimeout(() => {
        if (videoRefs.current[chapterIndex]) {
          videoRefs.current[chapterIndex].play()
        }
      }, 500)
    }

    const handleModalClose = (event) => {
      const modalId = event.target.id
      const chapterIndex = modalId.replace("videoModal", "")
      if (videoRefs.current[chapterIndex]) {
        videoRefs.current[chapterIndex].pause()
      }
    }

    document.querySelectorAll('[id^="videoModal"]').forEach((modal) => {
      modal.addEventListener("shown.bs.modal", handleModalOpen)
      modal.addEventListener("hidden.bs.modal", handleModalClose)
    })

    return () => {
      document.querySelectorAll('[id^="videoModal"]').forEach((modal) => {
        modal.removeEventListener("shown.bs.modal", handleModalOpen)
        modal.removeEventListener("hidden.bs.modal", handleModalClose)
      })
    }
  }, [chapterData])

  const handleFavorite = async () => {
    try {
      await axios.post(`${baseUrl}/student-add-favorite-course/`, {
        course: courseData.id,
        student: Number.parseInt(studentId),
      })
      setIsFavorite(true)
      Swal.fire({
        title: "Success",
        text: "Course added to favorites!",
        icon: "success",
        confirmButtonColor: "#a435f0",
      })
    } catch (error) {
      console.error("Error adding to favorites:", error)
      Swal.fire({
        title: "Error",
        text: "Could not add to favorites.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      })
    }
  }

  const removeFavorite = async () => {
    try {
      await axios.delete(`${baseUrl}/student-remove-favorite-course/${course_id}/${studentId}/`)
      Swal.fire({
        title: "Success",
        text: "This course has been removed from your wishlist!",
        icon: "success",
        confirmButtonColor: "#a435f0",
      })
      setIsFavorite(false)
    } catch (error) {
      console.error("Error removing from favorites:", error)
      Swal.fire({
        title: "Error",
        text: "Could not remove from favorites.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      })
    }
  }

  const enrollCourse = async () => {
    if (!courseData.id || !studentId) {
      Swal.fire({
        title: "Error",
        text: "Student ID or Course ID is missing!",
        icon: "error",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    const formData = new FormData()
    formData.append("course", courseData.id)
    formData.append("student", studentId)

    try {
      await axios.post(`${baseUrl}/student-enroll-course/`, formData)
      Swal.fire({
        title: "Success",
        text: "You have successfully enrolled in this course!",
        icon: "success",
        confirmButtonColor: "#a435f0",
      })
      setEnrollStatus(true)
    } catch (error) {
      console.error("Enrollment failed:", error)
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      })
    }
  }

  const handleRatingSubmit = async () => {
    if (!rating) {
      Swal.fire({
        title: "Error",
        text: "Please select a rating before submitting.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    const formData = new FormData()
    formData.append("course", courseData.id)
    formData.append("student", studentId)
    formData.append("rating", rating)
    formData.append("review", review)

    try {
      await axios.post(`${baseUrl}/course-rating/${course_id}/`, formData)
      Swal.fire({
        title: "Thank you!",
        text: "Your rating and review have been submitted.",
        icon: "success",
        confirmButtonColor: "#a435f0",
      })
      setReview("")
      setRating(0)
      setRatingStatus(true)

      const res = await axios.get(`${baseUrl}/course/${course_id}/`)
      setAvgRating(res.data.avg_rating || 0)
    } catch (error) {
      console.error("Error submitting rating:", error.response?.data || error.message)
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#ef4444",
      })
    }
  }

  const renderStars = (rating) => {
    return "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating))
  }

  return (
    <div className="course-detail-page">
      {/* Hero Section */}
      <div className="course-hero-section">
        <div className="course-hero-container">
          <div className="course-hero-layout">
            <div className="course-hero-content">
              <h1 className="course-hero-title">
                {courseData.title}
                {!isTeacher && userLoginStatus && (
                  <>
                    {isFavorite ? (
                      <button className="course-favorite-btn" title="Remove from favorites" onClick={removeFavorite}>
                        <i className="bi bi-heart-fill"></i>
                      </button>
                    ) : (
                      <button className="course-favorite-btn" title="Add to favorites" onClick={handleFavorite}>
                        <i className="bi bi-heart"></i>
                      </button>
                    )}
                  </>
                )}
              </h1>

              <p className="course-hero-description">{courseData.description}</p>

              <div className="course-hero-meta">
                <div className="course-meta-item">
                  <span className="course-meta-label">Instructor:</span>
                  <Link to={`/teacher-detail/${teacherData.id}`} className="course-meta-link">
                    {teacherData.full_name}
                  </Link>
                </div>

                <div className="course-meta-item">
                  <span className="course-meta-label">Enrolled:</span>
                  <span>{courseData.total_enrolled_students} students</span>
                </div>

                <div className="course-meta-item">
                  <span className="course-meta-label">Views:</span>
                  <span>{courseViews}</span>
                </div>

                <div className="course-meta-item course-rating-display">
                  <span className="course-rating-stars">{renderStars(avgRating)}</span>
                  <span className="course-rating-text">{avgRating.toFixed(1)}/5</span>
                  {userLoginStatus && enrollStatus && !ratingStatus && (
                    <button className="btn-rate-course" data-bs-toggle="modal" data-bs-target="#ratingModal">
                      Rate Course
                    </button>
                  )}
                  {ratingStatus && <span className="course-rated-text">You rated this course</span>}
                </div>
              </div>

              <div className="course-hero-meta" style={{ marginTop: "16px" }}>
                <div className="course-meta-item">
                  <span className="course-meta-label">Technologies:</span>
                  <div className="course-tech-tags">
                    {techListData.map((tech, index) => (
                      <Link key={index} to={`/category/${tech.trim()}`} className="course-tech-tag">
                        {tech.trim()}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="course-enroll-action">
                {userLoginStatus ? (
                  enrollStatus ? (
                    <p className="course-enrolled-badge">✓ You are enrolled in this course</p>
                  ) : (
                    <button className="btn-course-enroll" onClick={enrollCourse}>
                      Enroll Now
                    </button>
                  )
                ) : (
                  <p className="course-login-prompt">
                    <Link className="course-login-link" to="/user-login">
                      Please login to enroll in this course
                    </Link>
                  </p>
                )}
              </div>
            </div>

            <div className="course-hero-image">
              <img
                src={courseData.featured_img || "/placeholder.svg"}
                className="course-hero-img"
                alt={courseData.title}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="course-content-section">
        <div className="course-content-container">
          {/* Course Chapters */}
          {enrollStatus && userLoginStatus && (
            <div className="course-chapters-card">
              <div className="course-chapters-header">Course Content</div>
              <ul className="course-chapters-list">
                {chapterData.map((chapter, index) => (
                  <li key={index} className="course-chapter-item">
                    <span className="course-chapter-title">{chapter.title}</span>
                    <div className="course-chapter-actions">
                      <span className="course-chapter-duration">{chapter.duration}</span>
                      <button
                        className="btn-chapter-watch"
                        data-bs-toggle="modal"
                        data-bs-target={`#videoModal${index}`}
                      >
                        <i className="bi bi-play-circle-fill"></i>
                        Play
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Related Courses */}
          {relatedCourseData.length > 0 && (
            <div className="related-courses-section">
              <h2 className="related-courses-title">Students Also Bought</h2>
              <div className="related-courses-grid">
                {relatedCourseData.map((rcourse, index) => (
                  <Link key={index} to={`/detail/${rcourse.pk}`} className="related-course-card">
                    <div className="related-course-image-wrapper">
                      <img
                        src={`${siteUrl}media/${rcourse.fields.featured_img}`}
                        className="related-course-image"
                        alt={rcourse.fields.title}
                      />
                    </div>
                    <div className="related-course-body">
                      <h3 className="related-course-title-text">{rcourse.fields.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Modals */}
      {chapterData.map((chapter, index) => (
        <div
          key={index}
          className="modal fade"
          id={`videoModal${index}`}
          tabIndex={-1}
          aria-labelledby={`videoModalLabel${index}`}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content video-modal-content">
              <div className="modal-header video-modal-header">
                <h5 className="modal-title video-modal-title" id={`videoModalLabel${index}`}>
                  {chapter.title}
                </h5>
                <button type="button" className="btn-close video-modal-close" data-bs-dismiss="modal" aria-label="Close">
                  ×
                </button>
              </div>
              <div className="modal-body video-modal-body">
                {chapter.video ? (
                  <video controls width="100%" className="video-player" ref={(el) => (videoRefs.current[index] = el)}>
                    <source src={chapter.video} type="video/mp4" />
                    Sorry, your browser does not support embedded videos.
                  </video>
                ) : (
                  <div className="alert alert-warning">No video available for this chapter.</div>
                )}
              </div>
              <div className="modal-footer video-modal-footer">
                <button type="button" className="btn-modal-close" data-bs-dismiss="modal">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Rating Modal */}
      <div className="modal fade" id="ratingModal" tabIndex="-1" aria-labelledby="ratingModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content rating-modal-content">
            <div className="modal-header rating-modal-header">
              <h5 className="modal-title rating-modal-title" id="ratingModalLabel">
                Rate {courseData.title}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body rating-modal-body">
              <p>How would you rate this course?</p>
              <div className="rating-stars-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`btn-rating-star ${rating === star ? "active" : ""}`}
                    onClick={() => setRating(star)}
                  >
                    {star} <i className="bi bi-star-fill"></i>
                  </button>
                ))}
              </div>
              <div style={{ marginTop: "20px" }}>
                <label htmlFor="review" className="form-label">
                  Your Review:
                </label>
                <textarea
                  id="review"
                  className="rating-review-input"
                  rows="4"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your thoughts about this course..."
                ></textarea>
              </div>
            </div>
            <div className="modal-footer rating-modal-footer">
              <button type="button" className="btn-modal-close" data-bs-dismiss="modal">
                Cancel
              </button>
              <button type="button" className="btn-rating-submit" onClick={handleRatingSubmit}>
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail