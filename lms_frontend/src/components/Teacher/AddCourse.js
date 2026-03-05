import { useState, useEffect } from "react";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import "../../AddCourse.css";

const baseUrl = 'http://127.0.0.1:8000/api';

function AddCourse() {
    const [categories, setCategories] = useState([]);
    const [courseData, setCourseData] = useState({
        category: '',
        title: '',
        description: '',
        f_img: null,
        techs: ''
    });
    const [fileName, setFileName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        axios.get(`${baseUrl}/category`)
            .then((res) => setCategories(res.data))
            .catch((error) => console.error("Error fetching categories:", error));
    }, []);

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
                [e.target.name]: file,
            });
            setFileName(file.name);
        }
    };

    const formSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('category', courseData.category);
        
        const teacherId = localStorage.getItem('teacherId');
        if (!teacherId) {
            console.error("Teacher ID is missing in localStorage");
            setIsSubmitting(false);
            return;
        }
        
        formData.append('teacher', teacherId);
        formData.append('title', courseData.title);
        formData.append('description', courseData.description);
        
        if (courseData.f_img) {
            formData.append('featured_img', courseData.f_img, courseData.f_img.name);
        }
        
        formData.append('techs', courseData.techs);

        axios.post(`${baseUrl}/course/`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => {
            console.log("Course added successfully:", res.data);
            window.location.href = '/teacher-courses';
        })
        .catch((error) => {
            console.error("Error adding course:", error);
            setIsSubmitting(false);
        });
    };

    return (
        <div className="course-create-container">
            <div className="course-create-layout">
                <aside className="course-create-sidebar">
                    <TeacherSidebar />
                </aside>
                <main className="course-create-main">
                    <div className="course-create-header">
                        <h1 className="course-create-title">Create New Course</h1>
                        <p className="course-create-subtitle">
                            Share your knowledge with students around the world
                        </p>
                    </div>

                    <div className="course-form-card">
                        <div className="course-form-header">
                            <h2 className="course-form-header-title">Course Information</h2>
                        </div>

                        <form onSubmit={formSubmit}>
                            <div className="course-form-body">
                                <div className="form-field-group">
                                    <label htmlFor="category" className="form-field-label form-field-label-required">
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        className="form-field-select"
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

                                <div className="form-field-group">
                                    <label htmlFor="title" className="form-field-label form-field-label-required">
                                        Course Title
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        name="title"
                                        className="form-field-input"
                                        onChange={handleChange}
                                        value={courseData.title}
                                        placeholder="e.g., Complete Python Bootcamp"
                                        required
                                    />
                                </div>

                                <div className="form-field-group">
                                    <label htmlFor="description" className="form-field-label form-field-label-required">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        className="form-field-textarea"
                                        onChange={handleChange}
                                        value={courseData.description}
                                        placeholder="Describe what students will learn in your course..."
                                        required
                                    ></textarea>
                                    <span className="form-field-hint">
                                        A good description helps students understand what they'll gain from your course
                                    </span>
                                </div>

                                <div className="form-field-group">
                                    <label htmlFor="f_img" className="form-field-label">
                                        Featured Image
                                    </label>
                                    <div className="form-field-file">
                                        <input
                                            id="f_img"
                                            type="file"
                                            name="f_img"
                                            className="form-field-file-input"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                        <label htmlFor="f_img" className="form-field-file-label">
                                            📁 Choose File
                                        </label>
                                        {fileName && (
                                            <span className="form-field-file-name">
                                                Selected: {fileName}
                                            </span>
                                        )}
                                    </div>
                                    <span className="form-field-hint">
                                        Upload a course thumbnail (recommended: 1200x675px, JPG or PNG)
                                    </span>
                                </div>

                                <div className="form-field-group">
                                    <label htmlFor="techs" className="form-field-label form-field-label-required">
                                        Technologies / Topics
                                    </label>
                                    <textarea
                                        id="techs"
                                        name="techs"
                                        className="form-field-textarea"
                                        onChange={handleChange}
                                        value={courseData.techs}
                                        placeholder="e.g., Python, Django, REST APIs, PostgreSQL"
                                        required
                                        style={{ minHeight: '80px' }}
                                    ></textarea>
                                    <span className="form-field-hint">
                                        List the key technologies or topics covered in your course
                                    </span>
                                </div>
                            </div>

                            <div className="course-form-actions">
                                <button
                                    type="submit"
                                    className="btn-course-submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Creating Course...' : 'Create Course'}
                                </button>
                                <button
                                    type="button"
                                    className="btn-course-cancel"
                                    onClick={() => window.history.back()}
                                    disabled={isSubmitting}
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

export default AddCourse;