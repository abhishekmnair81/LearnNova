import { Link } from "react-router-dom";
import "../../TeacherSidebar.css"; 
import { FaPlusCircle, FaQuestionCircle } from "react-icons/fa";

function TeacherSidebar() {
  return (
    <div className="sidebar-sidebar__container">
      <div className="sidebar-sidebar__list">
        <Link to="/teacher-dashboard" className="sidebar-sidebar__item sidebar-sidebar__item--active">
          <i className="bi bi-speedometer2"></i> Dashboard
        </Link>
        <Link to="/teacher-courses" className="sidebar-sidebar__item">
          <i className="bi bi-book"></i> My Courses
        </Link>
        <Link to="/add-course" className="sidebar-sidebar__item">
          <i className="bi bi-plus-circle-fill"></i> Add Course
        </Link>
        <Link to="/my-users" className="sidebar-sidebar__item">
          <i className="bi bi-people"></i> My Users
        </Link>
        <Link to="/quiz" className="sidebar-sidebar__item">
          <FaQuestionCircle className="sidebar-sidebar__icon" /> Quiz
        </Link>
        <Link to="/add-quiz" className="sidebar-sidebar__item">
          <FaPlusCircle className="sidebar-sidebar__icon" /> Add Quiz
        </Link>
        <Link to="/teacher-profile-setting" className="sidebar-sidebar__item">
          <i className="bi bi-person-square"></i> Profile Setting
        </Link>
        <Link to="/teacher-change-password" className="sidebar-sidebar__item">
          <i className="bi bi-key"></i> Change Password
        </Link>
        <Link to="/teacher-logout" className="sidebar-sidebar__item sidebar-sidebar__item--logout">
          <i className="bi bi-box-arrow-right"></i> Logout
        </Link>
      </div>
    </div>
  );
}

export default TeacherSidebar;
