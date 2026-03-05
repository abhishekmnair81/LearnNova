import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom"; 
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import "../../CourseChapters.css";

const baseUrl = 'http://127.0.0.1:8000/api';

function CourseChapters() {
    const [chapterData, setChapterData] = useState([]);
    const [totalResult, setTotalResult] = useState([0]);
    const { course_id } = useParams();

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const response = await axios.get(`${baseUrl}/course-chapters/${course_id}`);
                console.log('Fetched chapters:', response.data);
                setChapterData(response.data);
                setTotalResult(response.data.length);
            } catch (error) {
                console.error('Error fetching course chapters:', error);
            }
        };
    
        fetchChapters();
    }, [course_id]);
    

    const Swal = require('sweetalert2');
    const handleDeleteClick = (chapter_id) => {
        Swal.fire({
            title: 'Confirm',
            text: 'Are you sure you want to delete this chapter?',
            icon: 'info',
            confirmButtonText: 'Continue',
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${baseUrl}/chapter/${chapter_id}/`)
                    .then((response) => {
                        Swal.fire('Success', 'Data has been deleted !!', 'success');
                        axios.get(`${baseUrl}/course-chapters/${course_id}`)
                            .then((response) => {
                                setTotalResult(response.data.length);
                                setChapterData(response.data);
                            })
                            .catch((error) => {
                                console.error('Error fetching updated chapters:', error);
                            });
                    })
                    .catch((error) => {
                        Swal.fire('Error', 'Error deleting data !!', 'error');
                        console.error('Error deleting chapter:', error);
                    });
            }
        });
    };

    return (
        <div className="course-chap-container">
            <div className="course-chap-layout">
                <aside className="course-chap-sidebar">
                    <TeacherSidebar />
                </aside>
                <section className="course-chap-main-content">
                    <div className="course-chap-content-card">
                        <div className="course-chap-card-header">
                            <h2 className="course-chap-header-title">Course Curriculum ({totalResult})</h2>
                            <Link className="course-chap-btn course-chap-btn-primary" to={`/add-chapter/${course_id}`}>
                                <i className="bi bi-plus-circle"></i> Add Chapter
                            </Link>
                        </div>
                        <div className="course-chap-card-body">
                            {chapterData.length > 0 ? (
                                <div className="course-chap-table-wrapper">
                                    <table className="course-chap-chapters-table">
                                        <thead className="course-chap-table-head">
                                            <tr>
                                                <th className="course-chap-th">Chapter Title</th>
                                                <th className="course-chap-th">Video Preview</th>
                                                <th className="course-chap-th">Description</th>
                                                <th className="course-chap-th course-chap-th-actions">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="course-chap-table-body">
                                            {chapterData.map((chapter, index) => (
                                                <tr key={index} className="course-chap-table-row"> 
                                                    <td className="course-chap-td course-chap-td-title">
                                                        <Link to={`/edit-chapter/${chapter.id}`} className="course-chap-chapter-link">
                                                            <i className="bi bi-play-circle"></i> {chapter.title}
                                                        </Link>
                                                    </td>
                                                    <td className="course-chap-td course-chap-td-video">
                                                        {chapter.video ? (
                                                            <div className="course-chap-video-container">
                                                                <video controls className="course-chap-video-player">
                                                                    <source src={chapter.video} type="video/mp4" />
                                                                    Your browser does not support video playback.
                                                                </video>
                                                            </div>
                                                        ) : (
                                                            <span className="course-chap-no-content">No video</span>
                                                        )}
                                                    </td>
                                                    <td className="course-chap-td course-chap-td-remarks">
                                                        {chapter.remarks || <span className="course-chap-no-content">No description</span>}
                                                    </td>
                                                    <td className="course-chap-td course-chap-td-actions">
                                                        <div className="course-chap-action-buttons">
                                                            <Link to={`/edit-chapter/${chapter.id}`} className="course-chap-btn course-chap-btn-edit">
                                                                <i className="bi bi-pencil-square"></i> Edit
                                                            </Link>
                                                            <button onClick={() => handleDeleteClick(chapter.id)} className="course-chap-btn course-chap-btn-delete">
                                                                <i className="bi bi-trash3"></i> Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="course-chap-empty-state">
                                    <i className="bi bi-collection-play"></i>
                                    <p className="course-chap-empty-text">No chapters yet. Start building your course curriculum!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default CourseChapters;