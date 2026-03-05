import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import { FaPlusCircle, FaQuestionCircle } from "react-icons/fa";
import { FaBook } from 'react-icons/fa';
import "../../TeacherCourses.css";

const baseUrl = "http://127.0.0.1:8000/api";

function TeacherCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const teacherId = localStorage.getItem("teacherId");
    axios
      .get(`${baseUrl}/teacher-courses/${teacherId}/`)
      .then((res) => {
        setCourses(res.data);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, []); 

  return (
    <div className="courseee-page__container">
      <div className="courseee-row">
        <aside className="courseee-col--sidebar">
          <TeacherSidebar />
        </aside>
        <section className="courseee-col--main">
          <div className="courseee-card courseee-course__card">
            <h5 className="courseee-card__header">My Courses</h5>
            <div className="courseee-card__body">
              <table className="courseee-table">
                <thead className="courseee-table__header">
                  <tr>
                    <th>Title</th>
                    <th>Image</th>
                    <th>Enrolled</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td>
                        <Link to={`/all-chapters/${course.id}`} className="courseee-course__title">
                          {course.title}
                        </Link>
                        <hr />
                        {course.course_rating ?
                          <span className="courseee-course__rating">Rating : {course.course_rating}/5</span>
                          :
                          <span className="courseee-course__rating">Rating : 0/5</span>
                        }
                      </td>
                      <td>
                        <img src={course.featured_img} alt={course.title} className="courseee-course__img--small" />
                      </td>
                      <td>
                        <Link to={`/enrolled-students/${course.id}`} className="courseee-course__enrolled">
                          {course.total_enrolled_students}
                        </Link>
                      </td>
                      <td className="courseee-text--center">
                        <Link to={`/edit-course/${course.id}`} className="courseee-btn courseee-btn--edit courseee-me--sm">
                          <i className="bi bi-pencil-square"></i>
                        </Link>
                        <Link to={`/study-materials/${course.id}`} className="courseee-btn courseee-btn--secondary courseee-me--sm">
                          <FaBook size={21} />
                        </Link>
                        <Link to={`/add-chapter/${course.id}`} className="courseee-btn courseee-btn--add courseee-me--sm">
                          <i className="bi bi-plus"></i>
                        </Link>
                        <br />
                        <Link to={`/assign-quiz/${course.id}`} className="courseee-btn courseee-btn--warning courseee-me--sm">
                          Quiz
                        </Link>
                        <button className="courseee-btn courseee-btn--delete courseee-me--sm courseee-mt--sm">
                          <i className="bi bi-trash3"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TeacherCourses;
