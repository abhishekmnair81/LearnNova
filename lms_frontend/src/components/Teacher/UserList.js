import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import TeacherSidebar from "./TeacherSidebar";
import MessageList from "./MessageList";
import axios from "axios";
import "../../UserList.css";

const baseUrl = "http://127.0.0.1:8000/api";

function UserList() {
    const [students, setStudents] = useState([]);
    const teacherId = localStorage.getItem("teacherId");

    useEffect(() => {
        axios.get(`${baseUrl}/fetch-all-enrolled-students/${teacherId}`)
            .then((res) => {
                // Remove duplicates by student ID
                const uniqueStudents = res.data.reduce((acc, current) => {
                    const exists = acc.find(item => item.student.id === current.student.id);
                    if (!exists) {
                        acc.push(current);
                    }
                    return acc;
                }, []);
                setStudents(uniqueStudents);
            })
            .catch((error) => console.error("Error fetching students:", error));
    }, [teacherId]);

    const [groupmsgData, setgroupmsgData] = useState({
        msg_text: '',
    });

    const [groupsuccessMsg, setgroupsuccessMsg] = useState('');
    const [grouperrorMsg, setgrouperrorMsg] = useState('');

    const groupformSubmit = () => {
        const _formData = new FormData();
        _formData.append('msg_text', groupmsgData.msg_text);
        _formData.append('msg_from', 'teacher');

        try {
            axios.post(baseUrl + '/send-group-message/' + teacherId, _formData)
                .then((res) => {
                    if (res.data.bool === true) {
                        setgroupmsgData({
                            'msg_text': ''
                        });
                        setgroupsuccessMsg(res.data.msg);
                        setgrouperrorMsg('');
                    } else {
                        setgrouperrorMsg(res.data.msg);
                        setgroupsuccessMsg('');
                    }
                });
        } catch (error) {
            console.error(error);
        }
    };

    const [msgData, setmsgData] = useState({
        msg_text: '',
    });

    const handleChange = (event) => {
        setmsgData({
            ...msgData,
            [event.target.name]: event.target.value
        });
    };

    const grouphandleChange = (event) => {
        setgroupmsgData({
            ...groupmsgData,
            [event.target.name]: event.target.value
        });
    };

    const [successMsg, setsuccessMsg] = useState('');
    const [errorMsg, seterrorMsg] = useState('');

    const formSubmit = (student_id) => {
        const _formData = new FormData();
        _formData.append('msg_text', msgData.msg_text);
        _formData.append('msg_from', 'teacher');

        try {
            axios.post(baseUrl + '/send-message/' + teacherId + '/' + student_id, _formData)
                .then((res) => {
                    if (res.data.bool === true) {
                        setmsgData({
                            'msg_text': ''
                        });
                        setsuccessMsg(res.data.msg);
                        seterrorMsg('');
                    } else {
                        seterrorMsg(res.data.msg);
                        setsuccessMsg('');
                    }
                });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="students-page-container">
            <div className="students-page-layout">
                <aside className="students-page-sidebar">
                    <TeacherSidebar />
                </aside>
                <main className="students-page-main">
                    <div className="students-page-header">
                        <h1 className="students-page-title">My Students</h1>
                        <div className="students-page-actions">
                            <button
                                type="button"
                                className="btn-message-all"
                                data-bs-toggle="modal"
                                data-bs-target="#groupMsgModel"
                            >
                                <i className="bi bi-envelope-fill"></i>
                                Message All Students
                            </button>
                        </div>
                    </div>

                    <div className="students-table-card">
                        <div className="students-table-wrapper">
                            <table className="students-table">
                                <thead>
                                    <tr>
                                        <th>Student Name</th>
                                        <th>Email</th>
                                        <th>Username</th>
                                        <th>Interests</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.length === 0 ? (
                                        <tr>
                                            <td colSpan="5">
                                                <div className="students-empty-state">
                                                    <div className="students-empty-icon">👥</div>
                                                    <h3 className="students-empty-title">No Students Yet</h3>
                                                    <p className="students-empty-text">
                                                        Students who enroll in your courses will appear here
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        students.map((row, index) => (
                                            <tr key={row.student.id}>
                                                <td>
                                                    <Link
                                                        to={`/view-student/${row.student.id}`}
                                                        className="student-name-link"
                                                    >
                                                        {row.student.full_name}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <span className="student-email">
                                                        {row.student.email}
                                                    </span>
                                                </td>
                                                <td>{row.student.username}</td>
                                                <td>
                                                    <span className="student-categories">
                                                        {row.student.interested_categories || 'N/A'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="student-actions">
                                                        <Link
                                                            to={`/show-assignment/${row.student.id}/${teacherId}`}
                                                            className="btn-action-secondary"
                                                        >
                                                            View Assignments
                                                        </Link>
                                                        <Link
                                                            to={`/add-assignment/${row.student.id}/${teacherId}`}
                                                            className="btn-action-primary"
                                                        >
                                                            Add Assignment
                                                        </Link>
                                                        <button
                                                            className="btn-chat-icon"
                                                            data-bs-toggle="modal"
                                                            data-bs-target={`#msgModal${index}`}
                                                            title="Send Message"
                                                        >
                                                            <i className="bi bi-chat-text-fill"></i>
                                                        </button>
                                                    </div>

                                                    {/* Individual Message Modal */}
                                                    <div
                                                        className="modal fade"
                                                        id={`msgModal${index}`}
                                                        tabIndex="-1"
                                                        aria-labelledby={`msgModalLabel${index}`}
                                                        aria-hidden="true"
                                                    >
                                                        <div className="modal-dialog modal-xl message-modal-dialog">
                                                            <div className="modal-content message-modal-content">
                                                                <div className="modal-header message-modal-header">
                                                                    <h5
                                                                        className="modal-title message-modal-title"
                                                                        id={`msgModalLabel${index}`}
                                                                    >
                                                                        Chat with {row.student.full_name}
                                                                    </h5>
                                                                    <button
                                                                        type="button"
                                                                        className="btn-close message-modal-close"
                                                                        data-bs-dismiss="modal"
                                                                        aria-label="Close"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </div>
                                                                <div className="modal-body message-modal-body">
                                                                    <div className="chat-layout">
                                                                        <div className="chat-messages-section">
                                                                            <div className="chat-messages-container">
                                                                                <MessageList
                                                                                    teacher_id={teacherId}
                                                                                    student_id={row.student.id}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="chat-form-section">
                                                                            <div className="message-form-container">
                                                                                {successMsg && (
                                                                                    <div className="alert-message alert-success">
                                                                                        {successMsg}
                                                                                    </div>
                                                                                )}
                                                                                {errorMsg && (
                                                                                    <div className="alert-message alert-error">
                                                                                        {errorMsg}
                                                                                    </div>
                                                                                )}
                                                                                <form>
                                                                                    <div className="message-form-group">
                                                                                        <label
                                                                                            htmlFor={`message-${index}`}
                                                                                            className="message-form-label"
                                                                                        >
                                                                                            Your Message
                                                                                        </label>
                                                                                        <textarea
                                                                                            id={`message-${index}`}
                                                                                            onChange={handleChange}
                                                                                            value={msgData.msg_text}
                                                                                            name="msg_text"
                                                                                            className="message-form-textarea"
                                                                                            placeholder="Type your message here..."
                                                                                        ></textarea>
                                                                                    </div>
                                                                                    <div className="message-form-actions">
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => formSubmit(row.student.id)}
                                                                                            className="btn-send-message"
                                                                                        >
                                                                                            Send Message
                                                                                        </button>
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Group Message Modal */}
            <div
                className="modal fade group-message-modal"
                id="groupMsgModel"
                tabIndex="-1"
                aria-labelledby="groupMsgModelLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog message-modal-dialog">
                    <div className="modal-content message-modal-content">
                        <div className="modal-header message-modal-header">
                            <h5 className="modal-title message-modal-title" id="groupMsgModelLabel">
                                Send Message to All Students
                            </h5>
                            <button
                                type="button"
                                className="btn-close message-modal-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body message-modal-body">
                            <div className="message-form-container">
                                {groupsuccessMsg && (
                                    <div className="alert-message alert-success">
                                        {groupsuccessMsg}
                                    </div>
                                )}
                                {grouperrorMsg && (
                                    <div className="alert-message alert-error">
                                        {grouperrorMsg}
                                    </div>
                                )}
                                <form>
                                    <div className="message-form-group">
                                        <label htmlFor="groupMessage" className="message-form-label">
                                            Message to All Students
                                        </label>
                                        <textarea
                                            id="groupMessage"
                                            onChange={grouphandleChange}
                                            value={groupmsgData.msg_text}
                                            name="msg_text"
                                            className="message-form-textarea"
                                            rows="8"
                                            placeholder="Type your message here..."
                                        ></textarea>
                                    </div>
                                    <div className="message-form-actions">
                                        <button
                                            type="button"
                                            onClick={groupformSubmit}
                                            className="btn-send-message"
                                        >
                                            Send to All Students
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserList;