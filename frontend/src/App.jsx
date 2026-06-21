
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import HeroSection from './pages/student/HeroSection'
import Courses from './pages/student/Courses'
import MyLearning from './pages/student/MyLearning'
import Profile from './pages/student/Profile'
import CourseDetail from './pages/student/CourseDetail'
import CourseProgress from './pages/student/CourseProgress'
import SearchPage from './pages/student/SearchPage'
import PaymentSuccess from './pages/student/PaymentSuccess'
import Certificate from './pages/student/Certificate'
import Leaderboard from './pages/student/Leaderboard'
import { ThemeProvider } from './components/ThemeProvider'
import ProtectedRoute from './components/ProtectedRoute'
import PurchaseCourseProtectedRoute from './components/PurchaseCourseProtectedRoute'
import Dashboard from './pages/instructor/Dashboard'
import CourseTable from './pages/instructor/course/CourseTable'
import AddCourse from './pages/instructor/course/AddCourse'
import EditCourse from './pages/instructor/course/EditCourse'
import CreateLecture from './pages/instructor/lecture/CreateLecture'
import EditLecture from './pages/instructor/lecture/EditLecture'
import { useLoadUserQuery } from './features/api/authApi'
import AdminDashboard from './pages/admin/AdminDashboard'
import Analytics from './pages/instructor/Analytics'
import Portfolio from './pages/student/Portfolio'
import QADashboard from './pages/instructor/QADashboard'

const MainLayout = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-16">
      <Outlet />
    </div>
  </div>
)

const InstructorLayout = () => (
  <ProtectedRoute>
    <MainLayout />
  </ProtectedRoute>
)

const StudentLayout = () => (
  <ProtectedRoute>
    <MainLayout />
  </ProtectedRoute>
)

const AppContent = () => {
  const { isLoading } = useLoadUserQuery()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <RouterProvider router={appRouter} />
}

const appRouter = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <HeroSection />
            <Courses />
          </>
        )
      },
      { path: "/login", element: <Login /> },
      { path: "/course/search", element: <SearchPage /> },
      {
        path: "/my-learning",
        element: <ProtectedRoute><MyLearning /></ProtectedRoute>
      },
      {
        path: "/profile",
        element: <ProtectedRoute><Profile /></ProtectedRoute>
      },
      {
        path: "/leaderboard",
        element: <ProtectedRoute><Leaderboard /></ProtectedRoute>
      },
      {
        path: "/course-detail/:courseId",
        element: <ProtectedRoute><CourseDetail /></ProtectedRoute>
      },
      {
        path: "/payment-success",
        element: <ProtectedRoute><PaymentSuccess /></ProtectedRoute>
      },
      {
        path: "/certificate/:courseId",
        element: (
          <ProtectedRoute>
            <PurchaseCourseProtectedRoute>
              <Certificate />
            </PurchaseCourseProtectedRoute>
          </ProtectedRoute>
        )
      },
      
      {
        path: "/instructor",
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>
      },
      {
        path: "/instructor/analytics",
        element: <ProtectedRoute><Analytics /></ProtectedRoute>
      },
      {
        path: "/instructor/qa",
        element: <ProtectedRoute><QADashboard /></ProtectedRoute>
      },
      {
        path: "/instructor/course",
        element: <ProtectedRoute><CourseTable /></ProtectedRoute>
      },
      {
        path: "/instructor/course/create",
        element: <ProtectedRoute><AddCourse /></ProtectedRoute>
      },
      {
        path: "/instructor/course/:courseId",
        element: <ProtectedRoute><EditCourse /></ProtectedRoute>
      },
      {
        path: "/instructor/course/:courseId/lecture",
        element: <ProtectedRoute><CreateLecture /></ProtectedRoute>
      },
      {
        path: "/instructor/course/:courseId/lecture/:lectureId",
        element: <ProtectedRoute><EditLecture /></ProtectedRoute>
      },
      
      {
        path: "/admin/dashboard",
        element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>
      },
      {
        path: "/u/:userId",
        element: <Portfolio />
      },
    ]
  },
  
  {
    path: "/course-progress/:courseId",
    element: (
      <ProtectedRoute>
        <PurchaseCourseProtectedRoute>
          <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-16">
              <CourseProgress />
            </div>
          </div>
        </PurchaseCourseProtectedRoute>
      </ProtectedRoute>
    )
  }
])

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" storageKey="lms-theme" disableTransitionOnChange>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
