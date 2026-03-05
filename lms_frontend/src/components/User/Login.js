import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../../TeacherLogin.css"; 
import StudentLoginIcon from './StudentLoginIcon';

const baseUrl = "http://127.0.0.1:8000/api";

function StudentLogin() {
    const navigate = useNavigate();
    const [studentLoginData, setStudentLoginData] = useState({
        email: "",
        password: "",
    });
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (event) => {
        setStudentLoginData({
            ...studentLoginData,
            [event.target.name]: event.target.value,
        });
    };

    const submitForm = () => {
        const studentFormData = new FormData();
        studentFormData.append("email", studentLoginData.email);
        studentFormData.append("password", studentLoginData.password);

        axios.post(baseUrl + "/student-login/", studentFormData)
            .then((res) => {
                if (res.data.bool === true) {
                    if (res.data.login_via_otp) {
                        navigate(`/verify-student/${res.data.student_id}`);
                    } else {
                        localStorage.setItem("studentLoginStatus", true);
                        localStorage.setItem("studentId", res.data.student_id);
                        window.location.href = "/user-dashboard";
                    }
                } else {
                    setErrorMsg(res.data.msg);
                }
            })
            .catch((error) => {
                console.log(error);
                setErrorMsg("Login failed. Please try again.");
            });
    };

    return (
        <div className="teacher-login-wrapper">
            <div className="teacher-login-container">
                <div className="teacher-login-card">
                    <div className="teacher-login-header">
                        <StudentLoginIcon size={48} color="#5624d0" />
                        <h2 className="teacher-login-title">Log in to your account</h2>
                    </div>

                    {errorMsg && <div className="teacher-error-alert">{errorMsg}</div>}

                    <form className="teacher-login-form">
                        <div className="teacher-form-group">
                            <label htmlFor="email" className="teacher-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={studentLoginData.email}
                                onChange={handleChange}
                                className="teacher-input"
                                placeholder="you@example.com"
                                autoComplete="email"
                            />
                        </div>

                        <div className="teacher-form-group">
                            <label htmlFor="password" className="teacher-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={studentLoginData.password}
                                onChange={handleChange}
                                className="teacher-input"
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                        </div>

                        <button type="button" onClick={submitForm} className="teacher-submit-btn">
                            Log In
                        </button>

                        <div className="teacher-forgot-link">
                            <Link to="/user-forgot-password" className="teacher-link">Forgot password?</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default StudentLogin;