import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../../TeacherRegister.css";
const baseUrl = 'http://127.0.0.1:8000/api/student/';

function Register() {
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState({
        'full_name': '',
        'email': '',
        'password': '',
        'username': '',
        'interested_categories': '',
        'status': '',
        'otp_digit': '',
    });

    const handleChange = (event) => {
        setStudentData({
            ...studentData,
            [event.target.name]: event.target.value
        });
    }

    const submitForm = (event) => {
        event.preventDefault();

        const otp_digit = Math.floor(100000 + Math.random() * 900000);
        
        const studentDataToSend = {
            full_name: studentData.full_name,
            email: studentData.email,
            password: studentData.password,
            username: studentData.username,
            interested_categories: studentData.interested_categories,
            otp_digit: otp_digit
        };
    
        axios
            .post(baseUrl, studentDataToSend)
            .then((response) => {
                if (response.data.id) {
                    navigate(`/verify-student/${response.data.id}`);
                } else {
                    console.error('No student ID returned.');
                    setStudentData({ ...studentData, status: 'error' });
                }
            })
            .catch((error) => {
                console.error('Error during registration:', error);
                setStudentData({ ...studentData, status: 'error' });
            });
    };
    
    useEffect(() => {
        document.title = 'Student Register';
    }, []);

    return (
        <div className="register-register-wrapper">
            <div className="register-register-container">
                <div className="register-register-card">
                    <div className="register-register-header">
                        <h1 className="register-register-title">Sign up and start learning</h1>
                        <p className="register-register-subtitle">Create your student account</p>
                    </div>

                    {studentData.status === 'success' && (
                        <div className="register-success-alert">Thanks for your Registration</div>
                    )}
                    {studentData.status === 'error' && (
                        <div className="register-error-alert">Something went wrong. Please try again.</div>
                    )}

                    <form className="register-register-form" onSubmit={submitForm}>
                        <div className="register-form-group">
                            <label htmlFor="full_name" className="register-label">Full Name</label>
                            <input
                                id="full_name"
                                name="full_name"
                                type="text"
                                value={studentData.full_name}
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
                                value={studentData.email}
                                onChange={handleChange}
                                className="register-input"
                                placeholder="you@example.com"
                                autoComplete="email"
                            />
                        </div>

                        <div className="register-form-group">
                            <label htmlFor="username" className="register-label">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={studentData.username}
                                onChange={handleChange}
                                className="register-input"
                                placeholder="johndoe123"
                                autoComplete="username"
                            />
                        </div>

                        <div className="register-form-group">
                            <label htmlFor="password" className="register-label">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={studentData.password}
                                onChange={handleChange}
                                className="register-input"
                                placeholder="Create a strong password"
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="register-form-group">
                            <label htmlFor="interested_categories" className="register-label">Interests</label>
                            <textarea
                                id="interested_categories"
                                name="interested_categories"
                                value={studentData.interested_categories}
                                onChange={handleChange}
                                className="register-textarea"
                                rows="3"
                                placeholder="Python, JavaScript, Data Science, Web Development..."
                            />
                        </div>

                        <button type="submit" className="register-submit-btn">
                            Create Account
                        </button>
                    </form>

                    <p className="register-terms">
                        By signing up, you agree to our <a href="/terms" className="register-link">Terms of Use</a> and <a href="/privacy" className="register-link">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;