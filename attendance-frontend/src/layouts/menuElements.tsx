import type { ReactNode } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import HistoryIcon from "@mui/icons-material/History";
import { USER_ROLE } from "../api/auth";

export type MenuRoute = {
  path: string;
  labelKey: string;
  icon: ReactNode;
};

const studentRoutes: MenuRoute[] = [
  {
    path: "/student/dashboard",
    labelKey: "menu.dashboard",
    icon: <DashboardIcon />,
  },
  {
    path: "/student/history",
    labelKey: "menu.history",
    icon: <HistoryIcon />,
  },
];

const teacherRoutes: MenuRoute[] = [
  {
    path: "/teacher/dashboard",
    labelKey: "menu.dashboard",
    icon: <DashboardIcon />,
  },
  {
    path: "/teacher/courses",
    labelKey: "menu.courses",
    icon: <PlayCircleOutlineIcon />,
  },
  {
    path: "/teacher/lectures",
    labelKey: "menu.lectures",
    icon: <PlayCircleOutlineIcon />,
  },
];

export function getMenuElements(role: USER_ROLE): MenuRoute[] {
  if (role === USER_ROLE.STUDENT) return studentRoutes;
  if (role === USER_ROLE.TEACHER) return teacherRoutes;
  return [];
}
