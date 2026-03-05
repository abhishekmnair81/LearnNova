import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import "../../AddChapter.css";

const baseUrl = "http://127.0.0.1:8000/api";

function AddChapter() {
    const [chapterData, setChapterData] = useState({
        title: '',
        description: '',
        video: null,
        remarks: ''
    });
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { course_id } = useParams();
    const navigate = useNavigate();

    const handleChange = (event) => {
        setChapterData({
            ...chapterData,
            [event.target.name]: event.target.value
        });
    };

    const handleFileChange = (event) => {
        setChapterData({
            ...chapterData,
            [event.target.name]: event.target.files[0]
        });
    };

    const formSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');
        setSuccessMsg('');

        const formData = new FormData();
        formData.append('course', course_id);
        formData.append('title', chapterData.title);
        formData.append('description', chapterData.description);
        if (chapterData.video) {
            formData.append('video', chapterData.video);
        }
        formData.append('remarks', chapterData.remarks);

        try {
            const response = await axios.post(`${baseUrl}/chapter/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSuccessMsg('Chapter added successfully!');
            setChapterData({
                title: '',
                description: '',
                video: null,
                remarks: ''
            });
        } catch (error) {
            console.error("Error adding chapter:", error);
            setErrorMsg(error.response?.data?.message || 'Failed to add chapter');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-chapter-addchapter-wrapper">
            <div className="container mt-4">
                <div className="row">
                    <aside className="col-md-3">
                        <TeacherSidebar />
                    </aside>
                    <section className="col-md-9">
                        <div className="add-chapter-card">
                            <div className="add-chapter-card-header">
                                <h1 className="add-chapter-card-title">Add New Chapter</h1>
                            </div>
                            <div className="add-chapter-card-body">
                                {successMsg && <div className="add-chapter-alert add-chapter-alert-success">{successMsg}</div>}
                                {errorMsg && <div className="add-chapter-alert add-chapter-alert-danger">{errorMsg}</div>}

                                <form onSubmit={formSubmit} className="add-chapter-form">
                                    <div className="add-chapter-form-group">
                                        <label htmlFor="title" className="add-chapter-label">Chapter Title</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={chapterData.title}
                                            onChange={handleChange}
                                            className="add-chapter-input"
                                            placeholder="e.g., Getting Started with React"
                                            required
                                        />
                                    </div>

                                    <div className="add-chapter-form-group">
                                        <label htmlFor="description" className="add-chapter-label">Description</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={chapterData.description}
                                            onChange={handleChange}
                                            className="add-chapter-textarea"
                                            rows="4"
                                            placeholder="Briefly describe what students will learn..."
                                            required
                                        />
                                    </div>

                                    <div className="add-chapter-form-group">
                                        <label htmlFor="video" className="add-chapter-label">Upload Video</label>
                                        <input
                                            type="file"
                                            id="video"
                                            name="video"
                                            onChange={handleFileChange}
                                            className="add-chapter-file-input"
                                            accept="video/*"
                                            required
                                        />
                                        {chapterData.video && (
                                            <p className="add-chapter-file-name">Selected: {chapterData.video.name}</p>
                                        )}
                                    </div>

                                    <div className="add-chapter-form-group">
                                        <label htmlFor="remarks" className="add-chapter-label">Remarks (Optional)</label>
                                        <textarea
                                            id="remarks"
                                            name="remarks"
                                            value={chapterData.remarks}
                                            onChange={handleChange}
                                            className="add-chapter-textarea"
                                            rows="3"
                                            placeholder="e.g., This video covers the basics of hooks"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="add-chapter-submit-btn"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Adding Chapter...' : 'Add Chapter'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default AddChapter;