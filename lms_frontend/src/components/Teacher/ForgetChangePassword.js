import { Link,useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../TeacherLogin.css";
import { FaQuestionCircle } from "react-icons/fa";
const baseUrl = 'http://127.0.0.1:8000/api';

function ChangePassword() {
    const {teacher_id} =useParams();
    const navigate = useNavigate();
    const [teacherData, setteacherData] = useState({
        password:'',
    });
    const [successMsg,setsuccessMsg] = useState('');
    const [errorMsg,seterrorMsg] = useState('');
    const handleChange = (event) => {
        setteacherData({
            ...teacherData,
            [event.target.name]: event.target.value
        });
    }

    const csrfToken = document.getElementById('csrf_token')?.value;

    const submitForm = () => {
        const teacherFormData = new FormData();
        teacherFormData.append('password', teacherData.password);
    
        try {
            axios.post(baseUrl + '/teacher-change-password/'+teacher_id+'/', teacherFormData)
            .then((res) => {
                if (res.data.bool === true){
                    setsuccessMsg(res.data.msg);
                }else{
                    seterrorMsg(res.data.msg);
                }
            });
        } catch(error) {
            console.log(error);
        }
    }

    
    const teacherLoginStatus = localStorage.getItem('teacherLoginStatus');
    if(teacherLoginStatus === 'true'){
        window.location.href = '/teacher-dashboard';        
    }

    useEffect(() => {
        document.title = "Teacher Change Password";
    }, []);

    return (
        <div className="teacher-login-container">
            <div className="teacher-login-card">
            
                <h5>Enter Your New Password</h5>
                {successMsg && <p className="text-success">{successMsg}</p>}
                {errorMsg && <p className="error-message">{errorMsg}</p>}
                <form>
                    <div className="mb-3 text-start">
                        <label htmlFor="email" className="form-label text-light"> Password </label>
                        <input type="password" value={teacherData.password} 
                        name='password' onChange={handleChange} 
                        className="form-control" id="password"
                         placeholder="Enter your New Password" />
                    </div>

                    <button type="button" onClick={submitForm} className="teacher-login-btn">
                        Change
                    </button>&nbsp;
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
