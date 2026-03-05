from rest_framework import serializers
from .models import (Teacher, CourseCategory, Course, Chapter, Student ,
                     StudentCourseEntrollment, CourseRating,
                     StudentFavoriteCourse,StudentAssignment,
                     Quiz,QuizQuestions,CourseQuiz,AttemptQuiz,
                     StudyMaterial,FAQ,Contact,TeacherStudentChat)
from django.contrib.flatpages.models import FlatPage
from django.db.models import Avg
from django.core.mail import send_mail
from django.conf import settings
import random


class TeacherSerializer(serializers.ModelSerializer):
    skill_list = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = [
            'id', 'full_name', 'email', 'password', 'qualification', 'mobile_no',
            'profile_img', 'skills', 'skill_list', 'total_teacher_courses', 'otp_digit',
            'login_via_otp','facebook_url','twitter_url','instagram_url','website_url'
        ]

    def get_skill_list(self, obj):
        return obj.skill_list()

    def create(self, validated_data):
        email = validated_data['email']

        # Generate a 6-digit OTP
        import random
        otp_digit = str(random.randint(100000, 999999))
        validated_data['otp_digit'] = otp_digit

        # Create teacher instance
        instance = super().create(validated_data)

        # Send OTP email
        subject = "Verify Your Account - OTP Code"
        message = f"""
        Hello {instance.full_name},

        Your OTP for account verification is: {otp_digit}

        This code will expire after verification. Please do not share it with anyone.

        Thank you!
        Learning Management System
        """
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [email]

        try:
            send_mail(subject, message, from_email, recipient_list, fail_silently=False)
        except Exception as e:
            print(f"Error sending email: {e}")

        return instance


class TeacherDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ['total_teacher_courses','total_teacher_chapters','total_teacher_students']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseCategory
        fields = ['id', 'title', 'description','total_courses']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'category', 'teacher', 'title', 'description', 'featured_img', 'techs', 'course_chapters','related_videos', 'tech_list','total_enrolled_students','course_rating','avg_rating']
        depth = 1

    def get_avg_rating(self, obj):
        return obj.courserating_set.aggregate(Avg('rating'))['rating__avg'] or 0

class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ['id', 'course', 'title', 'description', 'video', 'remarks']


class CourseRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseRating
        fields = ['id', 'course', 'student','rating', 'review','review_time']

    def __init__(self,*args,**kwargs):
        super(CourseRatingSerializer,self).__init__(*args,**kwargs)
        request = self.context.get('request')
        self.Meta.depth = 0
        if request and request.method =='GET':
            self.Meta.depth = 2


class StudentFavoriteCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentFavoriteCourse
        fields = '__all__'
        depth = 2  # Add depth to include full course details

    def create(self, validated_data):
        # Get data from request.data directly if not in validated_data
        request = self.context.get('request')
        course_id = validated_data.get('course') or request.data.get('course')
        student_id = validated_data.get('student') or request.data.get('student')

        # Get the actual model instances
        course = Course.objects.get(id=course_id)
        student = Student.objects.get(id=student_id)

        # Ensure the course is only favorited once per student
        favorite, created = StudentFavoriteCourse.objects.get_or_create(
            course=course,
            student=student,
            defaults={'status': True}  # Set status to True when creating
        )
        if not created:
            favorite.status = True  # Update status if already exists
            favorite.save()
        return favorite


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'full_name', 'email', 'username', 'password','login_via_otp' ,'interested_categories', 'profile_img', 'otp_digit','login_via_otp']

        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'otp_digit': {'read_only': True},
        }


    # Fixed: create method should be outside Meta class, at the same level
    def create(self, validated_data):
        email = validated_data['email']

        # Generate a 6-digit OTP
        import random
        otp_digit = str(random.randint(100000, 999999))
        validated_data['otp_digit'] = otp_digit

        # Create student instance
        instance = super().create(validated_data)

        # Send OTP email
        subject = "Verify Your Student Account - OTP Code"
        message = f"""
Hello {instance.full_name},

Your OTP for student account verification is: {otp_digit}

This code will expire after verification. Please do not share it with anyone.

Thank you!
Learning Management System
        """
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [email]

        try:
            send_mail(subject, message, from_email, recipient_list, fail_silently=False)
        except Exception as e:
            print(f"Error sending email: {e}")
            # You might want to log this error properly

        return instance

    def update(self, instance, validated_data):
        # Remove password from validated_data if it's not provided
        validated_data.pop('password', None)
        return super().update(instance, validated_data)



class StudentCourseEnrollSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentCourseEntrollment
        fields = ['id', 'course', 'student','enrolled_time']
    def __init__(self,*args, **kwargs):
        super(StudentCourseEnrollSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        self.Meta.depth = 0
        if request and request.method == 'GET':
            self.Meta.depth = 2

class StudentAssignmentSerializer(serializers.ModelSerializer):
    teacher = TeacherSerializer(read_only=True)

    class Meta:
        model = StudentAssignment
        fields = ['id', 'teacher', 'student', 'title', 'detail', 'add_time', 'student_status']


    def validate(self, data):
        if not data.get('title'):
            raise serializers.ValidationError("Title is required.")
        if not data.get('detail'):
            raise serializers.ValidationError("Detail is required.")
        return data

#student dashboard
class StudentDashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['enrolled_courses','favorite_courses','complete_assignments']


class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id',
                  'teacher', 'title', 'detail','assign_status',
                  'add_time']
    def __init__(self,*args,**kwargs):
        super(QuizSerializer,self).__init__(*args,**kwargs)
        request = self.context.get('request')
        self.Meta.depth=0
        if request and request.method == 'GET':
            self.Meta.depth=2

class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestions
        fields = ['id','quiz','question', 'ans1', 'ans2', 'ans3', 'ans4', 'right_ans']


class CourseQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseQuiz
        fields = ['id', 'teacher', 'course', 'quiz', 'add_time']

    def __init__(self, *args, **kwargs):
        super(CourseQuizSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        self.Meta.depth = 0
        if request and request.method == 'GET':
            self.Meta.depth = 2


class AttemptQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttemptQuiz
        fields = ['id', 'student','quiz', 'question', 'right_ans','add_time']

    def __init__(self, *args, **kwargs):
        super(AttemptQuizSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        self.Meta.depth = 0
        if request and request.method == 'GET':
            self.Meta.depth = 2

#study Material Seri
class StudyMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyMaterial
        fields = ['id', 'course', 'title', 'description', 'upload', 'remarks']

    def __init__(self,*args,**kwargs):
        super(StudyMaterialSerializer,self).__init__(*args,**kwargs)
        request = self.context.get('request')
        self.Meta.depth = 0
        if request and request.method == 'GET':
            self.Meta.depth=1

#Footer options
class FaqSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['question', 'answer']

class FlatPagesSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlatPage
        fields = ['id', 'title', 'content', 'url']

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'full_name', 'email', 'query_txt']

class TeacherStudentChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherStudentChat
        fields = ['id', 'teacher', 'student', 'msg_text', 'msg_from', 'msg_time']

    def to_representation(self, instance):
        representation = super(TeacherStudentChatSerializer, self).to_representation(instance)
        representation['msg_time'] = instance.msg_time.strftime("%y-%m-%d %H:%M")
        return representation