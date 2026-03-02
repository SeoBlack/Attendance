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
import TeacherLecturesPage from "./pages/teacher/lectures/LecturesPage";
import TeacherLectureDashboardPage from "./pages/teacher/lectures/LectureDashboardPage";
import {USER_ROLE} from "./api/auth";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/storybook" element={<StoryBookPage />} />
      </Route>
      <Route element={<PrivateLayout requiresRole={USER_ROLE.STUDENT} />} path="student" >
        <Route path="dashboard" element={<StudentDashboardPage />} />
        <Route path="attendance" element={<StudentAttendancePage />} />
        <Route path="history" element={<StudentAttendanceHistoryPage />} />
      </Route>
      <Route element={<PrivateLayout requiresRole={USER_ROLE.TEACHER} />} path="teacher">
        <Route path="dashboard" element={<TeacherDashboardPage />} />
        <Route path="courses" element={<TeacherCoursesPage />} />
        <Route path="courses/create" element={<TeacherCreateCoursePage />} />
        <Route path="courses/update/:id" element={<TeacherCreateCoursePage />} />
        <Route path="lectures" element={<TeacherLecturesPage />} />
        <Route path="lectures/:id" element={<TeacherLectureDashboardPage />} />
      </Route>
    </Routes>
  )
}

export default App
