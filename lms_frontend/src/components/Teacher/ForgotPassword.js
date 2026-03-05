import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../TeacherLogin.css";

const baseUrl = 'http://127.0.0.1:8000/api';

function ForgotPassword() {
    const navigate = useNavigate();
    const [teacherData, setteacherData] = useState({
        email: '',
    });
    const [successMsg, setsuccessMsg] = useState('');
    const [errorMsg, seterrorMsg] = useState('');
    const handleChange = (event) => {
        setteacherData({
            ...teacherData,
            [event.target.name]: event.target.value
        });
    }

    const csrfToken = document.getElementById('csrf_token')?.value;

    const submitForm = () => {
        const teacherFormData = new FormData();
        teacherFormData.append('email', teacherData.email);

        try {
            axios.post(baseUrl + '/teacher-forgot-password/', teacherFormData)
                .then((res) => {
                    if (res.data.bool === true) {
                        setsuccessMsg(res.data.msg);
                    } else {
                        seterrorMsg(res.data.msg);
                    }
                });
        } catch (error) {
            console.log(error);
        }
    }

    const teacherLoginStatus = localStorage.getItem('teacherLoginStatus');
    if (teacherLoginStatus === 'true') {
        window.location.href = '/teacher-dashboard';
    }

    useEffect(() => {
        document.title = "Teacher Forgot Password";
    }, []);

    return (
        <div className="teacher-login-wrapper">
            <div className="teacher-login-container">
                <div className="teacher-login-card">
                    <div className="teacher-login-header">
                        <h2 className="teacher-login-title">Forgot Your Password?</h2>
                    </div>

                    {successMsg && <div className="teacher-success-alert">{successMsg}</div>}
                    {errorMsg && <div className="teacher-error-alert">{errorMsg}</div>}

                    <form className="teacher-login-form">
                        <div className="teacher-form-group">
                            <label htmlFor="email" className="teacher-label">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={teacherData.email}
                                onChange={handleChange}
                                className="teacher-input"
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <button type="button" onClick={submitForm} className="teacher-submit-btn">
                            Send Reset Link
                        </button>

                        <div className="teacher-forgot-link">
                            <Link to="/teacher-login" className="teacher-link">Back to Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;