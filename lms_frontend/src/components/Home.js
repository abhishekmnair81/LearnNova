"use client"

import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import "../Home.css"  
import learnovaLogo from "../eell.png";

const baseUrl = "http://127.0.0.1:8000/api"

function Home() {
  const [courseData, setCourseData] = useState([])
  const [popularCourseData, setPopularCourseData] = useState([])
  const [popularTeacherData, setTeacherData] = useState([])
  const [testimonialData, setTestimonialData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    axios
      .get(baseUrl + "/course")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCourseData(res.data)
        } else if (res.data && Array.isArray(res.data.results)) {
          setCourseData(res.data.results)
        } else {
          console.error("Course data is not an array:", res.data)
          setCourseData([])
        }
      })
      .catch((error) => {
        console.error("Error fetching courses:", error)
        setError("Failed to load latest courses")
        setCourseData([])
      })

    axios
      .get(baseUrl + "/popular-course/?popular=1")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setPopularCourseData(res.data)
        } else if (res.data && Array.isArray(res.data)) {
          setPopularCourseData(res.data)
        } else {
          console.error("Popular course data is not an array:", res.data)
          setPopularCourseData([])
        }
      })
      .catch((error) => {
        console.error("Error fetching popular courses:", error)
        setPopularCourseData([])
      })

    axios
      .get(baseUrl + "/popular-teachers/?popular=1")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTeacherData(res.data)
        } else if (res.data && Array.isArray(res.data.results)) {
          setTeacherData(res.data.results)
        } else {
          console.error("Teacher data is not an array:", res.data)
          setTeacherData([])
        }
      })
      .catch((error) => {
        console.error("Error fetching popular teachers:", error)
        setTeacherData([])
      })

    axios
      .get(baseUrl + "/student-testimonial/")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTestimonialData(res.data)
        } else if (res.data && Array.isArray(res.data.results)) {
          setTestimonialData(res.data.results)
        } else {
          console.error("Testimonial data is not an array:", res.data)
          setTestimonialData([])
        }
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching testimonials:", error)
        setTestimonialData([])
        setLoading(false)
      })
  }, [])

  const safeSlice = (array, start, end) => {
    if (!Array.isArray(array)) return []
    return array.slice(start, end)
  }

  if (loading) {
    return (
      <div className="home-home__container" style={{ backgroundColor: "#ffffff" }}>
        <div className="home-spinner--primary" role="status">
          <span className="home-visually-hidden">Loading...</span>
        </div>
        <p className="home-mt--md">Loading content...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="home-home__container">
        <div className="home-alert home-alert--danger">{error}</div>
      </div>
    )
  }

  return (

    <div className="home-home__container style=background-color: #f7f9fa ">
      <section className="home-why-learnova__wrapper">
        <div className="home-why-learnova__content">
          <h1 className="home-why-learnova__title">
            <span className="home-why-learnova__title-highlight">WHY</span> LEARNOVA
          </h1>
          <p className="home-why-learnova__text">
            Born in <strong>2025</strong>, LEARNOVA stands tall as the premier hub for global e-learning, much like Canvas and Thinkific — empowering educators and learners with seamless access to transformative knowledge.          </p>
          <p className="home-why-learnova__text">
            Our intuitive <em>student and teacher dashboards</em> make it effortless to dive into courses, just as on Skillshare or Google Classroom. Discover crystal-clear videos, tackle interactive quizzes, submit assignments with instant feedback, and connect via built-in messaging for real-time collaboration — all designed to fuel rapid skill growth and personalized progress tracking.          
          </p>
          <div className="home-why-learnova__cta">
            <Link to="/all-courses" className="home-why-learnova__btn">
              Explore Courses
            </Link>
          </div>
        </div>

        <div className="home-why-learnova__image-wrapper">
            <img 
              src={learnovaLogo} 
              alt="LEARNOVA Platform" 
              className="home-why-learnova__image"
            />
            <div className="home-why-learnova__image-glow"></div>
        </div>
      </section>
      <h3 className="home-section__title">
        Latest Courses
        <Link to="/all-courses" className="home-see-all">
          See All
        </Link>
      </h3>
      <div className="home-course__grid home-mb--lg">
        {courseData && courseData.length > 0 ? (
          safeSlice(courseData, 0, 4).map((course, index) => (
            <div className="home-course__card" key={index}>
              <Link to={`/detail/${course.id}`}>
                <img
                  src={course.featured_img || "/placeholder.svg"}
                  className="home-course__img"
                  alt={course.title}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/placeholder.svg?height=200&width=300"
                  }}
                />
              </Link>
              <div className="home-course__info">
                <h5 className="home-course__title">
                  <Link to={`/detail/${course.id}`}>{course.title}</Link>
                </h5>
              </div>
            </div>
          ))
        ) : (
          <div className="home-alert home-alert--info home-w--full">No latest courses available</div>
        )}
      </div>

      {/* Popular Courses */}
      <h3 className="home-section__title">
        Popular Courses
        <Link to="/popular-courses" className="home-see-all">
          See All
        </Link>
      </h3>
      <div className="home-course__grid home-mb--lg">
        {popularCourseData && popularCourseData.length > 0 ? (
          safeSlice(popularCourseData, 0, 4).map((row, index) => (
            <div className="home-course__card" key={index}>
              <div className="home-course__info">
                <Link to={`/detail/${row.course?.id}`}>
                  <img
                    src={row.course?.featured_img || "/placeholder.svg"}
                    className="home-course__img"
                    alt={row.course?.title}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/placeholder.svg?height=200&width=300"
                    }}
                  />
                </Link>
                <div className="home-card__body">
                  <h5 className="home-card__title">
                    <Link to={`/detail/${row.course?.id}`}>{row.course?.title}</Link>
                  </h5>
                </div>
                <div className="home-course__footer">
                  <span>⭐ {row.rating}/5</span>
                  <span className="home-views">👁 {row.course?.course_views}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="home-alert home-alert--info home-w--full">No popular courses available</div>
        )}
      </div>

      {/* Popular Teachers */}
      <h3 className="home-section__title">
        Popular Teachers
        <Link to="/popular-teachers" className="home-see-all">
          See All
        </Link>
      </h3>
      <div className="home-course__grid home-mb--lg">
        {popularTeacherData && popularTeacherData.length > 0 ? (
          safeSlice(popularTeacherData, 0, 4).map((teacher, index) => (
            <div className="home-course__card" key={index}>
              <div className="home-course__info">
                <Link to={`/teacher-detail/${teacher.id}`}>
                  <img
                    src={teacher.profile_img || "/placeholder.svg"}
                    className="home-course__img"
                    alt={teacher.full_name}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/placeholder.svg?height=200&width=300"
                    }}
                  />
                </Link>
                <div className="home-card__body">
                  <h5 className="home-card__title">
                    <Link to={`/teacher-detail/${teacher.id}`}>{teacher.full_name}</Link>
                  </h5>
                </div>
                <div className="home-course__footer">
                  <span>Total Courses: {teacher.total_teacher_courses}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="home-alert home-alert--info home-w--full">No popular teachers available</div>
        )}
      </div>

      {/* Student Testimonial */}
      <h3 className="home-section__title">Student Testimonial</h3>
      {testimonialData && testimonialData.length > 0 ? (
        <div id="carouselExampleIndicators" className="home-carousel">
          <div className="home-carousel__indicators">
            {testimonialData.map((row, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
          <div className="home-carousel__inner">
            {testimonialData.map((row, i) => (
              <div key={i} className={i === 0 ? "home-carousel__item active" : "home-carousel__item"}>
                <figure className="home-carousel__figure">
                  <blockquote className="home-blockquote">
                    <p>
                      <span>Reviews</span>: {row.review}
                    </p>
                  </blockquote>
                  <figcaption className="home-blockquote__footer">
                    {row.course?.title} <cite title="Source Title">{row.student?.full_name}</cite>
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
          <button
            className="home-carousel__control--prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span className="home-carousel__control-icon--prev" aria-hidden="true"></span>
            <span className="home-visually-hidden">Previous</span>
          </button>
          <button
            className="home-carousel__control--next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span className="home-carousel__control-icon--next" aria-hidden="true"></span>
            <span className="home-visually-hidden">Next</span>
          </button>
        </div>
      ) : (
        <div className="home-alert home-alert--info">No testimonials available</div>
      )}
    </div>
  )
}
export default Home
