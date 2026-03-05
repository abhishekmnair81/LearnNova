import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useState, useEffect } from "react";
import MessageList from "./MessageList";
import "../../MyTeachers.css"; 

const baseUrl = 'http://127.0.0.1:8000/api';

function MyTeachers() {
    const [teachers, setTeachers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [messageForm, setMessageForm] = useState({ msg_text: '' });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const studentId = localStorage.getItem('studentId');
    const [groupMessageForm, setGroupMessageForm] = useState({ 
        msg_text: '', 
        msg_from: 'student' 
    });

    useEffect(() => {
        if (!studentId) {
            setError("Student ID not found. Please log in again.");
            setIsLoading(false);
            return;
        }

        const fetchTeachers = async () => {
            try {
                const response = await axios.get(`${baseUrl}/fetch-my-teachers/${studentId}`);
                setTeachers(response.data);
            } catch (err) {
                console.error("Error fetching teachers:", err);
                setError("Failed to fetch teacher data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeachers();
    }, [studentId]);

    const handleMessageChange = (e) => {
        setMessageForm({
            ...messageForm,
            [e.target.name]: e.target.value
        });
    };

    const handleSendMessage = (teacherId) => {
        const formData = new FormData();
        formData.append('msg_text', messageForm.msg_text);
        formData.append('msg_from', 'student');

        setSuccessMessage('');
        setErrorMessage('');

        axios.post(`${baseUrl}/send-message/${teacherId}/${studentId}`, formData)
            .then((res) => {
                if (res.data.bool) {
                    setMessageForm({ msg_text: '' });
                    setSuccessMessage(res.data.msg);
                } else {
                    setErrorMessage(res.data.msg);
                }
            })
            .catch(err => {
                console.error(err);
                setErrorMessage("Failed to send message");
            });
    };

    const handleGroupMessageChange = (e) => {
        setGroupMessageForm({
            ...groupMessageForm,
            [e.target.name]: e.target.value
        });
    };

    const handleSendGroupMessage = () => {
        const formData = new FormData();
        formData.append('msg_text', groupMessageForm.msg_text);
        formData.append('msg_from', groupMessageForm.msg_from);

        axios.post(`${baseUrl}/send-group-message-from-student/${studentId}`, formData)
            .then((res) => {
                if (res.data.bool) {
                    setGroupMessageForm({ msg_text: '', msg_from: 'student' });
                    document.querySelector('#groupMessageModal .btn-close').click();
                }
            })
            .catch(err => {
                console.error(err);
            });
    };

    if (isLoading) {
        return (
            <div className="my-teacher-myteachers-wrapper">
                <div className="container mt-4">
                    <div className="row">
                        <aside className="col-md-3">
                            <Sidebar />
                        </aside>
                        <section className="col-md-9">
                            <div className="my-teacher-loading">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-3 text-muted">Loading teachers...</p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-teacher-myteachers-wrapper">
                <div className="container mt-4">
                    <div className="row">
                        <aside className="col-md-3">
                            <Sidebar />
                        </aside>
                        <section className="col-md-9">
                            <div className="my-teacher-alert my-teacher-alert-danger">
                                {error}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="my-teacher-myteachers-wrapper">
            <div className="container mt-4">
                <div className="row">
                    <aside className="col-md-3">
                        <Sidebar />
                    </aside>
                    <section className="col-md-9">
                        <div className="my-teacher-card">
                            <div className="my-teacher-card-header">
                                <h1 className="my-teacher-card-title">My Teachers</h1>
                                <button
                                    className="my-teacher-group-btn"
                                    data-bs-toggle="modal"
                                    data-bs-target="#groupMessageModal"
                                >
                                    Message All Teachers
                                </button>
                            </div>

                            <div className="my-teacher-card-body">
                                <div className="my-teacher-table-container">
                                    <table className="my-teacher-table">
                                        <thead className="my-teacher-table-header">
                                            <tr>
                                                <th>Teacher Name</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {teachers.length > 0 ? (
                                                teachers.map((teacherObj, index) => (
                                                    teacherObj.teacher && (
                                                        <tr key={index} className="my-teacher-table-row">
                                                            <td>
                                                                <Link 
                                                                    to={`/teacher-detail/${teacherObj.teacher.id}`} 
                                                                    className="my-teacher-teacher-link"
                                                                >
                                                                    {teacherObj.teacher.full_name}
                                                                </Link>
                                                            </td>
                                                            <td className="my-teacher-text--center">
                                                                <button 
                                                                    className="my-teacher-chat-btn"
                                                                    data-bs-toggle="modal" 
                                                                    data-bs-target={`#messageModal-${teacherObj.teacher.id}`}
                                                                >
                                                                    Chat
                                                                </button>
                                                                
                                                                <div 
                                                                    className="modal fade" 
                                                                    id={`messageModal-${teacherObj.teacher.id}`}
                                                                    tabIndex="-1"
                                                                >
                                                                    <div className="modal-dialog modal-lg">
                                                                        <div className="modal-content my-teacher-modal">
                                                                            <div className="my-teacher-modal-header">
                                                                                <h5 className="modal-title">
                                                                                    Chat with {teacherObj.teacher.full_name}
                                                                                </h5>
                                                                                <button 
                                                                                    type="button" 
                                                                                    className="btn-close btn-close-white" 
                                                                                    data-bs-dismiss="modal" 
                                                                                    aria-label="Close"
                                                                                ></button>
                                                                            </div>
                                                                            <div className="modal-body bg-light">
                                                                                <div className="row" style={{maxHeight: "400px", overflowY: "auto"}}>
                                                                                    <div className="col-md-8 mb-1">
                                                                                        <MessageList 
                                                                                            teacher_id={teacherObj.teacher.id} 
                                                                                            student_id={studentId} 
                                                                                        />
                                                                                    </div>
                                                                                    <div className="col-md-4">
                                                                                        {successMessage && (
                                                                                            <div className="my-teacher-alert my-teacher-alert-success">
                                                                                                {successMessage}
                                                                                            </div>
                                                                                        )}
                                                                                        {errorMessage && (
                                                                                            <div className="my-teacher-alert my-teacher-alert-danger">
                                                                                                {errorMessage}
                                                                                            </div>
                                                                                        )}
                                                                                        <form>
                                                                                            <div className="mb-3">
                                                                                                <label className="my-teacher-label">Your Message</label>
                                                                                                <textarea 
                                                                                                    onChange={handleMessageChange} 
                                                                                                    value={messageForm.msg_text} 
                                                                                                    name="msg_text" 
                                                                                                    className="my-teacher-textarea" 
                                                                                                    rows="5"
                                                                                                ></textarea>
                                                                                            </div>
                                                                                            <button 
                                                                                                type="button" 
                                                                                                onClick={() => handleSendMessage(teacherObj.teacher.id)} 
                                                                                                className="my-teacher-send-btn"
                                                                                            >
                                                                                                Send
                                                                                            </button>
                                                                                        </form>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="2" className="my-teacher-empty-state">
                                                        No teachers found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="modal fade" id="groupMessageModal" tabIndex="-1">
                            <div className="modal-dialog">
                                <div className="modal-content my-teacher-modal">
                                    <div className="my-teacher-modal-header">
                                        <h5 className="modal-title">Send Message to All Teachers</h5>
                                        <button 
                                            type="button" 
                                            className="btn-close btn-close-white" 
                                            data-bs-dismiss="modal" 
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="mb-3">
                                                <label className="my-teacher-label">Message</label>
                                                <textarea 
                                                    onChange={handleGroupMessageChange} 
                                                    value={groupMessageForm.msg_text} 
                                                    name="msg_text" 
                                                    className="my-teacher-textarea" 
                                                    rows="8"
                                                ></textarea>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={handleSendGroupMessage} 
                                                className="my-teacher-send-btn"
                                            >
                                                Send to All Teachers
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default MyTeachers;