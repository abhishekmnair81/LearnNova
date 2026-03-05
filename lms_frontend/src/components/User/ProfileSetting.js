import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../TeacherProfileSetting.css"; // Using same CSS as teacher

const baseUrl = "http://127.0.0.1:8000/api";

function ProfileSetting() {
    const [studentData, setstudentData] = useState({
        full_name: '',
        email: '',
        username: '',
        interested_categories: '',
        profile_img: '',
        new_profile_img: null,
        login_via_otp: '',
    });

    const studentId = localStorage.getItem("studentId");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${baseUrl}/student/${studentId}/`)
            .then((res) => {
                setstudentData({
                    full_name: res.data.full_name || "",
                    email: res.data.email || "",
                    username: res.data.username || "",
                    interested_categories: res.data.interested_categories || "",
                    profile_img: res.data.profile_img || "",
                    new_profile_img: null,
                    login_via_otp: res.data.login_via_otp || "",
                });
            })
            .catch((error) => console.error("Error fetching student data:", error));
    }, [studentId]);

    const handleChange = (event) => {
        setstudentData({
            ...studentData,
            [event.target.name]: event.target.value
        });
    };

    const handleFileChange = (e) => {
        setstudentData({
            ...studentData,
            new_profile_img: e.target.files[0],
        });
    };

    const submitForm = async (event) => {
        event.preventDefault();

        const studentFormData = new FormData();
        studentFormData.append("full_name", studentData.full_name);
        studentFormData.append("email", studentData.email);
        studentFormData.append("username", studentData.username);
        studentFormData.append("interested_categories", studentData.interested_categories);
        studentFormData.append("login_via_otp", studentData.login_via_otp);
        if (studentData.new_profile_img) {
            studentFormData.append("profile_img", studentData.new_profile_img);
        }

        try {
            await axios.put(`${baseUrl}/student/${studentId}/`, studentFormData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            Swal.fire({
                title: "Success!",
                text: "Profile updated successfully.",
                icon: "success",
                confirmButtonColor: "#a435f0",
            });
            navigate(0);
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message || "Failed to update profile.",
                icon: "error",
                confirmButtonColor: "#ef4444",
            });
        }
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const studentLoginStatus = localStorage.getItem("studentLoginStatus");
    if (studentLoginStatus !== 'true') {
        window.location.href = '/user-login';
    }

    return (
        <div className="profile-settings-container">
            <div className="profile-settings-layout">
                <aside className="profile-settings-sidebar">
                    <Sidebar />
                </aside>
                <main className="profile-settings-main">
                    <div className="profile-settings-header">
                        <h1 className="profile-settings-title">Profile Settings</h1>
                        <p className="profile-settings-subtitle">
                            Manage your account information and preferences
                        </p>
                    </div>

                    <div className="profile-settings-card">
                        <div className="profile-settings-card-header">
                            <h2 className="profile-settings-card-title">Personal Information</h2>
                        </div>

                        <form onSubmit={submitForm}>
                            <div className="profile-settings-card-body">
                                {/* Profile Picture */}
                                <div className="profile-form-section">
                                    <div className="profile-form-group">
                                        <label htmlFor="profile_img" className="profile-form-label">
                                            Profile Picture
                                        </label>
                                        <div className="profile-image-upload-wrapper">
                                            <div className="profile-image-preview-container">
                                                {studentData.profile_img ? (
                                                    <img
                                                        src={studentData.profile_img}
                                                        alt="Profile"
                                                        className="profile-image-preview"
                                                    />
                                                ) : (
                                                    <div className="profile-image-placeholder">
                                                        {studentData.full_name ? getInitials(studentData.full_name) : 'User'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="profile-image-upload-controls">
                                                <input
                                                    id="profile_img"
                                                    type="file"
                                                    name="profile_img"
                                                    className="profile-file-input"
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                />
                                                <label htmlFor="profile_img" className="profile-file-label">
                                                    Choose File
                                                </label>
                                                <span className="profile-file-hint">
                                                    Recommended: Square image, at least 200x200px (JPG or PNG)
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Full Name */}
                                    <div className="profile-form-group">
                                        <label htmlFor="full_name" className="profile-form-label profile-form-label-required">
                                            Full Name
                                        </label>
                                        <input
                                            id="full_name"
                                            type="text"
                                            value={studentData.full_name}
                                            onChange={handleChange}
                                            name="full_name"
                                            className="profile-form-input"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="profile-form-group">
                                        <label htmlFor="email" className="profile-form-label profile-form-label-required">
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={studentData.email}
                                            onChange={handleChange}
                                            name="email"
                                            className="profile-form-input"
                                            placeholder="your.email@example.com"
                                            required
                                        />
                                    </div>

                                    {/* Username */}
                                    <div className="profile-form-group">
                                        <label htmlFor="username" className="profile-form-label profile-form-label-required">
                                            Username
                                        </label>
                                        <input
                                            id="username"
                                            type="text"
                                            value={studentData.username}
                                            onChange={handleChange}
                                            name="username"
                                            className="profile-form-input"
                                            placeholder="your_username"
                                            required
                                        />
                                    </div>

                                    {/* Interested Categories */}
                                    <div className="profile-form-group">
                                        <label htmlFor="interested_categories" className="profile-form-label profile-form-label-required">
                                            Interested Categories
                                        </label>
                                        <textarea
                                            id="interested_categories"
                                            className="profile-form-textarea"
                                            value={studentData.interested_categories}
                                            onChange={handleChange}
                                            name="interested_categories"
                                            placeholder="e.g., Python, Web Development, Data Science..."
                                            required
                                        ></textarea>
                                        <span className="profile-helper-text">
                                            List topics you're interested in (comma-separated)
                                        </span>
                                    </div>

                                    {/* Login Via OTP */}
                                    <div className="profile-form-group">
                                        <label htmlFor="login_via_otp" className="profile-form-label">
                                            Login Via OTP
                                        </label>
                                        <input
                                            id="login_via_otp"
                                            type="text"
                                            value={studentData.login_via_otp}
                                            onChange={handleChange}
                                            name="login_via_otp"
                                            className="profile-form-input"
                                            placeholder="Enter OTP preference"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="profile-form-actions">
                                <button type="submit" className="btn-profile-save">
                                    Update Profile
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ProfileSetting;