import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import "../../CourseChapters.css";

const baseUrl = 'http://127.0.0.1:8000/api';

function StudyMaterials() {
    const [studyData, setstudyData] = useState([]);
    const [totalResult, setTotalResult] = useState([0]);
    const { course_id } = useParams();

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const response = await axios.get(`${baseUrl}/study-materials/${course_id}`);
                console.log('Fetched chapters:', response.data);
                setstudyData(response.data);
                setTotalResult(response.data.length);
            } catch (error) {
                console.error('Error fetching course chapters:', error);
            }
        };
    
        fetchChapters();
    }, [course_id]);
    

    const Swal = require('sweetalert2');
    const handleDeleteClick = (study_id) => {
        Swal.fire({
            title: 'Confirm',
            text: 'Are you sure you want to delete this material?',
            icon: 'info',
            confirmButtonText: 'Continue',
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`${baseUrl}/study-material/${study_id}/`)
                    .then((response) => {
                        Swal.fire('Success', 'Data has been deleted !!', 'success');
                        axios.get(`${baseUrl}/study-materials/${course_id}`)
                            .then((response) => {
                                setTotalResult(response.data.length);
                                setstudyData(response.data);
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
                            <h2 className="course-chap-header-title">Study Materials ({totalResult})</h2>
                            <Link className="course-chap-btn course-chap-btn-primary" to={`/add-study/${course_id}`}>
                                <i className="bi bi-plus-circle"></i> Add Study Material
                            </Link>
                        </div>
                        <div className="course-chap-card-body">
                            {studyData.length > 0 ? (
                                <div className="course-chap-table-wrapper">
                                    <table className="course-chap-chapters-table">
                                        <thead className="course-chap-table-head">
                                            <tr>
                                                <th className="course-chap-th">Material Title</th>
                                                <th className="course-chap-th">File</th>
                                                <th className="course-chap-th">Description</th>
                                                <th className="course-chap-th course-chap-th-actions">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="course-chap-table-body">
                                            {studyData.map((row, index) => (
                                                <tr key={index} className="course-chap-table-row">
                                                    <td className="course-chap-td course-chap-td-title">
                                                        <div className="course-chap-chapter-link">
                                                            <i className="bi bi-file-earmark-text"></i> {row.title}
                                                        </div>
                                                    </td>
                                                    <td className="course-chap-td course-chap-td-video">
                                                        <Link to={row.upload} className="course-chap-file-link" target="_blank" rel="noopener noreferrer">
                                                            <i className="bi bi-download"></i> Download File
                                                        </Link>
                                                    </td>
                                                    <td className="course-chap-td course-chap-td-remarks">
                                                        {row.remarks || <span className="course-chap-no-content">No description</span>}
                                                    </td>
                                                    <td className="course-chap-td course-chap-td-actions">
                                                        <div className="course-chap-action-buttons">
                                                            <button onClick={() => handleDeleteClick(row.id)} className="course-chap-btn course-chap-btn-delete">
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
                                    <i className="bi bi-file-earmark-text"></i>
                                    <p className="course-chap-empty-text">No study materials yet. Start adding resources for your students!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default StudyMaterials;