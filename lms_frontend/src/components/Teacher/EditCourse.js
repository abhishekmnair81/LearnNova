import { useState, useEffect } from "react";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../EditCourse.css";

const baseUrl = "http://127.0.0.1:8000/api";

function EditCourse() {
    const [categories, setCategories] = useState([]);
    const [courseData, setCourseData] = useState({
        category: "",
        title: "",
        description: "",
        f_img: null,
        prev_img: "",
        techs: "",
    });
    const [fileName, setFileName] = useState('');

    const { course_id } = useParams();
    const navigate = useNavigate();

    // Fetch categories and course details on component mount
    useEffect(() => {
        axios.get(`${baseUrl}/category`)
            .then((res) => setCategories(res.data))
            .catch((error) => console.error("Error fetching categories:", error));

        axios.get(`${baseUrl}/teacher-course-detail/${course_id}/`)
            .then((res) => {
                const data = res.data;
                setCourseData({
                    category: data.category || "",
                    title: data.title || "",
                    description: data.description || "",
                    f_img: null,
                    prev_img: data.featured_img || "",
                    techs: data.techs || "",
                });
            })
            .catch((error) => console.error("Error fetching course data:", error));
    }, [course_id]);

    const handleChange = (e) => {
        setCourseData({
            ...courseData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCourseData({
                ...courseData,
                f_img: file,
            });
            setFileName(file.name);
        }
    };

    const formSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("category", courseData.category);
        formData.append("teacher", localStorage.getItem("teacherId"));
        formData.append("title", courseData.title);
        formData.append("description", courseData.description);
        if (courseData.f_img) {
            formData.append("featured_img", courseData.f_img, courseData.f_img.name);
        }
        formData.append("techs", courseData.techs);

        axios.put(`${baseUrl}/teacher-course-detail/${course_id}/`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
            if (res.status === 200) {
                Swal.fire({
                    title: "Success!",
                    text: "Course updated successfully",
                    icon: "success",
                    toast: true,
                    timer: 3000,
                    position: "top-right",
                    timerProgressBar: true,
                    showConfirmButton: false,
                    confirmButtonColor: "#a435f0",
                }).then(() => {
                    navigate(`/teacher-courses`);
                });
            }
        })
        .catch((error) => console.error("Error updating course:", error));
    };

    return (
        <div className="course-edit-container">
            <div className="course-edit-layout">
                <aside className="course-edit-sidebar">
                    <TeacherSidebar />
                </aside>
                <main className="course-edit-main">
                    <div className="course-edit-header">
                        <h1 className="course-edit-title">Edit Course</h1>
                        <p className="course-edit-subtitle">
                            Update your course information and settings
                        </p>
                    </div>

                    <div className="course-edit-card">
                        <div className="course-edit-card-header">
                            <h2 className="course-edit-card-title">Course Details</h2>
                        </div>

                        <form onSubmit={formSubmit}>
                            <div className="course-edit-card-body">
                                <div className="course-edit-info-card">
                                    <div className="course-edit-info-icon">ℹ️</div>
                                    <div className="course-edit-info-content">
                                        <p className="course-edit-info-title">Tip</p>
                                        <p className="course-edit-info-text">
                                            Make sure your course information is clear and comprehensive to attract more students.
                                        </p>
                                    </div>
                                </div>

                                <div className="course-edit-form-group">
                                    <label htmlFor="category" className="course-edit-form-label course-edit-form-label-required">
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        className="course-edit-form-select"
                                        onChange={handleChange}
                                        value={courseData.category}
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="course-edit-form-group">
                                    <label htmlFor="title" className="course-edit-form-label course-edit-form-label-required">
                                        Course Title
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        name="title"
                                        className="course-edit-form-input"
                                        onChange={handleChange}
                                        value={courseData.title}
                                        placeholder="e.g., Complete Python Bootcamp"
                                        required
                                    />
                                    <span className="course-edit-form-hint">
                                        Choose a clear, descriptive title for your course
                                    </span>
                                </div>

                                <div className="course-edit-form-group">
                                    <label htmlFor="description" className="course-edit-form-label course-edit-form-label-required">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        className="course-edit-form-textarea"
                                        onChange={handleChange}
                                        value={courseData.description}
                                        placeholder="Describe what students will learn in your course..."
                                        required
                                    ></textarea>
                                    <span className="course-edit-form-hint">
                                        Provide a detailed overview of what students will gain from this course
                                    </span>
                                </div>

                                <div className="course-edit-form-group">
                                    <label htmlFor="f_img" className="course-edit-form-label">
                                        Featured Image
                                    </label>
                                    <div className="course-image-upload-section">
                                        <input
                                            id="f_img"
                                            type="file"
                                            name="f_img"
                                            className="course-image-file-input"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                        <label htmlFor="f_img" className="course-image-file-label">
                                            📁 Choose New Image
                                        </label>
                                        {fileName && (
                                            <span className="course-edit-form-hint">
                                                New file selected: {fileName}
                                            </span>
                                        )}
                                    </div>
                                    <span className="course-edit-form-hint">
                                        Upload a new course thumbnail (recommended: 1200x675px, JPG or PNG)
                                    </span>

                                    {courseData.prev_img && (
                                        <div className="course-image-preview-section">
                                            <h3 className="course-image-preview-title">Current Image</h3>
                                            <div className="course-image-preview-wrapper">
                                                <img
                                                    src={courseData.prev_img}
                                                    className="course-image-preview"
                                                    alt="Course Featured"
                                                />
                                                <span className="course-image-preview-badge">Current</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="course-edit-form-group">
                                    <label htmlFor="techs" className="course-edit-form-label course-edit-form-label-required">
                                        Technologies / Topics
                                    </label>
                                    <textarea
                                        id="techs"
                                        name="techs"
                                        className="course-edit-form-textarea"
                                        onChange={handleChange}
                                        value={courseData.techs}
                                        placeholder="e.g., Python, Django, REST APIs, PostgreSQL"
                                        required
                                        style={{ minHeight: '80px' }}
                                    ></textarea>
                                    <span className="course-edit-form-hint">
                                        List the key technologies or topics covered in your course
                                    </span>
                                </div>
                            </div>

                            <div className="course-edit-form-actions">
                                <button type="submit" className="btn-course-update">
                                    Update Course
                                </button>
                                <button
                                    type="button"
                                    className="btn-course-cancel"
                                    onClick={() => navigate('/teacher-courses')}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default EditCourse;