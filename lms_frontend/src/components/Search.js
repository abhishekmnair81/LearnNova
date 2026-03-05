import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../AllCourses.css";

const baseUrl = "http://127.0.0.1:8000/api";

function Search() {
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchstring } = useParams();

  useEffect(() => {
  setLoading(true);
  axios
    .get(`${baseUrl}/search-courses/${searchstring}`) 
    .then((res) => {
      setCourseData(res.data.results || res.data);
      setLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
    });
}, [searchstring]);

  return (
  <div className="all-course-allcourses__container">
    <h3 className="all-course-section__title text-warning">Search Results for "{searchstring}"</h3>
    
    {loading ? (
      <p>Loading...</p>
    ) : courseData.length > 0 ? (
      <div className="all-course-courses__grid">
        {courseData.map((course) => (
          <div className="all-course-course__card" key={course.id}>
            <Link to={`/detail/${course.id}`}>
              <img src={course.featured_img || "/placeholder.svg"} className="all-course-course__img" alt={course.title} />
            </Link>
            <div className="all-course-course__info">
              <h5 className="all-course-course__title">
                <Link to={`/detail/${course.id}`}>{course.title}</Link>
              </h5>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p>No courses found matching "{searchstring}"</p>
    )}

    {/* Only show pagination if there are results */}
    {courseData.length > 0 && (
      <nav className="all-course-pagination__container">
        <ul className="all-course-pagination">
          <li className="all-course-page__item">
            <Link className="all-course-page__link" to="#">
              Previous
            </Link>
          </li>
          <li className="all-course-page__item">
            <Link className="all-course-page__link" to="#">
              1
            </Link>
          </li>
          <li className="all-course-page__item">
            <Link className="all-course-page__link" to="#">
              Next
            </Link>
          </li>
        </ul>
      </nav>
    )}
  </div>
);
}

export default Search;