from django.urls import path
from . import views

urlpatterns = [
    path('teacher/', views.TeacherList.as_view()),
    path('teacher/dashboard/<int:pk>/', views.TeacherDashboard.as_view()),
    path('teacher/<int:pk>/', views.TeacherDetail.as_view()),
    path('popular-teachers/', views.TeacherList.as_view()),
    path('teacher-login/', views.teacher_login),
    path('category/', views.CategoryList.as_view()),
    path('course/', views.CourseList.as_view()),
    path('course/<int:pk>/', views.CourseDetailView.as_view()),
    path('course-chapters/<int:course_id>/', views.CourseChapterList.as_view()),
    path('chapter/', views.ChapterList.as_view()),
    path('chapter/<int:pk>/', views.ChapterDetailView.as_view()),
    path('teacher-courses/<int:teacher_id>/', views.TeacherCourseList.as_view()),
    path('teacher-course-detail/<int:pk>/', views.TeacherCourseDetail.as_view()),
    path('teacher/change-password/<int:teacher_id>/', views.teacher_change_password),
    #students
    path('student/', views.StudentList.as_view()),
    path('student-login/', views.student_login),

    #students testimonial
    path('student-testimonial/', views.CourseRatingList.as_view()),

    path('student-enroll-course/', views.StudentEnrollCourseList.as_view()),

    path('fetch-enroll-status/<int:student_id>/<int:course_id>/', views.fetch_enroll_status),

    path('fetch-enrolled-students/<int:course_id>/', views.EnrolledStudentList.as_view()),

    path('fetch-enrolled-courses/<int:student_id>/', views.EnrolledStudentList.as_view()),

    path('fetch-recommended-courses/<int:studentId>/', views.CourseList.as_view()),

    path('fetch-all-enrolled-students/<int:teacher_id>/', views.EnrolledStudentList.as_view()),

    path('course-rating/<int:course_id>/', views.CourseRatingList.as_view()),

    path('fetch-rating-status/<int:student_id>/<int:course_id>/',views.fetch_rating_status),

    path('student-add-favorite-course/', views.StudentFavoriteCourseList.as_view()),

    path('student-remove-favorite-course/<int:course_id>/<int:student_id>/', views.remove_favorite_course),

    path('fetch-favorite-status/<int:student_id>/<int:course_id>/', views.fetch_favorite_status),

    path('fetch-favorite-courses/<int:student_id>/', views.StudentFavoriteCourseList.as_view()),

    path('student-assignment/<int:teacher_id>/<int:student_id>/',
         views.AssignmentList.as_view(),
         name='teacher-student-assignments'),

    # All assignments for a student (matches your frontend: /my-asigs/1)
    path('my-asigs/<int:student_id>/',
         views.MyAssignmentList.as_view(),
         name='my-assignments'),

    # Update assignment status
    path('update-assignments/<int:pk>/',
         views.UpdateAssignment.as_view(),
         name='update-assignment'),
    path('student/dashboard/<int:pk>/', views.StudentDashboard.as_view()),
    path('student/<int:pk>/', views.StudentDetail.as_view()),
    path('student/change-password/<int:student_id>/', views.student_change_password),

#quiz start
    path('quiz/', views.QuizList.as_view()),
    path('teacher-quiz/<int:teacher_id>/', views.TeacherQuizList.as_view()),
    path('teacher-quiz-detail/<int:pk>/', views.TeacherQuizDetail.as_view()),
    path('quiz/<int:pk>/', views.QuizDetailView.as_view()),
    path('quiz-questions/<int:quiz_id>/', views.QuizQuestionList.as_view()),
    path('quiz-questions/<int:quiz_id>/<int:limit>', views.QuizQuestionList.as_view()),
    path('quiz-assign-course/', views.CourseQuizList.as_view()),
    path('fetch-assigned-quiz/<int:course_id>/', views.CourseQuizList.as_view()),
    path('attempt-quiz/', views.AttemptQuizList.as_view()),
    path('quiz-questions/next-question/<int:question_id>/', views.QuizQuestionList.as_view()),
    path('fetch-quiz-attempt-status/<int:quiz_id>/<int:student_id>/', views.fetch_quiz_attempt_status),

    path('attempted-quiz/<int:quiz_id>/', views.AttemptQuizList.as_view()),
    path('fetch-quiz-result/<int:quiz_id_for_result>/<int:student_id>/', views.AttemptQuizList.as_view()),

    #search
    path('search-courses/<str:searchstring>', views.CourseList.as_view()),

    #Study Materials
    path('study-materials/<int:course_id>/', views.StudyMaterialList.as_view()),
    path('study-material/<int:pk>/', views.StudyMaterialDetailView.as_view()),
    path('user/study-materials/<int:course_id>/', views.StudyMaterialList.as_view()),

    path('popular-course/', views.CourseRatingList.as_view()),

    path('update-view/<int:course_id>/', views.update_view),

    #footer
    path('faq/', views.FAQList.as_view()),

    path('pages/', views.FlatPagesList.as_view()),
    path('pages/<int:pk>/<str:page_slug>/', views.FlatPagesDetail.as_view()),
    path('contact/', views.ContactList.as_view()),
    path('verify-teacher/<int:teacher_id>/', views.verify_teacher_via_otp),
    path('verify-student/<int:student_id>/', views.verify_student_via_otp),

    path('teacher-forgot-password/', views.teacher_forgot_password),
    path('teacher-change-password/<int:teacher_id>/', views.teacher_change_password),

    path('user-forgot-password/', views.user_forgot_password),
    path('user-change-password/<int:student_id>/', views.user_change_password),

    path('send-message/<int:teacher_id>/<int:student_id>', views.save_teacher_student_msg),
    path('get-messages/<int:teacher_id>/<int:student_id>', views.MessageList().as_view()),

    path('send-group-message/<int:teacher_id>', views.save_teacher_student_group_msg),
    path('fetch-my-teachers/<int:student_id>/', views.MyTeacherList.as_view()),

path('send-group-message-from-student/<int:student_id>', views.save_teacher_student_group_msg_from_student),
]