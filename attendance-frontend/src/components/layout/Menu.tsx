import { NavLink} from "react-router-dom";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";



export function Menu({currentPath, elements}: {currentPath: string, elements: Array<any>}) {

  const menuItems = elements.map(({ path, label, icon }) => (
    <ListItem disablePadding key={path}>
      <ListItemButton component={NavLink} to={path} selected={currentPath === path}>
        <ListItemIcon>
          {icon}
        </ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  ))

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          aTendy
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flex: 1 }}>
        {menuItems}
      </List>
    </Box>
  );

}
