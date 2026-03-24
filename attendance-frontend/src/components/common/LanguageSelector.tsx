import { LanguageSharp } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleChangeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    handleCloseMenu();
  };

  return (
    <Box>
      <IconButton color="inherit" onClick={handleOpenMenu} aria-label="change language">
        <LanguageSharp />
      </IconButton>
      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleCloseMenu}>
        <MenuItem onClick={() => handleChangeLanguage("en")}>English</MenuItem>
        <MenuItem onClick={() => handleChangeLanguage("hi")}>Hindi</MenuItem>
        <MenuItem onClick={() => handleChangeLanguage("ru")}>Russian</MenuItem>
      </Menu>
    </Box>
  );
}
