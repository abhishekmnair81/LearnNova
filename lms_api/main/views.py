from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.pagination import PageNumberPagination
import json
from django.core.mail import send_mail
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from .models import StudentFavoriteCourse, Student, Course,CourseCategory,Teacher,StudentAssignment
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView
from rest_framework import generics, permissions,status
from .serializers import (TeacherSerializer, CategorySerializer, CourseSerializer,
                          ChapterSerializer, StudentSerializer, StudentCourseEnrollSerializer,CourseRatingSerializer,
                          TeacherDashboardSerializer,StudentFavoriteCourseSerializer,StudentAssignmentSerializer,
                          StudentDashboardSerializer,QuizSerializer,QuizQuestionSerializer,
                          CourseQuizSerializer,AttemptQuizSerializer,StudyMaterialSerializer,FaqSerializer,
                            FlatPagesSerializer,ContactSerializer,TeacherStudentChatSerializer
                          )
from django.contrib.flatpages.models import FlatPage

from . import models
from django.db.models import Q


class StandardResultSetPagination(PageNumberPagination):
    page_size = 12
    page_size_param = 'page_size'
    max_page_size = 8
class TeacherList(generics.ListCreateAPIView):
    queryset = models.Teacher.objects.all()
    serializer_class = TeacherSerializer

    def get_queryset(self):
        if 'popular' in self.request.GET:
            sql = """
            SELECT t.*, COUNT(c.id) as total_course 
            FROM main_teacher as t 
            INNER JOIN main_course as c ON c.teacher_id = t.id 
            GROUP BY t.id 
            ORDER BY total_course DESC
            """
            return models.Teacher.objects.raw(sql)
        return super().get_queryset()

class TeacherDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Teacher.objects.all()
    serializer_class = TeacherSerializer

class TeacherDashboard(generics.RetrieveAPIView):
    queryset = models.Teacher.objects.all()
    serializer_class = TeacherDashboardSerializer


@csrf_exempt
def teacher_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            teacher = Teacher.objects.get(email=email, password=password)

            # Generate new OTP for login
            import random
            otp_digit = str(random.randint(100000, 999999))
            teacher.otp_digit = otp_digit
            teacher.save()

            # Send OTP email
            subject = "Your Login OTP Code"
            message = f"""
Hello {teacher.full_name},

Your OTP for login is: {otp_digit}

This code is valid for one-time use. Please do not share it with anyone.

Thank you!
Learning Management System
            """
            from_email = settings.EMAIL_HOST_USER
            recipient_list = [teacher.email]

            try:
                send_mail(subject, message, from_email, recipient_list, fail_silently=False)
            except Exception as e:
                print(f"Error sending email: {e}")

            return JsonResponse({
                'bool': True,
                'teacher_id': teacher.id,
                'login_via_otp': True
            })

        except Teacher.DoesNotExist:
            return JsonResponse({'bool': False, 'msg': 'Invalid email or password'})

    return JsonResponse({'bool': False, 'msg': 'Invalid request method'})


@csrf_exempt
def verify_teacher_via_otp(request, teacher_id):
    if request.method != 'POST':
        return JsonResponse({'bool': False, 'msg': 'Invalid request method'})

    otp_digit = request.POST.get('otp_digit')

    if not otp_digit:
        return JsonResponse({'bool': False, 'msg': 'OTP is required'})

    try:
        teacher = Teacher.objects.get(id=teacher_id)

        if teacher.otp_digit == otp_digit and teacher.otp_digit is not None:
            teacher.verify_status = True
            teacher.otp_digit = None  # Clear OTP after verification
            teacher.save()

            return JsonResponse({
                'bool': True,
                'teacher_id': teacher.id,
                'login_via_otp': True
            })
        else:
            return JsonResponse({'bool': False, 'msg': 'Invalid or expired OTP'})

    except Teacher.DoesNotExist:
        return JsonResponse({'bool': False, 'msg': 'Teacher not found'})
    except Exception as e:
        return JsonResponse({'bool': False, 'msg': str(e)})

class CategoryList(generics.ListCreateAPIView):
    queryset = models.CourseCategory.objects.all()
    serializer_class = CategorySerializer

class CourseList(generics.ListCreateAPIView):
    serializer_class = CourseSerializer
    pagination_class = StandardResultSetPagination

    def post(self,request, *args, **kwargs):

        custom_data = request.data
        c=custom_data['category']

        cat=CourseCategory.objects.get(id=c)

        t=custom_data['teacher']

        te= Teacher.objects.get(id=t)

        ti=custom_data['title']
        d=custom_data['description']
        tec=custom_data['techs']
        img=custom_data['featured_img']
        c=Course.objects.create(category=cat, teacher=te, title=ti, description=d,techs=tec, featured_img=img )
        c.save()
        c=CourseSerializer(c)
        return Response(c.data)

    def get_queryset(self):
        qs = models.Course.objects.all()

        # Handle search string from URL parameter
        searchstring = self.kwargs.get('searchstring')
        if searchstring:
            # Search in title and description
            qs = qs.filter(
                Q(title__icontains=searchstring) |
                Q(description__icontains=searchstring) |
                Q(techs__icontains=searchstring)
            ).distinct()  # Added distinct() to avoid duplicates

        # Limit results if 'result' param is present
        if 'result' in self.request.GET:
            limit = int(self.request.GET.get('result', 0))
            qs = qs.order_by('-id')[:limit]

        # Filter by category
        if 'category' in self.request.GET:
            category = self.request.GET['category']
            category=models.CourseCategory.objects.filter(id=category).first()
            qs = qs.filter(category=category)

        # Filter by skill and teacher
        skill_name = self.request.GET.get('skill_name', '').strip()
        teacher_id = self.request.GET.get('teacher', '').strip()

        if skill_name and teacher_id:
            teacher = get_object_or_404(models.Teacher, id=teacher_id)
            qs = qs.filter(techs__icontains=skill_name, teacher=teacher)

        # Fetch recommended courses for a student
        student_id = self.kwargs.get('studentId')
        if student_id:
            try:
                student = models.Student.objects.get(pk=student_id)
                interested_categories = student.interested_categories

                if interested_categories:
                    query = Q()
                    for category in interested_categories:
                        query |= Q(techs__icontains=category)

                    qs = qs.filter(query)
            except models.Student.DoesNotExist:
                qs = models.Course.objects.none()

        return qs


class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Course.objects.all()
    serializer_class = CourseSerializer

class TeacherCourseDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Course.objects.all()
    serializer_class = CourseSerializer

class TeacherCourseList(generics.ListCreateAPIView):
    serializer_class = CourseSerializer

    def get_queryset(self):
        teacher_id = self.kwargs['teacher_id']
        teacher = models.Teacher.objects.get(pk=teacher_id)
        return models.Course.objects.filter(teacher=teacher)

class ChapterList(generics.ListCreateAPIView):
    queryset = models.Chapter.objects.all()
    serializer_class = ChapterSerializer

class CourseChapterList(generics.ListAPIView):
    serializer_class = ChapterSerializer

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        course = models.Course.objects.get(pk=course_id)
        return models.Chapter.objects.filter(course=course)

class ChapterDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Chapter.objects.all()
    serializer_class = ChapterSerializer


# Student Data
class StudentList(generics.ListCreateAPIView):
    queryset = models.Student.objects.all()
    serializer_class = StudentSerializer


@csrf_exempt
def student_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            student = Student.objects.get(email=email, password=password)

            # Generate new OTP for login
            import random
            otp_digit = str(random.randint(100000, 999999))
            student.otp_digit = otp_digit
            student.save()

            # Send OTP email
            subject = "Your Login OTP Code"
            message = f"""
Hello {student.full_name},

Your OTP for login is: {otp_digit}

This code is valid for one-time use. Please do not share it with anyone.

Thank you!
Learning Management System
            """
            from_email = settings.EMAIL_HOST_USER
            recipient_list = [student.email]

            try:
                send_mail(subject, message, from_email, recipient_list, fail_silently=False)
            except Exception as e:
                print(f"Error sending email: {e}")

            return JsonResponse({
                'bool': True,
                'student_id': student.id,
                'login_via_otp': True
            })

        except Student.DoesNotExist:
            return JsonResponse({'bool': False, 'msg': 'Invalid email or password'})

    return JsonResponse({'bool': False, 'msg': 'Invalid request method'})


@csrf_exempt
def verify_student_via_otp(request, student_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            otp_digit = str(data.get('otp_digit'))

            student = Student.objects.filter(id=student_id, otp_digit=otp_digit).first()

            if student:
                student.verify_status = True
                student.otp_digit = None  # Clear OTP after verification
                student.save()

                return JsonResponse({
                    'bool': True,
                    'student_id': student.id
                })
            else:
                return JsonResponse({'bool': False, 'msg': 'Invalid OTP'})

        except json.JSONDecodeError:
            return JsonResponse({'bool': False, 'msg': 'Invalid request format'}, status=400)
        except Exception as e:
            return JsonResponse({'bool': False, 'msg': str(e)}, status=400)

    return JsonResponse({'bool': False, 'msg': 'Invalid request method'})
class StudentEnrollCourseList(generics.ListCreateAPIView):
    queryset = models.StudentCourseEntrollment.objects.all()
    serializer_class = StudentCourseEnrollSerializer


def fetch_enroll_status(request,student_id,course_id):
    student=models.Student.objects.filter(id=student_id).first()
    course = models.Course.objects.filter(id=course_id).first()
    enrollStatus = models.StudentCourseEntrollment.objects.filter(course=course,student=student).count()
    if enrollStatus:
        return JsonResponse({'bool': True})
    else:
        return JsonResponse({'bool': False})


class StudentFavoriteCourseList(generics.ListCreateAPIView):
    serializer_class = StudentFavoriteCourseSerializer

    def get_queryset(self):
        student_id = self.kwargs.get('student_id')
        if student_id:
            try:
                student_id = int(student_id)
                return StudentFavoriteCourse.objects.filter(student_id=student_id, status=True).distinct()
            except ValueError:
                return StudentFavoriteCourse.objects.none()
        return StudentFavoriteCourse.objects.none()

    def get_queryset(self):
        student_id = self.kwargs.get('student_id')
        if student_id:
            try:
                student_id = int(student_id)
                return StudentFavoriteCourse.objects.filter(student_id=student_id).distinct()
            except ValueError:
                return StudentFavoriteCourse.objects.none()
        return StudentFavoriteCourse.objects.none()


def fetch_favorite_status(request, student_id, course_id):
    student = Student.objects.filter(id=student_id).first()
    course = Course.objects.filter(id=course_id).first()
    if student and course:
        favorite_status = StudentFavoriteCourse.objects.filter(course=course, student=student).first()
        return JsonResponse({'bool': favorite_status.status if favorite_status else False})
    return JsonResponse({'bool': False})



@csrf_exempt
def remove_favorite_course(request, course_id, student_id):
    student = Student.objects.filter(id=student_id).first()
    course = Course.objects.filter(id=course_id).first()
    if student and course:
        deleted, _ = StudentFavoriteCourse.objects.filter(course=course, student=student).delete()
        return JsonResponse({'bool': deleted > 0})
    return JsonResponse({'bool': False})

class EnrolledStudentList(generics.ListAPIView):
    queryset = models.StudentCourseEntrollment.objects.all()
    serializer_class = StudentCourseEnrollSerializer

    def get_queryset(self):
        if 'course_id' in self.kwargs:
            course_id = self.kwargs['course_id']
            course = models.Course.objects.get(pk=course_id)
            return models.StudentCourseEntrollment.objects.filter(course=course)
        elif 'teacher_id' in self.kwargs:
            teacher_id = self.kwargs['teacher_id']
            teacher = models.Teacher.objects.get(pk=teacher_id)
            return models.StudentCourseEntrollment.objects.filter(course__teacher=teacher).distinct()

        elif 'student_id' in self.kwargs:
            student_id = self.kwargs['student_id']
            student = models.Student.objects.get(pk=student_id)
            return models.StudentCourseEntrollment.objects.filter(student=student).distinct()


class CourseRatingList(generics.ListCreateAPIView):
    serializer_class = CourseRatingSerializer

    def get_queryset(self):
        if 'popular' in self.request.GET:
            sql=("SELECT *,AVG(cr.rating) as avg_rating FROM main_courserating as cr INNER JOIN main_course as c ON cr.course_id=c.id GROUP BY c.id ORDER BY avg_rating desc LIMIT 4")
            return models.CourseRating.objects.raw(sql)
        if 'all' in self.request.GET:
            sql=("SELECT *,AVG(cr.rating) as avg_rating FROM main_courserating as cr INNER JOIN main_course as c ON cr.course_id=c.id GROUP BY c.id ORDER BY avg_rating desc")
            return models.CourseRating.objects.raw(sql)
        return models.CourseRating.objects.filter(course__isnull=False).order_by('-rating')

    def create(self, request, *args, **kwargs):
        course_id = request.data.get('course')
        student_id = request.data.get('student')

        # Check if the student has already rated the course
        if models.CourseRating.objects.filter(course_id=course_id, student_id=student_id).exists():
            return JsonResponse({'error': 'You have already rated this course.'}, status=400)

        return super().create(request, *args, **kwargs)

def fetch_rating_status(request, student_id, course_id):
    rating_exists = models.CourseRating.objects.filter(course_id=course_id, student_id=student_id).exists()
    return JsonResponse({'bool': rating_exists})



@csrf_exempt
def teacher_change_password(request,teacher_id):
    password = request.POST.get('password')
    try:
        teacherData = models.Teacher.objects.get(id=teacher_id)
    except models.Teacher.DoesNotExist:
        teacherData = None
    if teacherData:
        models.Teacher.objects.filter(id=teacher_id).update(password=password)
        return JsonResponse({'bool':True})
    else:
        return JsonResponse({'bool': False})


# ===== views.py =====
from rest_framework import generics, status
from rest_framework.response import Response
from . import models
from .models import StudentAssignment, Teacher, Student
from .serializers import StudentAssignmentSerializer


class AssignmentList(generics.ListCreateAPIView):
    """Get assignments filtered by both teacher and student"""
    queryset = models.StudentAssignment.objects.all()
    serializer_class = StudentAssignmentSerializer

    def get_queryset(self):
        student_id = self.kwargs['student_id']
        teacher_id = self.kwargs['teacher_id']
        student = models.Student.objects.get(pk=student_id)
        teacher = models.Teacher.objects.get(pk=teacher_id)
        return models.StudentAssignment.objects.filter(student=student, teacher=teacher)


class MyAssignmentList(generics.ListCreateAPIView):
    queryset = StudentAssignment.objects.all()
    serializer_class = StudentAssignmentSerializer

    def get_queryset(self):
        """Filter assignments by student_id"""
        student_id = self.kwargs.get('student_id')
        return StudentAssignment.objects.filter(student_id=student_id).select_related('teacher', 'student')

    def perform_create(self, serializer):
        """Create assignment with proper error handling"""
        teacher_id = self.request.data.get("teacher")
        student_id = self.kwargs.get("student_id")

        try:
            teacher = Teacher.objects.get(pk=teacher_id)
            student = Student.objects.get(pk=student_id)
            serializer.save(teacher=teacher, student=student)
        except Teacher.DoesNotExist:
            return Response(
                {"error": "Teacher not found"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Student.DoesNotExist:
            return Response(
                {"error": "Student not found"},
                status=status.HTTP_400_BAD_REQUEST
            )


class UpdateAssignment(generics.UpdateAPIView):

    queryset = StudentAssignment.objects.all()
    serializer_class = StudentAssignmentSerializer
    lookup_field = 'pk'

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        # Update student_status
        instance.student_status = request.data.get("student_status", instance.student_status)
        instance.save()

        # Return updated data using serializer
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

class StudentDashboard(RetrieveAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentDashboardSerializer



class StudentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Student.objects.all()
    serializer_class = StudentSerializer

@csrf_exempt
def student_change_password(request,student_id):
    password = request.POST.get('password')
    try:
        studentData = models.Student.objects.get(id=student_id)
    except models.Student.DoesNotExist:
        studentData = None
    if studentData:
        models.Student.objects.filter(id=student_id).update(password=password)
        return JsonResponse({'bool':True})
    else:
        return JsonResponse({'bool': False})

class QuizList(generics.ListCreateAPIView):
    queryset = models.Quiz.objects.all()
    serializer_class = QuizSerializer

class TeacherQuizList(generics.ListCreateAPIView):
    serializer_class = QuizSerializer

    def get_queryset(self):
        teacher_id = self.kwargs['teacher_id']
        teacher = models.Teacher.objects.get(pk=teacher_id)
        return models.Quiz.objects.filter(teacher=teacher)

class TeacherQuizDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Quiz.objects.all()
    serializer_class = QuizSerializer

class QuizDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Quiz.objects.all()
    serializer_class = QuizSerializer

class QuizQuestionList(generics.ListCreateAPIView):
    serializer_class = QuizQuestionSerializer

    def get_queryset(self):
        quiz_id = self.kwargs['quiz_id']
        quiz = models.Quiz.objects.get(pk=quiz_id)
        if 'limit' in self.kwargs:
            return models.QuizQuestions.objects.filter(quiz=quiz).order_by('id')[:1]
        elif 'question_id' in self.kwargs:
            current_question=self.kwargs['question_id']
            return models.QuizQuestions.objects.filter(quiz=quiz,id__gt=current_question).order_by('id')[:1]
        else:
            return models.QuizQuestions.objects.filter(quiz=quiz)

    def perform_create(self, serializer):
        quiz_id = self.kwargs['quiz_id']
        quiz = models.Quiz.objects.get(pk=quiz_id)
        serializer.save(quiz=quiz)
class CourseQuizList(generics.ListCreateAPIView):
    queryset = models.CourseQuiz.objects.all()
    serializer_class = CourseQuizSerializer

    def get_queryset(self):
        course_id = self.kwargs.get('course_id')
        return models.CourseQuiz.objects.filter(course=course_id)

def fetch_quiz_assign_status(request,quiz_id,course_id):
    quiz=models.Quiz.objects.filter(id=quiz_id).first()
    course=models.Course.object.filter(id=course_id).first()
    assignStatus=models.CourseQuiz.object.filter(course=course,quiz=quiz).count()

    if assignStatus:
        return JsonResponse({'bool':True})
    else:
        return JsonResponse({'bool':False})


class AttemptQuizList(generics.ListCreateAPIView):
    queryset = models.AttemptQuiz.objects.all()
    serializer_class = AttemptQuizSerializer

    def get_queryset(self):
        if 'quiz_id' in self.kwargs:
            quiz_id = self.kwargs['quiz_id']
            quiz = get_object_or_404(models.Quiz, pk=quiz_id)
            student_ids = models.AttemptQuiz.objects.filter(quiz=quiz).values('student').distinct()

            result = []
            for student_id in student_ids:
                attempt = models.AttemptQuiz.objects.filter(
                    quiz=quiz,
                    student_id=student_id['student']
                ).first()
                if attempt:
                    result.append(attempt)

            return result
        return super().get_queryset()

    def get(self, request, *args, **kwargs):
        if 'quiz_id_for_result' in self.kwargs and 'student_id' in self.kwargs:
            quiz_id = self.kwargs['quiz_id_for_result']
            student_id = self.kwargs['student_id']

            quiz = get_object_or_404(models.Quiz, pk=quiz_id)
            student = get_object_or_404(models.Student, pk=student_id)

            total_questions = models.QuizQuestions.objects.filter(quiz=quiz).count()
            total_attempted_questions = models.AttemptQuiz.objects.filter(quiz=quiz, student=student).count()

            # Calculate correct answers
            correct_answers = 0
            attempts = models.AttemptQuiz.objects.filter(quiz=quiz, student=student)
            for attempt in attempts:
                if attempt.right_ans == attempt.question.right_ans:
                    correct_answers += 1

            return JsonResponse({
                'total_questions': total_questions,
                'attempted_questions': total_attempted_questions,
                'correct_answers': correct_answers
            })

        return super().get(request, *args, **kwargs)

def fetch_quiz_attempt_status(request, quiz_id, student_id):

    try:
        # Get the quiz
        quiz = models.Quiz.objects.filter(id=quiz_id).first()
        if not quiz:
            return JsonResponse({'error': 'Quiz not found'}, status=404)

        # Get the student
        student = models.Student.objects.filter(id=student_id).first()
        if not student:
            return JsonResponse({'error': 'Student not found'}, status=404)

        # Get all questions for this quiz
        quiz_questions = models.QuizQuestions.objects.filter(quiz=quiz)

        # Check if student has attempted any question from this quiz
        attempt_count = models.AttemptQuiz.objects.filter(
            student=student,
            question__in=quiz_questions
        ).count()

        if attempt_count > 0:
            return JsonResponse({'bool': True})
        else:
            return JsonResponse({'bool': False})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

#study Materials
class StudyMaterialList(generics.ListCreateAPIView):
    serializer_class = StudyMaterialSerializer

    def get_queryset(self):
        course_id = self.kwargs['course_id']
        course = models.Course.objects.get(pk=course_id)
        return models.StudyMaterial.objects.filter(course=course)

class StudyMaterialDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.StudyMaterial.objects.all()
    serializer_class = StudyMaterialSerializer

def update_view(request, course_id):
    course = get_object_or_404(models.Course, pk=course_id)
    course.course_views += 1  # Use the correct field name
    course.save()
    return JsonResponse({'views': course.course_views})

#Footer Options
class FAQList(generics.ListAPIView):
    queryset = models.FAQ.objects.all()
    serializer_class = FaqSerializer

class FlatPagesList(generics.ListAPIView):
    queryset =FlatPage.objects.all()
    serializer_class = FlatPagesSerializer

class FlatPagesDetail(generics.RetrieveAPIView):
    queryset = FlatPage.objects.all()
    serializer_class = FlatPagesSerializer

class ContactList(generics.ListCreateAPIView):
    queryset = models.Contact.objects.all()
    serializer_class = ContactSerializer

@csrf_exempt
def teacher_forgot_password(request):
    email=request.POST.get('email')
    verify=models.Teacher.objects.filter(email=email).first()
    if verify:
        link=f"http://localhost:3000/teacher-change-password/{verify.id}/"
        send_mail(
            'verify Account',
            'please verify your account',
            'abhishekmnair81@gmail.com',
            [email],
            fail_silently=False,
            html_message=f'<p> Your Otp is </p><p>{link}</p>'
        )
        return JsonResponse({'bool':True,'msg':'Please Check Your Email!!'})
    else:
        return JsonResponse({'bool':False,'msg':'Invalid Email!!'})

@csrf_exempt
def teacher_change_password(request,teacher_id):
    password = request.POST.get('password')
    verify=models.Teacher.objects.filter(id=teacher_id).first()
    if verify:
        models.Teacher.objects.filter(id=teacher_id).update(password=password)
        return JsonResponse({'bool':True,'msg':'Password has been changed'})
    else:
        return JsonResponse({'bool':False,'msg':'oops.....some error occure....!!'})


@csrf_exempt
def user_forgot_password(request):
    email=request.POST.get('email')
    verify=models.Student.objects.filter(email=email).first()
    if verify:
        link=f"http://localhost:3000/user-change-password/{verify.id}/"
        send_mail(
            'verify Account',
            'please verify your account',
            'abhishekmnair81@gmail.com',
            [email],
            fail_silently=False,
            html_message=f'<p> Your Otp is </p><p>{link}</p>'
        )
        return JsonResponse({'bool':True,'msg':'Please Check Your Email!!'})
    else:
        return JsonResponse({'bool':False,'msg':'Invalid Email!!'})

@csrf_exempt
def user_change_password(request, student_id):  # Changed from teacher_id to student_id
    password = request.POST.get('password')
    verify = models.Student.objects.filter(id=student_id).first()
    if verify:
        models.Student.objects.filter(id=student_id).update(password=password)
        return JsonResponse({'bool': True, 'msg': 'Password has been changed'})
    else:
        return JsonResponse({'bool': False, 'msg': 'Oops... some error occurred!'})

@csrf_exempt
def save_teacher_student_msg(request,teacher_id,student_id):
    teacher=models.Teacher.objects.get(id=teacher_id)
    student=models.Student.objects.get(id=student_id)
    msg_text = request.POST.get('msg_text')
    msg_from= request.POST.get('msg_from')
    msgRes=models.TeacherStudentChat.objects.create(
        teacher=teacher,
        student=student,
        msg_text=msg_text,
        msg_from=msg_from,
    )
    if msgRes:
        msgs=models.TeacherStudentChat.objects.filter(teacher=teacher,student=student).count()
        return JsonResponse({'bool': True, 'msg': 'Message has been Sent','total_msg':msgs})
    else:
        return JsonResponse({'bool': False, 'msg': 'Oops... some error occurred!'})

class MessageList(generics.ListAPIView):
    queryset = models.TeacherStudentChat.objects.all()
    serializer_class = TeacherStudentChatSerializer
    def get_queryset(self):
        teacher_id = self.kwargs['teacher_id']
        student_id = self.kwargs['student_id']
        teacher = models.Teacher.objects.get(pk=teacher_id)
        student = models.Student.objects.get(pk=student_id)
        return models.TeacherStudentChat.objects.filter(teacher=teacher, student=student).exclude(msg_text='')

@csrf_exempt
def save_teacher_student_group_msg(request,teacher_id):
    teacher=models.Teacher.objects.get(id=teacher_id)
    msg_text = request.POST.get('msg_text')
    msg_from= request.POST.get('msg_from')

    enrolledList=models.StudentCourseEntrollment.objects.filter(course__teacher=teacher).distinct()
    for enrolled in enrolledList:
        msgRes=models.TeacherStudentChat.objects.create(
            teacher=teacher,
            student=enrolled.student,
            msg_text=msg_text,
            msg_from=msg_from,
        )
    if msgRes:
        return JsonResponse({'bool': True, 'msg': 'Message has been Sent'})
    else:
        return JsonResponse({'bool': False, 'msg': 'Oops... some error occurred!'})

class  MyTeacherList(generics.ListAPIView):
    queryset = models.Course.objects.all()
    serializer_class = CourseSerializer

    def get_queryset(self):
        if 'student_id' in self.kwargs:
            student_id=self.kwargs['student_id']
            sql=(f"SELECT * FROM main_course as c, main_studentcourseentrollment as e, main_teacher as t WHERE c.teacher_id=t.id AND e.Course_id=c.id AND e.student_id={student_id}")
            qs=models.Course.objects.raw(sql)
            print(qs)
            return qs

@csrf_exempt
def save_teacher_student_group_msg_from_student(request, student_id):
    try:
        student = models.Student.objects.get(id=student_id)
        msg_text = request.POST.get('msg_text')
        msg_from = request.POST.get('msg_from')

        if not msg_text or not msg_from:
            return JsonResponse({'bool': False, 'msg': 'Missing required fields'})

        # Get courses using Django ORM instead of raw SQL
        courses = models.Course.objects.filter(
            studentcourseenrollment__student_id=student_id
        ).select_related('teacher')

        if not courses.exists():
            return JsonResponse({'bool': False, 'msg': 'No courses found for this student'})

        # Create messages for all courses
        created_messages = []
        for course in courses:
            msg = models.TeacherStudentChat.objects.create(
                teacher=course.teacher,
                student=student,
                msg_text=msg_text,
                msg_from=msg_from,
            )
            created_messages.append(msg)

        if created_messages:
            return JsonResponse({'bool': True, 'msg': 'Message has been sent to all teachers'})
        else:
            return JsonResponse({'bool': False, 'msg': 'Failed to send messages'})

    except models.Student.DoesNotExist:
        return JsonResponse({'bool': False, 'msg': 'Student not found'})
    except Exception as e:
        return JsonResponse({'bool': False, 'msg': f'Error: {str(e)}'})