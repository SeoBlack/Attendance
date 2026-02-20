import {Navigate, Outlet, useLocation} from "react-router-dom";
import {AppBar, Box, CssBaseline, Drawer, IconButton, Toolbar, Typography,} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {useState} from "react";
import {Menu} from "../components/layout/Menu";
import {getMenuElements} from "./menuElements";
import {checkAuth} from "../auth/checkAuth";

const drawerWidth = 220;

function PrivateLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const authData = checkAuth()
  if (!authData) {
    return <Navigate to="/" replace />;
  }


  const menuRoutes = getMenuElements(authData.role)

  const computeTitle = (pathname: string) => {
    return menuRoutes
      .filter(p => pathname === p.path || pathname.startsWith(p.path + "/"))
      .sort((a, b) => b.path.length - a.path.length)
      ?.[0]?.label || "N/A";
  };

  const headerTitle = computeTitle(location.pathname);


  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const drawer = <Menu currentPath={location.pathname} elements={menuRoutes} />

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