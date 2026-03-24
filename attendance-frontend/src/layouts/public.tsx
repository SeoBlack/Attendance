import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import LanguageSelector from "../components/common/LanguageSelector";

function PublicLayout() {
  return (
    <Box>
      <LanguageSelector />
      <Outlet />
    </Box>
  );
}

export default PublicLayout;
