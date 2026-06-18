<div align="center">
  
  <br/>
  <h1>🎓 EduTrack LMS</h1>
  <p><strong>A Full-Stack Learning Management System built with the MERN Stack</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white" alt="Stripe" />
    <img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101" alt="Socket.io" />
  </p>
</div>

---

## 🚀 Overview
**EduTrack** is a comprehensive, production-ready Learning Management System (LMS) designed to bridge the gap between expert instructors and eager learners. It features real-time engagement, secure video streaming, automated course enrollments, and a beautiful, modern user interface.

## ✨ Key Features

### 👨‍🎓 For Students
* **Course Catalog & Search**: Browse, filter, and search through a rich catalog of courses.
* **Seamless Video Learning**: Smooth video playback with progress tracking to pick up exactly where you left off.
* **Instant Payments & Enrollment**: Powered by Stripe webhooks for instant access upon purchase.
* **Real-time Q&A**: Ask questions directly within course modules and receive live answers using WebSockets.
* **Certificates of Completion**: Automatically generated custom PDF certificates upon finishing a course.

### 👨‍🏫 For Instructors
* **Course Builder Dashboard**: An intuitive interface to create courses, upload video lectures, and build curriculums.
* **Automated Video Processing**: Cloudinary integration for scalable, optimized video hosting.
* **Sales Analytics**: Track enrollments, revenue, and student engagement from a centralized dashboard.
* **Interactive Quizzes**: Build in-course quizzes to test student knowledge.

---

## 🛠️ Technology Stack

* **Frontend**: React (Vite), Redux Toolkit (RTK Query), Tailwind CSS v4, Shadcn UI
* **Backend**: Node.js, Express.js
* **Database**: MongoDB (Mongoose)
* **Media Storage**: Cloudinary (Image & Video Hosting)
* **Real-time**: Socket.io (WebSockets)
* **Payments**: Stripe Checkout & Webhooks

---

## 💻 Running Locally

### 1. Clone the repository
```bash
git clone https://github.com/Samyak-Waghmare/eduTrack.git
cd eduTrack
```

### 2. Install dependencies
Open two terminals. One for the frontend, one for the backend.

```bash
# Terminal 1: Frontend
cd frontend
npm install

# Terminal 2: Backend
cd backend
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the **backend** directory:
```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=your_stripe_test_key
```

### 4. Start the Application

```bash
# Terminal 1: Start Frontend
cd frontend
npm run dev

# Terminal 2: Start Backend
cd backend
npm run dev
```

The application will now be running on `http://localhost:5173`.

---

<div align="center">
  <i>Built with passion by Samyak Waghmare</i>
</div>
