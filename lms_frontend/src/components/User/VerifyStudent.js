import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../TeacherLogin.css";
import { FaKey } from 'react-icons/fa';

const baseUrl = 'http://127.0.0.1:8000/api';

function VerifyStudent() {
    const navigate = useNavigate();
    const { student_id } = useParams();
    const [otp, setOtp] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Handle OTP input change
    const handleChange = (event) => {
        setOtp(event.target.value);
    };

    // Submit OTP for verification
    const submitForm = async (event) => {
        event.preventDefault();
        
        if (!otp || otp.length !== 6) {
            setErrorMsg("Please enter a valid 6-digit OTP");
            return;
        }
    
        try {
            const response = await axios.post(
                `${baseUrl}/verify-student/${student_id}/`, 
                { otp_digit: otp },
                { headers: { "Content-Type": "application/json" } }
            );
            
            if (response.data.bool) {
                localStorage.setItem('studentLoginStatus', 'true');
                localStorage.setItem('studentId', response.data.student_id);
                window.location.href = '/user-dashboard';
            } else {
                setErrorMsg(response.data.msg || "Invalid OTP. Please try again.");
            }
        } catch (error) {
            setErrorMsg("Verification failed. Please try again.");
            console.error("OTP verification error:", error);
        }
    };
    
    // Redirect if already logged in
    useEffect(() => {
        if (localStorage.getItem('studentLoginStatus') === 'true') {
            navigate('/user-dashboard');
        }
        document.title = "Verify Student";
    }, [navigate]);

    return (
        <div className="teacher-login-container">
            <div className="teacher-login-card">
                <FaKey className="otp-main-icon" color="#4a6baf" size={32} />
                <h5>OTP Verification</h5>
                <p className="text-success">We've sent a 6-digit code to your email</p>
                {errorMsg && <p className="error-message">{errorMsg}</p>}
                
                <form onSubmit={submitForm}>
                    <div className="mb-3 text-start">
                        <label htmlFor="otp_digit" className="form-label text-light">OTP</label>
                        <input 
                            type="number"
                            name="otp_digit"
                            value={otp}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <button type="submit" className="teacher-login-btn">Verify</button>
                </form>
            </div>
        </div>
    );
}

export default VerifyStudent;
