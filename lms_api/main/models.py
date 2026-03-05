from django.db import models
from django.core import serializers
from django.db.models import Avg

from django.core.mail import send_mail
class Teacher(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100, blank=True, null=True)
    qualification = models.CharField(max_length=200)
    mobile_no = models.CharField(max_length=20)
    profile_img = models.ImageField(upload_to='teacher_profile_imgs/', null=True)
    skills = models.TextField()
    verify_status=models.BooleanField(default=False)
    otp_digit = models.CharField(max_length=10,null=True)
    login_via_otp=models.BooleanField(default=True)

    facebook_url=models.URLField(null=True)
    twitter_url=models.URLField(null=True)
    instagram_url=models.URLField(null=True)
    website_url=models.URLField(null=True)

    class Meta:
        verbose_name_plural = '1. Teacher'

    def skill_list(self):
        return [skill.strip() for skill in self.skills.split(',') if skill.strip()]

    def total_teacher_courses(self):
        return Course.objects.filter(teacher=self).count()

    def total_teacher_chapters(self):
        return Chapter.objects.filter(course__teacher=self).count()

    def total_teacher_students(self):
        return StudentCourseEntrollment.objects.filter(course__teacher=self).count()


    def __str__(self):
        return self.full_name

class CourseCategory(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField()

    class Meta:
        verbose_name_plural = '2. Course Categories'


    def total_courses(self):
        return Course.objects.filter(category=self).count()

    def __str__(self):
        return self.title

class Course(models.Model):
    category = models.ForeignKey(CourseCategory, null=True ,on_delete=models.CASCADE, related_name='category_courses')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, null=True ,related_name='teacher_courses')
    title = models.CharField(max_length=150)
    description = models.TextField()
    featured_img = models.ImageField(upload_to='course_imgs/', null=True)
    techs = models.TextField(null=True)
    course_views = models.BigIntegerField(default=0)

    class Meta:
        verbose_name_plural = '3. Course'


    def related_videos(self):
        related_videos=Course.objects.filter(techs__icontains=self.techs)
        return serializers.serialize('json',related_videos)

    def tech_list(self):
        tech_list=self.techs.split(',')
        return tech_list

    def __str__(self):
        return self.title

    def total_enrolled_students(self):
        total_enrolled_students=StudentCourseEntrollment.objects.filter(course=self).count()
        return total_enrolled_students

    def course_rating(self):
        course_rating=CourseRating.objects.filter(course=self).aggregate(avg_rating=models.Avg('rating'))
        return course_rating['avg_rating']

    def avg_rating(self):
        return self.courserating_set.aggregate(Avg('rating'))['rating__avg'] or 0

class Chapter(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='course_chapters')
    title = models.CharField(max_length=150)
    description = models.TextField()
    video = models.FileField(upload_to='chapter_videos/', null=True)
    remarks = models.TextField(null=True)

    class Meta:
        verbose_name_plural = '4. Chapters'

    def __str__(self):
        return self.title

class Student(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    username = models.CharField(max_length=200)
    interested_categories = models.TextField()
    profile_img = models.ImageField(upload_to='student_profile_imgs/', null=True)
    verify_status = models.BooleanField(default=False)
    otp_digit = models.CharField(max_length=10, null=True)
    login_via_otp = models.BooleanField(default=0)


    def enrolled_courses(self):
        enrolled_courses = StudentCourseEntrollment.objects.filter(student=self).count()
        return enrolled_courses

    def favorite_courses(self):
        favorite_courses = StudentFavoriteCourse.objects.filter(student=self).count()
        return favorite_courses

    def complete_assignments(self):
        complete_assignments = StudentAssignment.objects.filter(student=self,student_status=True).count()
        return complete_assignments

    class Meta:
        verbose_name_plural = '5. Student'

    def __str__(self):
        return self.full_name

class StudentCourseEntrollment(models.Model):
    course = models.ForeignKey(Course,on_delete=models.CASCADE,related_name='enrolled_courses')
    student = models.ForeignKey(Student,on_delete=models.CASCADE,related_name='enrolled_students')
    enrolled_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = '6. Enrollde Courses'

    def __str__(self):
        return f"{self.course}-{self.student}"


from django.db import models

class StudentFavoriteCourse(models.Model):
    course = models.ForeignKey('Course', on_delete=models.CASCADE)
    student = models.ForeignKey('Student', on_delete=models.CASCADE)
    status = models.BooleanField(default=False)

    class Meta:
        unique_together = ('course', 'student')

    class Meta:
        verbose_name_plural = '7. Student Favorate Courses'

        def __str__(self):
            return f"{self.course}-{self.student}"


class CourseRating(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(default=0)
    review = models.TextField(null=True)
    review_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.course}-{self.student}-{self.rating}"

    class Meta:
        verbose_name_plural = '8. Course_rating'

class StudentAssignment(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE,null=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE,null=True)
    title = models.CharField(max_length=200)
    detail = models.TextField(null=True)
    student_status=models.BooleanField(default=False,null=True)
    add_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title}"

    class Meta:
        verbose_name_plural = '9. Student Assignments'


class Quiz(models.Model):
    teacher = models.ForeignKey(Teacher,on_delete=models.CASCADE,null=True)
    title = models.CharField(max_length=200)
    detail = models.TextField()
    add_time = models.DateTimeField(auto_now_add=True)

    def assign_status(self):

        return CourseQuiz.objects.filter(quiz=self).count()

    def __str__(self):
        return f"{self.title}"

    class Meta:
        verbose_name_plural = '11. Quiz Model'


class QuizQuestions(models.Model):
    quiz = models.ForeignKey(Quiz,on_delete=models.CASCADE,null=True)
    question = models.CharField(max_length=200)
    ans1 = models.CharField(max_length=200)
    ans2 = models.CharField(max_length=200)
    ans3 = models.CharField(max_length=200)
    ans4 = models.CharField(max_length=200)
    right_ans = models.CharField(max_length=200)
    add_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = '12. Quiz Question'


class CourseQuiz(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, null=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True)
    quiz = models.ForeignKey(Quiz,on_delete=models.CASCADE,null=True)
    add_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = '13. Course Quiz'


class AttemptQuiz(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, null=True)
    question = models.ForeignKey(QuizQuestions, on_delete=models.CASCADE, null=True)
    right_ans = models.CharField(max_length=200, null=True)  # This stores the student's answer
    add_time = models.DateTimeField(auto_now_add=True)

    def is_correct(self):
        """Check if the student's answer matches the correct answer"""
        if self.question and self.right_ans:
            return self.right_ans == self.question.right_ans
        return False

    def __str__(self):
        return f"{self.student}-{self.quiz}-{self.question}-{self.right_ans}"

    class Meta:
        verbose_name_plural = '14. Attempted Questions'


class StudyMaterial(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    description = models.TextField()
    upload = models.FileField(upload_to='study_materials/', null=True)
    remarks = models.TextField(null=True)

    def __str__(self):
        return f"{self.title}"

    class Meta:
        verbose_name_plural = '15. Course StudyMaterials'

class FAQ(models.Model):
    question = models.CharField(max_length=300)
    answer = models.TextField()

    def __str__(self):
        return f"{self.question}"

    class Meta:
        verbose_name_plural = '16. FAQ'


class Contact(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    query_txt = models.TextField()
    add_time=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.query_txt}"

    def save(self,*args,**kwargs):
        send_mail(
            'Contact Query',
            'Here is the message',
            'abhishekmnair81@gmail.com',
            [self.email],
            fail_silently=False,
            html_message=f'<p>{self.full_name}</p><p>{self.query_txt}</p>'
        )
        return super(Contact,self).save(*args,**kwargs)

    class Meta:
        verbose_name_plural = '17. Contact Queries'

class TeacherStudentChat(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE )
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    msg_text=models.TextField()
    msg_from=models.CharField(max_length=100)
    msg_time=models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = '18. Teacher Student Messages'

