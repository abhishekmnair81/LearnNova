import { Link } from "react-router-dom";
import "../../TeacherSidebar.css"; 
import { FaChalkboardTeacher } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect } from "react";

const baseUrl = 'http://127.0.0.1:8000/api';

function Sidebar() {
    return (
        <div className="sidebar-sidebar__container">
            <div className="sidebar-sidebar__list">
                <Link to="/user-dashboard" className="sidebar-sidebar__item sidebar-sidebar__item--active">
                    <i className="bi bi-speedometer2"></i> Dashboard
                </Link>
                <Link to="/my-courses" className="sidebar-sidebar__item">
                    <i className="bi bi-book"></i> My Courses
                </Link>
                <Link to="/my-teachers" className="sidebar-sidebar__item">
                    <FaChalkboardTeacher className="sidebar-sidebar__icon" /> My Teachers
                </Link>
                <Link to="/favorite-courses" className="sidebar-sidebar__item">
                    <i className="bi bi-journal-bookmark-fill"></i> Favorite Courses
                </Link>
                <Link to="/recommended-courses" className="sidebar-sidebar__item">
                    <i className="bi bi-hand-thumbs-up-fill"></i> Recommended Course
                </Link>
                <Link to="/my-assignments" className="sidebar-sidebar__item">
                    <i className="bi bi-journal"></i> Assignments
                </Link>
                <Link to="/profile-setting" className="sidebar-sidebar__item">
                    <i className="bi bi-person-square"></i> Profile Setting
                </Link>
                <Link to="/change-password" className="sidebar-sidebar__item">
                    <i className="bi bi-key"></i> Change Password
                </Link>
                <Link to="/user-login" className="sidebar-sidebar__item sidebar-sidebar__item--logout">
                    <i className="bi bi-box-arrow-right"></i> Logout
                </Link>
            </div>
        </div>
    );
}

export default Sidebar;