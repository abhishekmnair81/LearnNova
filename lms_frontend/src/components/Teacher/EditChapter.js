import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import Swal from "sweetalert2";
import "../../EditChapter.css";

const baseUrl = 'http://127.0.0.1:8000/api';

function EditChapter() {
    const [chapterData, setChapterData] = useState({
        course: '',
        title: '',
        description: '',
        video: '', 
        prev_video: '', 
        remarks: '',
    });

    const { chapter_id } = useParams();

    const handleChange = (event) => {
        setChapterData({
            ...chapterData,
            [event.target.name]: event.target.value,
        });
    };

    const handleFileChange = (event) => {
        setChapterData({
            ...chapterData,
            video: event.target.files[0],
        });
    };

    const formSubmit = async (event) => {
        event.preventDefault();
        const _formData = new FormData();
        _formData.append('course', chapterData.course);
        _formData.append('title', chapterData.title);
        _formData.append('description', chapterData.description);
        if (chapterData.video instanceof File) {
            _formData.append('video', chapterData.video, chapterData.video.name);
        } else if (chapterData.prev_video) {
            _formData.append('video', chapterData.prev_video); 
        }
        _formData.append('remarks', chapterData.remarks);

        try {
            const response = await axios.put(`${baseUrl}/chapter/${chapter_id}/`, _formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) { 
                Swal.fire({
                    title: 'Data has been updated',
                    icon: 'success', 
                    toast: true,
                    timer: 3000,
                    position: 'top-right',
                    timerProgressBar: true,
                    showCancelButton: false,
                });
            }
            console.log('Chapter updated:', response.data);
            window.location.href = `/edit-chapter/${chapter_id}`;
        } catch (error) {
            console.error('Error updating chapter:', error);
        }
    };

    useEffect(() => {
        const fetchChapter = async () => {
            console.log('Fetching chapter data for ID:', chapter_id);
            try {
                const response = await axios.get(`${baseUrl}/chapter/${chapter_id}/`);
                console.log('Fetched data:', response.data);
                setChapterData({
                    ...response.data,
                    prev_video: response.data.video || '',
                });
            } catch (error) {
                console.error('Error fetching chapter:', error);
            }
        };

        fetchChapter();
    }, [chapter_id]);

    return (
        <div className="chap-edit-container container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    <TeacherSidebar />
                </aside>
                <section className="col-md-9 text-start">
                    <div className="chap-edit-card">
                        <h5 className="chap-edit-header">Update Chapter</h5>
                        <div className="chap-edit-body">
                            <form onSubmit={formSubmit}>
                                <div className="chap-edit-form-group">
                                    <label htmlFor="title" className="chap-edit-label">Title</label>
                                    <input
                                        type="text"
                                        value={chapterData.title}
                                        onChange={handleChange}
                                        name="title"
                                        className="chap-edit-input"
                                        id="title"
                                    />
                                </div>
                                <div className="chap-edit-form-group">
                                    <label htmlFor="description" className="chap-edit-label">Description</label>
                                    <textarea
                                        value={chapterData.description}
                                        className="chap-edit-textarea"
                                        onChange={handleChange}
                                        name="description"
                                        id="description"
                                    ></textarea>
                                </div>
                                <div className="chap-edit-form-group">
                                    <label htmlFor="video" className="chap-edit-label">Video</label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        name="video"
                                        className="chap-edit-file-input"
                                        id="video"
                                    />

                                    {chapterData.prev_video && typeof chapterData.prev_video === 'string' && (
                                        <div className="chap-edit-video-preview">
                                            <h6 className="chap-edit-video-title">Current Video:</h6>
                                            <video controls className="chap-edit-video">
                                                <source src={chapterData.prev_video} type="video/mp4" />
                                                Sorry, your browser does not support embedded videos.
                                            </video>
                                        </div>
                                    )}

                                    {chapterData.video && chapterData.video instanceof File && (
                                        <p className="chap-edit-file-selected">Selected video: {chapterData.video.name}</p>
                                    )}
                                </div>
                                <div className="chap-edit-form-group">
                                    <label htmlFor="remarks" className="chap-edit-label">Remarks</label>
                                    <textarea
                                        value={chapterData.remarks}
                                        className="chap-edit-textarea"
                                        onChange={handleChange}
                                        name="remarks"
                                        id="remarks"
                                        placeholder="This video is focused on basic introduction"
                                    ></textarea>
                                </div>
                                <hr className="chap-edit-divider" />
                                <button className="chap-edit-submit" type="submit">Submit</button> 
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default EditChapter;