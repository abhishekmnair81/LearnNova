import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import axios from "axios";
import { FiDownload } from 'react-icons/fi';
import "../../CourseChapters.css";

const baseUrl = 'http://127.0.0.1:8000/api';

function StudyMaterials() {
    const [studyData, setstudyData] = useState([]);
    const [totalResult, setTotalResult] = useState([0]);
    const { course_id } = useParams();

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const response = await axios.get(`${baseUrl}/user/study-materials/${course_id}`);
                console.log('Fetched chapters:', response.data);
                setstudyData(response.data);
                setTotalResult(response.data.length);
            } catch (error) {
                console.error('Error fetching course chapters:', error);
            }
        };
    
        fetchChapters();
    }, [course_id]);
    
    const downloadFile = (file_url) => {
        window.location.href = file_url;
    } 

    return (
        <div className="course-chap-container">
            <div className="course-chap-layout">
                <aside className="course-chap-sidebar">
                    <Sidebar />
                </aside>
                <section className="course-chap-main-content">
                    <div className="course-chap-content-card">
                        <div className="course-chap-card-header">
                            <h2 className="course-chap-header-title">All Study Materials ({totalResult})</h2>
                        </div>
                        <div className="course-chap-card-body">
                            {studyData.length > 0 ? (
                                <div className="course-chap-table-wrapper">
                                    <table className="course-chap-chapters-table">
                                        <thead className="course-chap-table-head">
                                            <tr>
                                                <th className="course-chap-th">Title</th>
                                                <th className="course-chap-th">Detail</th>
                                                <th className="course-chap-th">Upload</th>
                                                <th className="course-chap-th">Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody className="course-chap-table-body">
                                            {studyData.map((row, index) => (
                                                <tr key={index} className="course-chap-table-row"> 
                                                    <td className="course-chap-td course-chap-td-title">{row.title}</td>
                                                    <td className="course-chap-td">{row.description}</td>
                                                    <td className="course-chap-td text-center">
                                                        <button 
                                                            className="course-chap-btn course-chap-btn-primary" 
                                                            onClick={() => downloadFile(row.upload)}
                                                        >
                                                            <FiDownload size={22} />
                                                        </button>
                                                    </td>
                                                    <td className="course-chap-td course-chap-td-remarks">
                                                        {row.remarks || <span className="course-chap-no-content">No remarks</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="course-chap-empty-state">
                                    <i className="bi bi-file-earmark-text"></i>
                                    <p className="course-chap-empty-text">No Materials available.</p>
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