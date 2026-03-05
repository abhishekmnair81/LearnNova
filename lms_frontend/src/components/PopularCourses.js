import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import "../PopularCourses.css"; 

const baseUrl = "http://127.0.0.1:8000/api";

function PopularCourses() {
    const [popularcourseData, setpopularcourseData] = useState([]);
    const [nextUrl, setnextUrl] = useState();
    const [previousUrl, setpreviousUrl] = useState();

    useEffect(() => {
        axios
          .get(baseUrl + "/popular-course/?popular=1")
          .then((res) => {
            setpopularcourseData(res.data);
            setnextUrl(res.data.next)
            setpreviousUrl(res.data.previous)
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);
      const paginationHandler =(url)=>{
        axios
          .get(url)
          .then((res) => {
            setnextUrl(res.data.next)
            setpreviousUrl(res.data.previous)
            setpopularcourseData(res.data.results);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    useEffect(() => {
        document.title = "Popular Courses";
    }, []);

    return (
        <div className="popular-container">
            <h3 className="section-title text-warning">Popular Courses</h3>
            <div className="course-grid">
                {popularcourseData && popularcourseData.map((row, index) => (
                    <div className="course-card" key={index}>
                        <Link to={`/detail/${row.course.id}`}>
                            <img src={row.course.featured_img} className="course-img" alt="Course" />
                        </Link>
                        <div className="course-info">
                            <h5 className="course-title">
                                <Link to={`/detail/${row.course?.id}`}>{row.course?.title}</Link>
                            </h5>
                            <div className="course-footer">
                                <span>⭐ {row.rating}/5</span>
                                <span className="views">👁 {row.course.course_views}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <nav aria-label="Page navigation" className="pagination-container">
                <ul className="pagination">
                    <li className="page-item">
                        {previousUrl &&
                        <button className="page-link bg-warning"  onClick={() =>paginationHandler(previousUrl)}>
                            <i class="bi bi-arrow-left"></i>Previous
                        </button>
                        }
                    </li>
                    <li className="page-item">
                        {nextUrl &&
                        <button className="page-link bg-warning" onClick={() =>paginationHandler(nextUrl)}>
                            Next<i class="bi bi-arrow-right"></i>
                        </button>
                        }
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default PopularCourses;