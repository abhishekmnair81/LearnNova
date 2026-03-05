import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../AllCourses.css";

const baseUrl = "http://127.0.0.1:8000/api/course/";

function AllCourses() {
  const [courseData, setCourseData] = useState([]);
  const [nextUrl, setnextUrl] = useState();
  const [previousUrl, setpreviousUrl] = useState();
  
  useEffect(() => {
    axios
      .get(baseUrl)
      .then((res) => {
          setnextUrl(res.data.next)
          setpreviousUrl(res.data.previous)
        setCourseData(res.data.results);
      });
  }, []);
  const paginationHandler =(url)=>{
    axios
      .get(url)
      .then((res) => {
        setnextUrl(res.data.next)
        setpreviousUrl(res.data.previous)
        setCourseData(res.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  return (
    <div className="all-course-allcourses__container">
      <h3 className="all-course-section__title">Latest Courses</h3>
      <div className="all-course-courses__grid">
        {courseData.map((course) => (
          <div className="all-course-course__card" key={course.id}>
            <Link to={`/detail/${course.id}`}>
              <img src={course.featured_img} className="all-course-course__img" alt={course.title} />
            </Link>
            <div className="all-course-course__info">
              <h5 className="all-course-course__title">
                <Link to={`/detail/${course.id}`}>{course.title}</Link>
              </h5>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <nav className="all-course-pagination__container">
        <ul className="all-course-pagination">
          <li className="all-course-page__item">
            {previousUrl &&
              <button className="all-course-page__link"  onClick={() =>paginationHandler(previousUrl)}>
                <i className="bi bi-arrow-left"></i> Previous
              </button>
            }
          </li>
          <li className="all-course-page__item">
            {nextUrl &&
              <button className="all-course-page__link" onClick={() =>paginationHandler(nextUrl)}>
                Next <i className="bi bi-arrow-right"></i>
              </button>
            }
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AllCourses;
