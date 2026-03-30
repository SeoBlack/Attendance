import { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Link,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SecurityIcon from "@mui/icons-material/Security";
import { ActionButton, FormTextField } from "../components/common";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../auth/checkAuth";
import { api } from "../api";
import { setToken } from "../auth/token";
import { useTranslation } from "react-i18next";

const FEATURE_KEYS = [
  { icon: QrCode2Icon, labelKey: "login.featureQr" as const },
  { icon: TrendingUpIcon, labelKey: "login.featureAnalytics" as const },
  { icon: SecurityIcon, labelKey: "login.featureSecurity" as const },
] as const;

export default function LoginPage() {
  const navigate = useNavigate();

  const [signinError, setSigninError] = useState("");
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const mapSigninError = (status: number): string => {
    if (status === 401) return t("errors.invalidCredentials");
    return t("errors.unknown");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.auth
      .signIn({ email, password })
      .then(async (resp) => {
        setSigninError("");
        if (!resp.ok) {
          setSigninError(mapSigninError(resp.status));
        } else {
          let jresp = await resp.json();
          if (!jresp.token) return setSigninError(t("errors.unknown"));
          setToken(jresp.token);
          let user = checkAuth();
          if (!user) return setSigninError(t("errors.unknown"));
          navigate(`/${user.role}/dashboard`);
        }
      })
      .catch((_) => {
        setSigninError(t("errors.unknown"));
      });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box
        sx={{
          flex: { md: "1 1 50%" },
          minHeight: { xs: "auto", md: "100vh" },
          bgcolor: "brand.main",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          py: { xs: 4, md: 6 },
        }}
      >
        <Stack spacing={3} alignItems="center" sx={{ maxWidth: 360 }}>
          <SchoolIcon sx={{ fontSize: 64, color: "brand.contrastText" }} />
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              component="span"
              sx={{
                fontWeight: 700,
                color: "brand.contrastText",
                fontFamily: "inherit",
                letterSpacing: "-0.02em",
              }}
            >
              aTendy
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "brand.contrastText",
                mt: 1,
                opacity: 0.95,
                fontSize: "1rem",
              }}
            >
              {t("productDescription")}
            </Typography>
          </Box>
          <Stack spacing={2} sx={{ width: "100%", mt: 2 }}>
            {FEATURE_KEYS.map(({ icon: Icon, labelKey }) => (
              <Box
                key={labelKey}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Icon
                  sx={{
                    fontSize: 24,
                    color: "brand.contrastText",
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{ color: "brand.contrastText", fontWeight: 500 }}
                >
                  {t(labelKey)}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          flex: { md: "1 1 50%" },
          minHeight: { xs: "100vh", md: "auto" },
          bgcolor: "background.form",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            maxWidth: 400,
            p: 4,
          }}
        >
          <Stack spacing={3}>
            {signinError ? <Alert severity="error">{signinError}</Alert> : null}
            <Box>
              <Typography
                variant="h4"
                component="h1"
                fontWeight={700}
                color="text.primary"
                sx={{ fontFamily: "inherit" }}
              >
                {t("login.welcomeBack")}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {t("login.signInSubtitle")}
              </Typography>
            </Box>

            <FormTextField
              label={t("login.email")}
              type="email"
              name="email"
              autoComplete="email"
              placeholder={t("login.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <FormTextField
              label={t("login.password")}
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder={t("login.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    name="remember"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" color="text.primary">
                    {t("login.rememberMe")}
                  </Typography>
                }
              />
              <Link href="#" variant="body2" underline="hover" color="link">
                {t("login.forgotPassword")}
              </Link>
            </Box>

            <ActionButton type="submit" fullWidth size="large" color="brand">
              {t("login.signIn")}
            </ActionButton>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              {t("login.noAccount")}{" "}
              <Link href="/signup" underline="hover" color="link">
                {t("login.signUp")}
              </Link>
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
