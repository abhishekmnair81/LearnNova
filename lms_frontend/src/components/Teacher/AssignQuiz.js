import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import TeacherSidebar from "./TeacherSidebar";
import axios from "axios";
import Swal from "sweetalert2";
import "../../TeacherCourses.css"; // Same CSS as TeacherCourses

const baseUrl = "http://127.0.0.1:8000/api";

function AssignQuiz() {
    const [quizData, setQuizData] = useState([]);
    const [courseData, setCourseData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { course_id } = useParams();
    const teacherId = localStorage.getItem("teacherId");

    // Fetch quizzes and course data
    useEffect(() => {
        setLoading(true);
        
        // Fetch teacher's quizzes
        axios.get(`${baseUrl}/teacher-quiz/${teacherId}/`)
            .then((res) => {
                setQuizData(res.data);
            })
            .catch((error) => {
                console.error("Error fetching quizzes:", error);
                setError("Failed to load quizzes. Please try again.");
            });

        // Fetch course data
        axios.get(`${baseUrl}/course/${course_id}/`)
            .then((res) => {
                setCourseData(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching course data:", error);
                setError("Failed to load course data. Please try again.");
                setLoading(false);
            });
    }, [course_id, teacherId]);

    // Check if quiz is already assigned to the course
    useEffect(() => {
        if (!loading) {
            axios.get(`${baseUrl}/quiz-assign-course/?course_id=${course_id}`)
                .then((res) => {
                    const assignedQuizIds = res.data.map(item => item.quiz.id);
                    
                    setQuizData(prevQuizData => 
                        prevQuizData.map(quiz => ({
                            ...quiz,
                            assign_status: assignedQuizIds.includes(quiz.id) ? 1 : 0
                        }))
                    );
                })
                .catch((error) => {
                    console.error("Error checking assigned quizzes:", error);
                });
        }
    }, [loading, course_id]);

    const handleAssignQuiz = (quiz_id) => {
        Swal.fire({
            title: 'Assigning Quiz...',
            didOpen: () => {
                Swal.showLoading();
            },
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false
        });

        const assignData = {
            teacher: teacherId,
            course: course_id,
            quiz: quiz_id
        };

        axios.post(`${baseUrl}/quiz-assign-course/`, assignData)
            .then(() => {
                Swal.fire({
                    title: "Success",
                    text: "Quiz assigned to course successfully!",
                    icon: "success",
                    confirmButtonColor: "#3085d6"
                });
                
                setQuizData(quizData.map((quiz) =>
                    quiz.id === quiz_id ? { ...quiz, assign_status: 1 } : quiz
                ));
            })
            .catch((error) => {
                console.error("Error assigning quiz:", error);
                
                Swal.fire({
                    title: "Error",
                    text: error.response?.data?.message || "Failed to assign quiz. Please try again.",
                    icon: "error",
                    confirmButtonColor: "#3085d6"
                });
            });
    };

    if (error) {
        return (
            <div className="courseee-page__container">
                <div className="courseee-row">
                    <aside className="courseee-col--sidebar">
                        <TeacherSidebar />
                    </aside>
                    <section className="courseee-col--main">
                        <div className="alert alert-danger">{error}</div>
                    </section>
                </div>
            </div>
        );
    }

    return (
        <div className="courseee-page__container">
            <div className="courseee-row">
                <aside className="courseee-col--sidebar">
                    <TeacherSidebar />
                </aside>
                <section className="courseee-col--main">
                    <div className="courseee-card courseee-course__card">
                        <h5 className="courseee-card__header">
                            Assign Quiz <span className="text-primary">({courseData.title || "Loading..."})</span>
                        </h5>
                        <div className="courseee-card__body">
                            {loading ? (
                                <div className="text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : quizData.length === 0 ? (
                                <div className="alert alert-info">No quizzes available to assign.</div>
                            ) : (
                                <table className="courseee-table">
                                    <thead className="courseee-table__header">
                                        <tr>
                                            <th>Name</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quizData.map((row) => (
                                            <tr key={row.id}>
                                                <td>
                                                    <Link to={`/all-questions/${row.id}`} className="courseee-course__title">
                                                        {row.title}
                                                    </Link>
                                                </td>
                                                <td className="courseee-text--center">
                                                    {row.assign_status === 0 ? (
                                                        <button
                                                            onClick={() => handleAssignQuiz(row.id)}
                                                            className="courseee-btn courseee-btn--warning courseee-me--sm"
                                                        >
                                                            Assign Quiz
                                                        </button>
                                                    ) : (
                                                        <span className="badge bg-success">Already Assigned</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AssignQuiz;