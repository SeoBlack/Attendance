import { LanguageSharp } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();
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
    localStorage.setItem("language", language);
    handleCloseMenu();
  };

  return (
    <Box>
      <IconButton
        color="inherit"
        onClick={handleOpenMenu}
        aria-label={t("language.changeLanguage")}
      >
        <LanguageSharp />
      </IconButton>
      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleCloseMenu}>
        <MenuItem onClick={() => handleChangeLanguage("en")}>
          {t("language.english")}
        </MenuItem>
        <MenuItem onClick={() => handleChangeLanguage("ar")}>
          {t("language.arabic")}
        </MenuItem>
        <MenuItem onClick={() => handleChangeLanguage("ru")}>
          {t("language.russian")}
        </MenuItem>
        <MenuItem onClick={() => handleChangeLanguage("fi")}>
          {t("language.finnish")}
        </MenuItem>
      </Menu>
    </Box>
  );
}
