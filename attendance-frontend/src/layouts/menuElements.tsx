import DashboardIcon from "@mui/icons-material/Dashboard";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import {USER_ROLE} from "../api/auth";


const studentRoutes = [
  { path: "/student/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  { path: "/student/attendance", label: "Attendance", icon: <PlayCircleOutlineIcon /> },
  { path: "/student/history", label: "History", icon: <PlayCircleOutlineIcon /> },
]
const teacherRoutes = [
  { path: "/teacher/dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  { path: "/teacher/courses", label: "Courses", icon: <PlayCircleOutlineIcon /> },
  { path: "/teacher/lectures", label: "Lectures", icon: <PlayCircleOutlineIcon /> },
]

export function getMenuElements(role: USER_ROLE) {
  if(role === USER_ROLE.STUDENT) return studentRoutes;
  if(role === USER_ROLE.TEACHER) return teacherRoutes;
  return [];
}