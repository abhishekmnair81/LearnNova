import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../TeacherRegister.css";
import axios from "axios";
const baseUrl = 'http://127.0.0.1:8000/api/teacher/';

function TeacherRegister() {
    const navigate = useNavigate();
    const [teacherData, setteacherData] = useState({
        'full_name': '',
        'email': '',
        'mobile_no': '',
        'password': '',
        'qualification': '',
        'skills': '',
        'status': '',
        'otp_digit': '',
    });

    const handleChange = (event) => {
        setteacherData({
            ...teacherData,
            [event.target.name]: event.target.value
        });
    }
    
    const submitForm = () => {
        const otp_digit = Math.floor(100000 + Math.random() * 900000);
        const teacherFormData = new FormData();
        teacherFormData.append("full_name", teacherData.full_name);
        teacherFormData.append("email", teacherData.email);
        teacherFormData.append("password", teacherData.password);
        teacherFormData.append("qualification", teacherData.qualification);
        teacherFormData.append("mobile_no", teacherData.mobile_no);
        teacherFormData.append("skills", teacherData.skills);
        teacherFormData.append("otp_digit", otp_digit);
    
        axios
            .post(baseUrl, teacherFormData)
            .then((response) => {
                navigate('/verify-teacher/' + response.data.id);
                window.location.href = '/verify-teacher/' + response.data.id;
            })
            .catch((error) => {
                console.error('Error during registration:', error);
                setteacherData({
                    ...teacherData,
                    status: 'error',
                });
            });
    };

    return (
        <div className="register-register-wrapper">
            <div className="register-register-container">
                <div className="register-register-card">
                    <div className="register-register-header">
                        <h1 className="register-register-title">Sign up and start teaching</h1>
                        <p className="register-register-subtitle">Create your instructor account</p>
                    </div>

                    {teacherData.status === 'success' && (
                        <div className="register-success-alert">Thanks for your Registration</div>
                    )}
                    {teacherData.status === 'error' && (
                        <div className="register-error-alert">Something went wrong. Please try again.</div>
                    )}

                    <form className="register-register-form">
                        <div className="register-form-group">
                            <label htmlFor="full_name" className="register-label">Full Name</label>
                            <input
                                id="full_name"
                                name="full_name"
                                type="text"
                                value={teacherData.full_name}
                                onChange={handleChange}
                                className="register-input"
                                placeholder="John Doe"
                                autoComplete="name"
                            />
                        </div>

                        <div className="register-form-group">
                            <label htmlFor="email" className="register-label">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={teacherData.email}
                                onChange={handleChange}
                                className="register-input"
                                placeholder="you@example.com"
                                autoComplete="email"
                            />
                        </div>

                        <div className="register-form-group">
                            <label htmlFor="password" className="register-label">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={teacherData.password}
                                onChange={handleChange}
                                className="register-input"
                                placeholder="Create a strong password"
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="register-form-group">
                            <label htmlFor="qualification" className="register-label">Qualification</label>
                            <input
                                id="qualification"
                                name="qualification"
                                type="text"
                                value={teacherData.qualification}
                                onChange={handleChange}
                                className="register-input"
                                placeholder="e.g., M.Tech in Computer Science"
                            />
                        </div>

                        <div className="register-form-group">
                            <label htmlFor="mobile_no" className="register-label">Mobile Number</label>
                            <input
                                id="mobile_no"
                                name="mobile_no"
                                type="tel"
                                value={teacherData.mobile_no}
                                onChange={handleChange}
                                className="register-input"
                                placeholder="+91 9876543210"
                                autoComplete="tel"
                            />
                        </div>

                        <div className="register-form-group">
                            <label htmlFor="skills" className="register-label">Skills (comma-separated)</label>
                            <textarea
                                id="skills"
                                name="skills"
                                value={teacherData.skills}
                                onChange={handleChange}
                                className="register-textarea"
                                rows="3"
                                placeholder="Python, React, Machine Learning, Django..."
                            />
                        </div>

                        <button type="button" onClick={submitForm} className="register-submit-btn">
                            Create Account
                        </button>
                    </form>

                    <p className="register-terms">
                        By signing up, you agree to our <Link to="/terms" className="register-link">Terms of Use</Link> and <Link to="/privacy" className="register-link">Privacy Policy</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TeacherRegister;