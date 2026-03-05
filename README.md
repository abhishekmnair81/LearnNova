<div align="center">

# 🎓 LearnNova

### *Where Knowledge Meets Innovation*

[![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

> **LearnNova** is a full-stack Learning Management System (LMS) that empowers teachers to create world-class online courses and students to learn at their own pace — featuring live video consultations, interactive quizzes, real-time messaging, and much more.

</div>

---

## ✨ Features at a Glance

| 🧑‍🏫 For Teachers | 🎓 For Students |
|---|---|
| Create & manage courses | Enroll in courses |
| Upload video chapters | Watch video lessons |
| Create & assign quizzes | Take interactive quizzes |
| Assign student work | Submit & track assignments |
| Upload study materials | Access study materials |
| Real-time student messaging | Chat with teachers |
| Live video consultations | Join video sessions |
| View enrolled students | Track course progress |
| Profile & social links | Personalized dashboard |
| OTP-based authentication | Secure email verification |

---

## 🚀 Tech Stack

### 🔙 Backend
- **[Django](https://www.djangoproject.com/)** — Robust Python web framework
- **[Django REST Framework](https://www.django-rest-framework.org/)** — Powerful REST API toolkit
- **SQLite** — Lightweight embedded database (easy to swap to PostgreSQL)
- **Django Channels / WebRTC** — Real-time video & chat support
- **SMTP Email** — OTP verification & contact form emails

### 🖥️ Frontend
- **[React 19](https://reactjs.org/)** — Cutting-edge UI library
- **[React Router v7](https://reactrouter.com/)** — Client-side routing
- **[Axios](https://axios-http.com/)** — HTTP client for REST API calls
- **[Bootstrap 5](https://getbootstrap.com/)** — Responsive layout framework
- **[Material UI (MUI)](https://mui.com/)** — Polished component library
- **[SweetAlert2](https://sweetalert2.github.io/)** — Beautiful popup dialogs
- **[Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)** — Icon libraries
- **[Font Awesome](https://fontawesome.com/)** — Icon toolkit

---

## 📸 Project Structure

```
LearnNova/
├── lms_api/                  # Django Backend
│   ├── main/
│   │   ├── models.py         # 18 data models
│   │   ├── views.py          # REST API views
│   │   ├── serializers.py    # DRF serializers
│   │   ├── urls.py           # API routes
│   │   └── admin.py          # Admin panel config
│   └── lms_api/
│       └── settings.py       # Django settings
│
└── lms_frontend/             # React Frontend
    └── src/
        └── components/
            ├── Teacher/      # 34 teacher components
            ├── User/         # 21 student components
            └── (shared)      # Header, Footer, Home, etc.
```

---

## 🗂️ Core Data Models

```
Teacher       ─── teaches ──▶  Course  ◀─── enrolled by ─── Student
     │                           │
     │                      has Chapters
     │                      has StudyMaterials
     │                      has CourseQuiz ──▶ Quiz ──▶ QuizQuestions
     │
     └─── TeacherStudentChat ◀──▶ Student
     └─── StudentAssignment  ──▶  Student
```

| Model | Description |
|---|---|
| `Teacher` | Educator with profile, skills, social links, OTP auth |
| `Student` | Learner with interests, profile, email verification |
| `Course` | Full course with category, tech tags, rating system |
| `Chapter` | Video lesson with description & remarks |
| `CourseCategory` | Categorize courses for browsing |
| `StudentCourseEnrollment` | Tracks who enrolled in what |
| `StudentFavoriteCourse` | Bookmarked courses for students |
| `CourseRating` | Star rating + review system per course |
| `Quiz` | Teacher-created quizzes |
| `QuizQuestions` | MCQ questions with 4 options & correct answer |
| `CourseQuiz` | Assigns a quiz to a specific course |
| `AttemptQuiz` | Records each student's quiz answers |
| `StudyMaterial` | Uploaded PDFs/documents per course |
| `StudentAssignment` | Teacher-assigned work with completion tracking |
| `TeacherStudentChat` | Real-time messaging history |
| `FAQ` | Site-wide FAQ entries |
| `Contact` | Contact form with auto-email reply |
| `CourseRating` | Course review and star rating |

---

## 🔐 Authentication System

LearnNova uses a **dual OTP-based authentication** system for both Teachers and Students:

- 📧 **OTP Email Verification** — On registration, a One-Time Password is sent to the user's email
- 🔐 **Login via OTP** — Supports passwordless OTP login as an option
- 🔑 **Password Reset** — "Forgot Password" flow with OTP verification
- ✅ **Verify Status** — Unverified accounts are blocked from accessing the platform

---

## 🎥 Video Consultations

LearnNova features **real-time video calling** between teachers and students using **WebRTC**:

- Peer-to-peer video/audio streaming
- Live session joining for enrolled students
- Doctor/specialist consultation interface (extensible for any domain)

---

## 💬 Real-Time Messaging

Teachers and students can **chat directly** within the platform:

- One-on-one chat between teacher and student
- Persistent message history stored in the database
- View all message threads from dashboard

---

## 🧠 Interactive Quiz Engine

- Teachers can **create, edit, and assign** multiple-choice quizzes to courses
- Each quiz has multiple questions with **4 answer choices** and 1 correct answer
- Students can **take quizzes** and immediately see results
- Teachers can view **attempted students** and scores
- Prevents retaking already-attempted quizzes

---

## ⭐ Course Rating & Review System

- Students can **rate and review** courses they're enrolled in
- Courses display **average ratings** dynamically
- Helps surface the best content across the platform

---

## 🏗️ Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+ & npm
- pip

---

### 🔧 Backend Setup

```bash
# Clone the repo
git clone https://github.com/abhishekmnair81/LearnNova.git
cd LearnNova/lms_api

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (for admin panel access)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

The backend API will be live at: **`http://localhost:8000`**
Django Admin panel: **`http://localhost:8000/admin`**

---

### ⚛️ Frontend Setup

```bash
# Navigate to frontend
cd ../lms_frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will be live at: **`http://localhost:3000`**

---

## 🛣️ API Highlights

The backend exposes a RESTful API via Django REST Framework:

| Endpoint Pattern | Description |
|---|---|
| `/teacher/` | Teacher registration & login |
| `/student/` | Student registration & login |
| `/courses/` | Course listing, detail, search |
| `/chapters/` | Chapter listing per course |
| `/quiz/` | Quiz creation, assignment, attempt |
| `/study-materials/` | Upload & access study docs |
| `/assignments/` | Assign & retrieve student work |
| `/messages/` | Chat messages between teacher & student |
| `/contact/` | Contact form submission |
| `/faq/` | Frequently asked questions |
| `/ratings/` | Course ratings & reviews |

---

## 🧑‍💼 Admin Panel

LearnNova's Django admin is fully configured with descriptive plural names for all 18 models:

- Manage Teachers, Students, Courses, Chapters
- View Quiz attempts and results
- Monitor enrollments and ratings
- Respond to contact queries
- Manage FAQs

---

## 📬 Contact & Email Integration

LearnNova has built-in **email handling** via Django's `send_mail`:

- Auto-replies to contact form submissions
- OTP emails for registration and password reset

Configure your email settings in `lms_api/settings.py`:

```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Abhishek M Nair**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/abhishekmnair81)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:abhishekmnair81@gmail.com)

---

<div align="center">

**⭐ If you found LearnNova useful, please star the repo — it means a lot!**

*Built with ❤️ using Django & React*

</div>
