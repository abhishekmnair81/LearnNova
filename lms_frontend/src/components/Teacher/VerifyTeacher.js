import { Link, useParams,useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../TeacherLogin.css";
import { FaKey } from 'react-icons/fa';
const baseUrl = 'http://127.0.0.1:8000/api';

function VerifyTeacher() {
    const navigate =useNavigate();
    const [teacherData, setteacherData] = useState({
        otp_digit:'',
        });
    const [errorMsg,seterrorMsg] = useState('');
    const {teacher_id}=useParams()
    const handleChange = (event) => {
        setteacherData({
            ...teacherData,
            [event.target.name]: event.target.value
        });
    }

const submitForm = () => {
    const teacherFormData = new FormData();
    teacherFormData.append('otp_digit', teacherData.otp_digit);

    try {
        axios.post(baseUrl + '/verify-teacher/'+teacher_id+'/', teacherFormData)
        .then((res) => {
            if(res.data.bool === true){
                localStorage.setItem('teacherLoginStatus', true);
                localStorage.setItem('teacherId',res.data.teacher_id);
                navigate('/teacher-dashboard');
            }else{
                seterrorMsg(res.data.msg);
            }
        });
    }catch(error) {
        console.log(error);
    }
}

    
    const teacherLoginStatus = localStorage.getItem('teacherLoginStatus');
    if(teacherLoginStatus === 'true'){
        window.location.href = '/teacher-dashboard';        
    }

    useEffect(() => {
        document.title = "Verify Teacher";
    }, []);


    return (
        <div className="teacher-login-container">
            <div className="teacher-login-card">
                <FaKey className="otp-main-icon" color="#4a6baf" size={32} />
                <h5>OTP Verification</h5>
                <p className="text-success">We've sent a 6-digit code to your device</p>
                {errorMsg && <p className="error-message">{errorMsg}</p>}
                <form>
                    <div className="mb-3 text-start">
                        <label htmlFor="otp_digit" className="form-label text-light"> OTP </label>
                        <input type="number" value={teacherData.otp_digit} 
                        name='otp_digit' onChange={handleChange} 
                        className="form-control" id="otp_digit"
                         />
                    </div>
                    <button type="button" onClick={submitForm} className="teacher-login-btn">
                        Verify
                    </button>
                </form>
            </div>
        </div>
    );
}

export default VerifyTeacher;
