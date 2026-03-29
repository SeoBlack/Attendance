import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import LanguageSelector from "../components/common/LanguageSelector";

function PublicLayout() {
  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      <Box
        sx={{
          position: "absolute",
          top: 16,
          insetInlineEnd: 16,
          zIndex: 1,
        }}
      >
        <LanguageSelector />
      </Box>
      <Outlet />
    </Box>
  );
}

export default PublicLayout;
