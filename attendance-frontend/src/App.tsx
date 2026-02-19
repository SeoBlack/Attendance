import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import StoryBookPage from './pages/StoryBook'
import SignupPage from "./pages/SignupPage";
import PublicLayout from "./layouts/public";
import PrivateLayout from "./layouts/private";


import StudentDashboardPage from "./pages/student/DashboardPage";
import StudentAttendancePage from "./pages/student/AttendancePage";
import StudentAttendanceHistoryPage from "./pages/student/AttendanceHistoryPage";

import TeacherDashboardPage from "./pages/teacher/DashboardPage";
import TeacherCoursesPage from "./pages/teacher/courses/CoursesPage";
import TeacherCreateCoursePage from "./pages/teacher/courses/CreateCoursePage";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/storybook" element={<StoryBookPage />} />
      </Route>
      <Route element={<PrivateLayout />}>
        <Route path="/student/dashboard" element={<StudentDashboardPage />} />
        <Route path="/student/attendance" element={<StudentAttendancePage />} />
        <Route path="/student/history" element={<StudentAttendanceHistoryPage />} />

        <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
        <Route path="/teacher/courses" element={<TeacherCoursesPage />} />
        <Route path="/teacher/courses/create" element={<TeacherCreateCoursePage />} />
      </Route>
    </Routes>
  )
}

export default App
