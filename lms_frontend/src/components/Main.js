import Home from './Home';
import Header from './Header';
import Footer from './Footer';
import Page from './Page';
import FAQ from './FAQ';
import ContactUs from './ContactUs'

import CourseDetail from "./CourseDetail";
import { Routes as Switch ,Route } from 'react-router-dom';
import TeacherDetail from './TeacherDetail';
import AllCourses from './AllCourses';
import PopularCourses from './PopularCourses';
import PopularTeachers from './PopularTeachers';
import CategoryCourses from './CategoryCourses';
import Search from './Search';

//USER
import Login from './User/Login';
import Register from './User/Register';
import Dashboard from './User/Dashboard';
import MyCourses from './User/MyCourses';
import FavoriteCourses from './User/FavoriteCourses';
import RecommendedCourses from './User/RecommendedCourses';
import ProfileSetting from './User/ProfileSetting';
import ChangePassword from './User/ChangePassword';
import StudentAssignments from './User/StudentAssignments';

//TEACHERS
import TeacherLogin from './Teacher/TeacherLogin';
import ForgotPassword from './Teacher/ForgotPassword';
import ForgetChangePassword from './Teacher/ForgetChangePassword';

import UserForgotPassword from './User/UserForgotPassword';
import UserForgotChangePassword from './User/UserForgotChangePassword';

import TeacherRegister from './Teacher/TeacherRegister';
import TeacherDashboard from './Teacher/TeacherDashboard';
import TeacherCourses from './Teacher/TeacherCourses';
import EnrolledStudents from './Teacher/EnrolledStudents';
import AddCourse from './Teacher/AddCourse';
import AddChapter from './Teacher/AddChapter';
import AllChapters from './Teacher/CourseChapters';
import EditChapter from './Teacher/EditChapter';
import EditCourse from './Teacher/EditCourse';
import AddQuiz from './Teacher/AddQuiz';
import AllQuiz from './Teacher/AllQuiz';
import EditQuiz from './Teacher/EditQuiz';
import QuizQuestions from './Teacher/QuizQuestions';
import AddQuizQuestion from './Teacher/AddQuizQuestion';
import AssignQuiz from './Teacher/AssignQuiz';
import AttemptedStudents from './Teacher/AttemptedStudents';
import ViewStudent from "./Teacher/ViewStudent";

import UserList from './Teacher/UserList';
import TeacherProfileSetting from './Teacher/TeacherProfileSetting';
import TeacherChangePassword from './Teacher/TeacherChangePassword';
import TeacherLogout from './Teacher/TeacherLogout';
import TeacherSkillCourses from './TeacherSkillCourses';
import Logout from './User/StudentLogout';
import AddAssignment from './Teacher/AddAssignment';
import ShowAssignment from './Teacher/ShowAssignment';
import CourtseQuizList from './User/CourseQuizList';
import TakeQuiz from './User/TakeQuiz';
import UserStudyMaterials from './User/UserStudyMaterials';

import StudyMaterials from './Teacher/StudyMaterials';
import AddStudyMaterial from './Teacher/AddStudyMaterial';
import Category from './Category';
import VerifyTeacher from './Teacher/VerifyTeacher';
import VerifyStudent from './User/VerifyStudent';
import MyTeachers from './User/MyTeachers';

function Main() {
  return (
    <div className='App'>
      <Header /> 
      <Switch>
        <Route path="/" element={<Home />} />
        <Route path="/detail/:course_id" element={<CourseDetail />} />
        <Route path="/user-login" element={<Login />} />
        <Route path="/user-logout" element={<Logout />} />
        <Route path="/verify-student/:student_id" element={<VerifyStudent />} />
        <Route path="/user-register" element={<Register />} /> 
        <Route path="/user-dashboard" element={<Dashboard />} />
        <Route path="/my-courses" element={<MyCourses />} />
        <Route path="/favorite-courses" element={<FavoriteCourses />} />
        <Route path="/recommended-courses" element={<RecommendedCourses />} />
        <Route path="/profile-setting" element={<ProfileSetting />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/teacher-login" element={<TeacherLogin />} />
        <Route path="/teacher-forgot-password" element={<ForgotPassword />} />
        <Route path="/teacher-change-password/:teacher_id" element={<ForgetChangePassword />} />

        <Route path="/user-forgot-password" element={<UserForgotPassword />} />
        <Route path="/user-change-password/:student_id" element={<UserForgotChangePassword />} />
        <Route path="/verify-teacher/:teacher_id" element={<VerifyTeacher />} />
        <Route path="/teacher-logout" element={<TeacherLogout />} />
        <Route path="/teacher-register" element={<TeacherRegister />} /> 
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher-courses" element={<TeacherCourses />} />
        <Route path="/my-teachers" element={<MyTeachers />} />
        <Route path="/add-course" element={<AddCourse />} />
        <Route path="/edit-course/:course_id" element={<EditCourse />} />
        <Route path="/add-chapter/:course_id" element={<AddChapter />} />
        <Route path="/my-users" element={<UserList />} />
        <Route path="/teacher-profile-setting" element={<TeacherProfileSetting />} />
        <Route path="/teacher-change-password" element={<TeacherChangePassword />} />
        <Route path="/teacher-detail/:teacher_id" element={<TeacherDetail />} />
        <Route path='/all-courses' element={<AllCourses />} />
        <Route path='/all-chapters/:course_id' element={<AllChapters />} />
        <Route path='/popular-courses' element={<PopularCourses />} />
        <Route path='/popular-teachers' element={<PopularTeachers/>} />
        <Route path='/category' element={<Category />} />
        <Route path='/course/:category_id' element={<CategoryCourses />} />
        <Route path='/edit-chapter/:chapter_id' element={<EditChapter />} />
        <Route path='/teacher-skill-courses/:skill_name/:teacher_id' element={<TeacherSkillCourses />} />
        <Route path="/enrolled-students/:course_id" element={<EnrolledStudents />} />
        <Route path='/add-assignment/:student_id/:teacher_id' element={<AddAssignment />} />
        <Route path='/show-assignment/:student_id/:teacher_id' element={<ShowAssignment />} />
        <Route path='/my-assignments/' element={<StudentAssignments />} />

        <Route path="/add-quiz" element={<AddQuiz />} />
        <Route path="/quiz" element={<AllQuiz />} />
        <Route path="/view-student/:student_id" element={<ViewStudent />} />
        

        <Route path="/edit-quiz/:quiz_id" element={<EditQuiz />} />
        <Route path="/all-questions/:quiz_id" element={<QuizQuestions />} />
        <Route path="/add-quiz-question/:quiz_id" element={<AddQuizQuestion />} />
        <Route path="/assign-quiz/:course_id" element={<AssignQuiz />} />
        <Route path="/course-quiz/:course_id" element={<CourtseQuizList />} />
        <Route path="/take-quiz/:quiz_id" element={<TakeQuiz />} />
        <Route path="/attempted-students/:quiz_id" element={<AttemptedStudents />} />

        <Route path="/search/:searchstring" element={<Search />} />

        <Route path='/user/study-materials/:course_id' element={<UserStudyMaterials />} />
        <Route path='/study-materials/:course_id' element={<StudyMaterials />} />
        <Route path='/add-study/:course_id' element={<AddStudyMaterial />} />
        {/* <Route path='/edit-study/:study_id' element={<EditChapter />} /> */}

        <Route path="/faq" element={<FAQ />} />
        <Route path="page/:page_id/:page_slug" element={<Page />} />
        <Route path="/contact-us" element={<ContactUs />} />
        


      </Switch> 
      <Footer />
    </div>
  )
}

export default Main;
