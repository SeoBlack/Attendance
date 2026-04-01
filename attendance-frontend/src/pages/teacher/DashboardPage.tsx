import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function DashboardPage() {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography component="h1" variant="h5">
        {t("teacher.dashboard.welcome")}
      </Typography>
    </Box>
  );
}

export default DashboardPage;
