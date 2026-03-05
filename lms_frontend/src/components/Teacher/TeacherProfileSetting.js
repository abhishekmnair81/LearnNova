import { useState, useEffect } from "react";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../TeacherProfileSetting.css";

const baseUrl = "http://127.0.0.1:8000/api";

function TeacherProfileSetting() {
    const [teacherData, setTeacherData] = useState({
        full_name: '',
        email: '',
        qualification: '',
        mobile_no: '',
        skills: '',
        profile_img: '',
        new_profile_img: null,
        facebook_url: '',
        twitter_url: '',
        instagram_url: '',
        website_url: '',
        login_via_otp: '',
    });

    const teacherId = localStorage.getItem("teacherId");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${baseUrl}/teacher/${teacherId}/`)
            .then((res) => {
                setTeacherData({
                    full_name: res.data.full_name || "",
                    email: res.data.email || "",
                    qualification: res.data.qualification || "",
                    skills: res.data.skills || "",
                    mobile_no: res.data.mobile_no || "",
                    profile_img: res.data.profile_img || "",
                    new_profile_img: null,
                    facebook_url: res.data.facebook_url || "",
                    twitter_url: res.data.twitter_url || "",
                    instagram_url: res.data.instagram_url || "",
                    website_url: res.data.website_url || "",
                    login_via_otp: res.data.login_via_otp || "",
                });
            })
            .catch((error) => console.error("Error fetching teacher data:", error));
    }, [teacherId]);

    const handleChange = (event) => {
        setTeacherData({
            ...teacherData,
            [event.target.name]: event.target.value
        });
    };

    const handleFileChange = (e) => {
        setTeacherData({
            ...teacherData,
            new_profile_img: e.target.files[0],
        });
    };

    const submitForm = async (event) => {
        event.preventDefault();

        const teacherFormData = new FormData();
        teacherFormData.append("full_name", teacherData.full_name);
        teacherFormData.append("email", teacherData.email);
        teacherFormData.append("mobile_no", teacherData.mobile_no);
        teacherFormData.append("qualification", teacherData.qualification);
        teacherFormData.append("skills", teacherData.skills);
        teacherFormData.append("facebook_url", teacherData.facebook_url);
        teacherFormData.append("twitter_url", teacherData.twitter_url);
        teacherFormData.append("instagram_url", teacherData.instagram_url);
        teacherFormData.append("website_url", teacherData.website_url);
        teacherFormData.append("login_via_otp", teacherData.login_via_otp);

        if (teacherData.new_profile_img) {
            teacherFormData.append("profile_img", teacherData.new_profile_img);
        }

        try {
            await axios.put(`${baseUrl}/teacher/${teacherId}/`, teacherFormData, {
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

    return (
        <div className="profile-settings-container">
            <div className="profile-settings-layout">
                <aside className="profile-settings-sidebar">
                    <TeacherSidebar />
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
                                {/* Basic Information Section */}
                                <div className="profile-form-section">
                                    <div className="profile-form-group">
                                        <label htmlFor="profile_img" className="profile-form-label">
                                            Profile Picture
                                        </label>
                                        <div className="profile-image-upload-wrapper">
                                            <div className="profile-image-preview-container">
                                                {teacherData.profile_img ? (
                                                    <img
                                                        src={teacherData.profile_img}
                                                        alt="Profile"
                                                        className="profile-image-preview"
                                                    />
                                                ) : (
                                                    <div className="profile-image-placeholder">
                                                        {teacherData.full_name ? getInitials(teacherData.full_name) : '👤'}
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
                                                    📁 Choose File
                                                </label>
                                                <span className="profile-file-hint">
                                                    Recommended: Square image, at least 200x200px (JPG or PNG)
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="profile-form-group">
                                        <label htmlFor="full_name" className="profile-form-label profile-form-label-required">
                                            Full Name
                                        </label>
                                        <input
                                            id="full_name"
                                            type="text"
                                            value={teacherData.full_name}
                                            onChange={handleChange}
                                            name="full_name"
                                            className="profile-form-input"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>

                                    <div className="profile-form-group">
                                        <label htmlFor="email" className="profile-form-label profile-form-label-required">
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={teacherData.email}
                                            onChange={handleChange}
                                            name="email"
                                            className="profile-form-input"
                                            placeholder="your.email@example.com"
                                            required
                                        />
                                    </div>

                                    <div className="profile-form-group">
                                        <label htmlFor="mobile_no" className="profile-form-label">
                                            Mobile Number
                                        </label>
                                        <input
                                            id="mobile_no"
                                            type="text"
                                            value={teacherData.mobile_no}
                                            onChange={handleChange}
                                            name="mobile_no"
                                            className="profile-form-input"
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>

                                    <div className="profile-form-group">
                                        <label htmlFor="qualification" className="profile-form-label profile-form-label-required">
                                            Qualification
                                        </label>
                                        <textarea
                                            id="qualification"
                                            className="profile-form-textarea"
                                            value={teacherData.qualification}
                                            onChange={handleChange}
                                            name="qualification"
                                            placeholder="e.g., Ph.D. in Computer Science, Master's in Education..."
                                            required
                                        ></textarea>
                                        <span className="profile-helper-text">
                                            List your academic qualifications and certifications
                                        </span>
                                    </div>

                                    <div className="profile-form-group">
                                        <label htmlFor="skills" className="profile-form-label profile-form-label-required">
                                            Skills & Expertise
                                        </label>
                                        <textarea
                                            id="skills"
                                            className="profile-form-textarea"
                                            value={teacherData.skills}
                                            onChange={handleChange}
                                            name="skills"
                                            placeholder="e.g., Python, Web Development, Data Science, Machine Learning..."
                                            required
                                        ></textarea>
                                        <span className="profile-helper-text">
                                            Highlight your teaching specialties and technical skills
                                        </span>
                                    </div>

                                    <div className="profile-form-group">
                                        <label htmlFor="login_via_otp" className="profile-form-label">
                                            Login Via OTP
                                        </label>
                                        <input
                                            id="login_via_otp"
                                            type="text"
                                            value={teacherData.login_via_otp}
                                            onChange={handleChange}
                                            name="login_via_otp"
                                            className="profile-form-input"
                                            placeholder="Enter OTP preference"
                                        />
                                    </div>
                                </div>

                                <hr className="profile-section-divider" />

                                {/* Social Links Section */}
                                <div className="profile-form-section">
                                    <h3 className="profile-section-title">Social Media Links</h3>
                                    <div className="profile-social-grid">
                                        <div className="profile-social-item">
                                            <label htmlFor="facebook_url" className="profile-form-label">
                                                Facebook URL
                                            </label>
                                            <input
                                                id="facebook_url"
                                                type="url"
                                                value={teacherData.facebook_url}
                                                onChange={handleChange}
                                                name="facebook_url"
                                                className="profile-form-input"
                                                placeholder="https://facebook.com/yourprofile"
                                            />
                                        </div>

                                        <div className="profile-social-item">
                                            <label htmlFor="twitter_url" className="profile-form-label">
                                                Twitter URL
                                            </label>
                                            <input
                                                id="twitter_url"
                                                type="url"
                                                value={teacherData.twitter_url}
                                                onChange={handleChange}
                                                name="twitter_url"
                                                className="profile-form-input"
                                                placeholder="https://twitter.com/yourhandle"
                                            />
                                        </div>

                                        <div className="profile-social-item">
                                            <label htmlFor="instagram_url" className="profile-form-label">
                                                Instagram URL
                                            </label>
                                            <input
                                                id="instagram_url"
                                                type="url"
                                                value={teacherData.instagram_url}
                                                onChange={handleChange}
                                                name="instagram_url"
                                                className="profile-form-input"
                                                placeholder="https://instagram.com/yourprofile"
                                            />
                                        </div>

                                        <div className="profile-social-item">
                                            <label htmlFor="website_url" className="profile-form-label">
                                                Website URL
                                            </label>
                                            <input
                                                id="website_url"
                                                type="url"
                                                value={teacherData.website_url}
                                                onChange={handleChange}
                                                name="website_url"
                                                className="profile-form-input"
                                                placeholder="https://yourwebsite.com"
                                            />
                                        </div>
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

export default TeacherProfileSetting;