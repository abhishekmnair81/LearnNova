"use client"

import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import "../Category.css"

const baseUrl = "http://127.0.0.1:8000/api"

function CategoryCourses() {
  const [courseData, setCourseData] = useState([])
  const [categoryInfo, setCategoryInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { category_id } = useParams()

  useEffect(() => {
    // First fetch the category information
    axios
      .get(`${baseUrl}/category/`)
      .then((res) => {
        const categories = res.data
        const currentCategory = categories.find((cat) => cat.id.toString() === category_id)

        if (currentCategory) {
          setCategoryInfo(currentCategory)
        } else {
          setError("Category not found")
        }
      })
      .catch((err) => {
        console.error("Error fetching category info:", err)
        setError("Failed to load category information")
      })

    // Then fetch the courses for this category
    setLoading(true)
    axios
      .get(`${baseUrl}/course/?category=${category_id}`)
      .then((res) => {
        // Check if the response has a results property (pagination)
        if (res.data.results && Array.isArray(res.data.results)) {
          setCourseData(res.data.results)
        } else if (Array.isArray(res.data)) {
          // If the response is directly an array
          setCourseData(res.data)
        } else {
          // Fallback to empty array if structure is unexpected
          setCourseData([])
          console.warn("Unexpected API response structure:", res.data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching category courses:", err)
        setError("Failed to load courses")
        setLoading(false)
      })
  }, [category_id])

  return (
    <div className="category-container">
  <h3 className="category-courses-header">
    {categoryInfo ? categoryInfo.title : "Loading category..."}
  </h3>

  {categoryInfo && (
    <div className="mb-4">
      <p className="category-card-description">{categoryInfo.description}</p>
    </div>
  )}

  {loading ? (
    <div className="loading-spinner">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : error ? (
    <div className="alert alert-danger">{error}</div>
  ) : courseData.length > 0 ? (
    <div className="category-courses-grid">
      {courseData.map((course) => (
        <div className="course-card" key={course.id}>
          <Link to={`/detail/${course.id}`}>
            <img
              src={course.featured_img || "/placeholder.svg"}
              className="course-card-img"
              alt={course.title}
              onError={(e) => {
                e.target.src = "/placeholder.svg?height=200&width=300";
                e.target.onerror = null;
              }}
            />
          </Link>
          <div className="course-card-body">
            <h5 className="course-card-title">
              <Link to={`/detail/${course.id}`}>{course.title}</Link>
            </h5>
            {course.description && (
              <p className="course-card-text">
                {course.description.length > 100
                  ? `${course.description.substring(0, 100)}...`
                  : course.description}
              </p>
            )}
          </div>
          <div className="course-card-footer">
            <Link to={`/detail/${course.id}`} className="btn btn-primary">
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="alert alert-info">No courses available for this category.</div>
  )}
</div>
  )
}

export default CategoryCourses

