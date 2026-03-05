import { Link,useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../../TeacherLogin.css";
import { FaQuestionCircle } from "react-icons/fa";
const baseUrl = 'http://127.0.0.1:8000/api';

function UserForgotChangePassword() {
    const {student_id} =useParams();
    const navigate = useNavigate();
    const [studentData, setstudentData] = useState({
        password:'',
    });
    const [successMsg,setsuccessMsg] = useState('');
    const [errorMsg,seterrorMsg] = useState('');
    const handleChange = (event) => {
        setstudentData({
            ...studentData,
            [event.target.name]: event.target.value
        });
    }

    const csrfToken = document.getElementById('csrf_token')?.value;

    const submitForm = () => {
        const studentFormData = new FormData();
        studentFormData.append('password', studentData.password);
    
        try {
            axios.post(baseUrl + '/user-change-password/'+student_id+'/', studentFormData)
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

    
    const studentLoginStatus = localStorage.getItem('studentLoginStatus');
    if(studentLoginStatus === 'true'){
        window.location.href = '/user-dashboard';
    }

    useEffect(() => {
        document.title = "User Change Password";
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
                        <input type="password" value={studentData.password} 
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

export default UserForgotChangePassword;
