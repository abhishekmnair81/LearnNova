import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../TeacherLogin.css"; // Updated CSS below
import TeacherLoginIcon from './TeacherLoginIcon';
const baseUrl = 'http://127.0.0.1:8000/api';

function TeacherLogin() {
    const navigate = useNavigate();
    const [teacherLoginData, setteacherLoginData] = useState({
        email: '',
        password: '',
    });
    const [errorMsg, seterrorMsg] = useState('');
    const handleChange = (event) => {
        setteacherLoginData({
            ...teacherLoginData,
            [event.target.name]: event.target.value
        });
    }

    const csrfToken = document.getElementById('csrf_token')?.value;

    const submitForm = () => {
        const teacherFormData = new FormData();
        teacherFormData.append('email', teacherLoginData.email);
        teacherFormData.append('password', teacherLoginData.password);

        try {
            axios.post(baseUrl + '/teacher-login/', teacherFormData)
                .then((res) => {
                    if (res.data.bool === true) {
                        navigate('/verify-teacher/' + res.data.teacher_id);
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
        document.title = "Teacher Login";
    }, []);

    return (
        <div className="teacher-login-wrapper">
            <div className="teacher-login-container">
                <div className="teacher-login-card">
                    <div className="teacher-login-header">
                        <TeacherLoginIcon size={48} color="#5624d0" />
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
                                value={teacherLoginData.email}
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
                                value={teacherLoginData.password}
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
                            <Link to="/teacher-forgot-password" className="teacher-link">Forgot password?</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TeacherLogin;