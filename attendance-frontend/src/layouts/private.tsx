import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import StudentMenu from "./StudentMenu";

const drawerWidth = 220;

function PrivateLayout() {
  // NOTE: Replace with real auth check later
  const token = document.cookie || "test"; // TODO: Get actual token
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const routeTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/courses": "Courses",
    "/lecture": "Lecture Session",
    "/statistics": "Statistics",
    "/profile": "Profile",
    "/settings": "Settings",
  };

  const computeTitle = (pathname: string) => {
    if (routeTitles[pathname]) return routeTitles[pathname];
    const matches = Object.keys(routeTitles)
      .filter((key) => pathname === key || pathname.startsWith(key + "/"))
      .sort((a, b) => b.length - a.length);
    return matches[0] ? routeTitles[matches[0]] : "";
  };

  const headerTitle = computeTitle(location.pathname) || "";


  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const drawer = <StudentMenu />
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow: 0,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {headerTitle}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          // Shift main content to the right so it doesn't overlap the permanent drawer
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default PrivateLayout;