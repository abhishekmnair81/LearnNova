import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import "../../AddChapter.css";
import Swal from "sweetalert2";

const baseUrl = "http://127.0.0.1:8000/api";

function AddStudyMaterial() {
    const [studyData, setStudyData] = useState({
        title: '',
        description: '',
        upload: null,
        remarks: ''
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { course_id } = useParams();
    const navigate = useNavigate();

    const handleChange = (event) => {
        setStudyData({
            ...studyData,
            [event.target.name]: event.target.value
        });
    };

    const handleFileChange = (event) => {
        setStudyData({
            ...studyData,
            [event.target.name]: event.target.files[0]
        });
    };

    const formSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData();
        formData.append('course', course_id);
        formData.append('title', studyData.title);
        formData.append('description', studyData.description);
        if (studyData.upload) {
            formData.append('upload', studyData.upload);
        }
        formData.append('remarks', studyData.remarks);

        try {
            const response = await axios.post(
                `${baseUrl}/study-materials/${course_id}/`,
                formData,
                {
                    headers: { 
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                Swal.fire({
                    title: 'Data has been added',
                    icon: 'success',
                    toast: true,
                    timer: 3000,
                    position: 'top-end',
                    timerProgressBar: true,
                    showConfirmButton: false
                });
                navigate(`/study-materials/${course_id}`);
            }
        } catch (error) {
            console.error("Error adding study material:", error);
            setError("Failed to add study material. Please try again.");
            Swal.fire({
                title: 'Error!',
                text: 'Failed to add study material',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-chapter-container container mt-4">
            <div className="row">
                <aside className="col-md-3">
                    <TeacherSidebar />
                </aside>
                <section className="col-md-9">
                    <div className="card chapter-card" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
                        <h5 className="card-header">Add Study Material</h5>
                        <div className="card-body">
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={formSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label chapter-label text-warning">Title</label>
                                    <input 
                                        type="text" 
                                        onChange={handleChange} 
                                        name="title" 
                                        className="form-control chapter-input" 
                                        id="title" 
                                        value={studyData.title}
                                        required 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label chapter-label text-warning">Description</label>
                                    <textarea 
                                        className="form-control chapter-textarea" 
                                        onChange={handleChange} 
                                        name="description" 
                                        id="description" 
                                        value={studyData.description}
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="upload" className="form-label chapter-label text-warning">Upload</label>
                                    <input 
                                        type="file" 
                                        onChange={handleFileChange} 
                                        name="upload" 
                                        className="form-control chapter-input" 
                                        id="upload" 
                                        required 
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="remarks" className="form-label chapter-label text-warning">Remarks</label>
                                    <textarea 
                                        className="form-control chapter-textarea" 
                                        onChange={handleChange} 
                                        name="remarks" 
                                        id="remarks" 
                                        value={studyData.remarks}
                                        placeholder="This material covers chapter 1 basics"
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AddStudyMaterial;