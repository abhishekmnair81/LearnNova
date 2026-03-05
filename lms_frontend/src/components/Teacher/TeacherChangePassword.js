import { useState } from "react";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import Swal from "sweetalert2";
import "../../TeacherChangePassword.css";

const baseUrl = "http://127.0.0.1:8000/api";

function TeacherChangePassword() {
    const [teacherData, setTeacherData] = useState({ password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const teacherId = localStorage.getItem("teacherId");

    const handleChange = (event) => {
        setTeacherData({
            ...teacherData,
            [event.target.name]: event.target.value
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const getPasswordStrength = (password) => {
        if (!password) return null;
        if (password.length < 6) return 'weak';
        if (password.length < 10) return 'medium';
        return 'strong';
    };

    const passwordStrength = getPasswordStrength(teacherData.password);

    const submitForm = async (event) => {
        event.preventDefault();

        const teacherFormData = new FormData();
        teacherFormData.append("password", teacherData.password);

        try {
            await axios.post(`${baseUrl}/teacher/change-password/${teacherId}/`, teacherFormData);

            Swal.fire({
                title: "Success!",
                text: "Password updated successfully. You will be logged out.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
                confirmButtonColor: "#a435f0",
            }).then(() => {
                localStorage.removeItem("teacherId");
                window.location.href = "/teacher-logout";
            });

        } catch (error) {
            console.error("Error updating password:", error.response ? error.response.data : error);

            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message || "Failed to update password. Please check your input.",
                icon: "error",
                confirmButtonColor: "#ef4444",
            });
        }
    };

    return (
        <div className="password-change-container">
            <div className="password-change-layout">
                <aside className="password-change-sidebar">
                    <TeacherSidebar />
                </aside>
                <main className="password-change-main">
                    <div className="password-change-header">
                        <h1 className="password-change-title">Change Password</h1>
                        <p className="password-change-subtitle">
                            Update your password to keep your account secure
                        </p>
                    </div>

                    <div className="password-change-card">
                        <div className="password-change-card-header">
                            <h2 className="password-change-card-title">Security Settings</h2>
                        </div>

                        <div className="password-change-card-body">
                            <div className="password-info-alert">
                                <div className="password-info-icon">ℹ️</div>
                                <div className="password-info-content">
                                    <p className="password-info-title">Important Notice</p>
                                    <p className="password-info-text">
                                        After changing your password, you will be logged out and need to log in again with your new password.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={submitForm}>
                                <div className="password-form-group">
                                    <label htmlFor="inputPassword" className="password-form-label password-form-label-required">
                                        New Password
                                    </label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={teacherData.password}
                                            name="password"
                                            className="password-form-input"
                                            id="inputPassword"
                                            onChange={handleChange}
                                            placeholder="Enter your new password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={togglePasswordVisibility}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} password-toggle-icon`}></i>
                                        </button>
                                    </div>
                                    
                                    {teacherData.password && (
                                        <div className="password-strength-indicator">
                                            <span className="password-strength-label">Password Strength:</span>
                                            <div className="password-strength-bar">
                                                <div className={`password-strength-fill ${passwordStrength}`}></div>
                                            </div>
                                            <span className={`password-strength-text ${passwordStrength}`}>
                                                {passwordStrength === 'weak' && 'Weak - Add more characters'}
                                                {passwordStrength === 'medium' && 'Medium - Consider adding more characters'}
                                                {passwordStrength === 'strong' && 'Strong password!'}
                                            </span>
                                        </div>
                                    )}

                                    <div className="password-requirements">
                                        <p className="password-requirements-title">Password Requirements:</p>
                                        <ul className="password-requirements-list">
                                            <li className={`password-requirement-item ${teacherData.password.length >= 8 ? 'valid' : ''}`}>
                                                <span className="password-requirement-icon">
                                                    {teacherData.password.length >= 8 ? '✓' : '○'}
                                                </span>
                                                At least 8 characters
                                            </li>
                                            <li className={`password-requirement-item ${/[A-Z]/.test(teacherData.password) ? 'valid' : ''}`}>
                                                <span className="password-requirement-icon">
                                                    {/[A-Z]/.test(teacherData.password) ? '✓' : '○'}
                                                </span>
                                                One uppercase letter
                                            </li>
                                            <li className={`password-requirement-item ${/[a-z]/.test(teacherData.password) ? 'valid' : ''}`}>
                                                <span className="password-requirement-icon">
                                                    {/[a-z]/.test(teacherData.password) ? '✓' : '○'}
                                                </span>
                                                One lowercase letter
                                            </li>
                                            <li className={`password-requirement-item ${/[0-9]/.test(teacherData.password) ? 'valid' : ''}`}>
                                                <span className="password-requirement-icon">
                                                    {/[0-9]/.test(teacherData.password) ? '✓' : '○'}
                                                </span>
                                                One number
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="password-form-actions">
                                    <button type="submit" className="btn-password-update">
                                        Update Password
                                    </button>
                                </div>
                            </form>

                            <div className="password-security-tips">
                                <h3 className="password-security-title">
                                    🔒 Security Tips
                                </h3>
                                <ul className="password-security-list">
                                    <li className="password-security-item">
                                        <span className="password-security-icon">✓</span>
                                        Use a unique password that you don't use for other accounts
                                    </li>
                                    <li className="password-security-item">
                                        <span className="password-security-icon">✓</span>
                                        Avoid using personal information like names or birthdays
                                    </li>
                                    <li className="password-security-item">
                                        <span className="password-security-icon">✓</span>
                                        Consider using a password manager for better security
                                    </li>
                                    <li className="password-security-item">
                                        <span className="password-security-icon">✓</span>
                                        Change your password regularly to maintain security
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default TeacherChangePassword;