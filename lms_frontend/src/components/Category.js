import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import '../Category.css';

const baseUrl = 'http://127.0.0.1:8000/api';

export default function Category() {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    axios.get(`${baseUrl}/category/`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setCategoryData(res.data);
        } else if (res.data && Array.isArray(res.data.results)) {
          setCategoryData(res.data.results);
        } else {
          setCategoryData([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories. Please try again later.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="category-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p className="loading-text">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!categoryData || categoryData.length === 0) {
    return (
      <div className="category-container">
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3>No Categories Available</h3>
          <p>Categories will appear here once they are added.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="category-container">
      <h3 className="category-header">All Categories</h3>
      
      <div className="filter-section">
        <div className="filter-results">
          {categoryData.length} {categoryData.length === 1 ? 'category' : 'categories'} available
        </div>
      </div>

      <div className="category-grid">
        {categoryData.map((category) => (
          <div className="category-card" key={category.id}>
            <div className="category-card-body">
              <h5 className="category-card-title">
                <Link to={`/course/${category.id}`}>
                  {category.title}
                  {category.total_courses !== undefined && (
                    <span className="category-badge">
                      {category.total_courses} {category.total_courses === 1 ? 'course' : 'courses'}
                    </span>
                  )}
                </Link>
              </h5>
              {category.description && (
                <p className="category-card-description">{category.description}</p>
              )}
            </div>
            <div className="category-card-footer">
              <Link to={`/course/${category.id}`} className="btn-primary">
                View Courses
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}