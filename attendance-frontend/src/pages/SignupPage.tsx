import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import { ActionButton, FormTextField } from "../components/common";
import { USER_ROLE } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useTranslation } from "react-i18next";

export default function SignupPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [signupError, setSignupError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordsMismatch, setPasswordsMismatch] = useState(false);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState(USER_ROLE.STUDENT);

  const [emailValid, setEmailValid] = useState(true);
  const [firstNameValid, setFirstNameValid] = useState(true);
  const [lastNameValid, setLastNameValid] = useState(true);
  const [roleValid, setRoleValid] = useState(true);

  const userRoleOptions = [
    <MenuItem key={USER_ROLE.STUDENT} value={USER_ROLE.STUDENT}>
      {t("role.student")}
    </MenuItem>,
    <MenuItem key={USER_ROLE.TEACHER} value={USER_ROLE.TEACHER}>
      {t("role.teacher")}
    </MenuItem>,
  ];

  const formValid = useMemo(() => {
    return (
      emailValid &&
      firstNameValid &&
      lastNameValid &&
      roleValid &&
      !passwordsMismatch
    );
  }, [emailValid, firstNameValid, lastNameValid, roleValid, passwordsMismatch]);

  useEffect(() => {
    setPasswordsMismatch(
      (password?.trim() || "") === "" || password !== passwordConfirm,
    );
  }, [password, passwordConfirm]);

  const validateForm = () => {
    setEmailValid(email.trim() !== "");
    setFirstNameValid(firstName.trim() !== "");
    setLastNameValid(lastName.trim() !== "");
    setRoleValid(role !== ("" as USER_ROLE));
  };

  useEffect(() => {
    validateForm();
  }, [email, firstName, lastName, role]);

  const unknownError = () => t("errors.unknown");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.auth
      .requestSignup({
        email,
        password,
        firstName,
        lastName,
        role: role as USER_ROLE,
      })
      .then(async (resp) => {
        if (!resp.ok)
          setSignupError((await resp?.text()) || unknownError());
        else navigate("/");
      })
      .catch((_) => {
        setSignupError(unknownError());
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
            <Box>
              <Typography
                variant="h4"
                component="h1"
                fontWeight={700}
                color="text.primary"
                sx={{ fontFamily: "inherit" }}
              >
                {t("signup.title")}
              </Typography>
            </Box>
            {signupError ? (
              <Alert severity="error">{signupError}</Alert>
            ) : null}

            <FormControl fullWidth>
              <InputLabel id="role-select-label">{t("signup.role")}</InputLabel>
              <Select
                labelId="role-select-label"
                value={role}
                label={t("signup.role")}
                onChange={(e) => setRole(e.target.value as USER_ROLE)}
                error={!roleValid}
              >
                {userRoleOptions}
              </Select>
            </FormControl>

            <FormTextField
              label={t("signup.firstName")}
              type="text"
              name="firstName"
              placeholder={t("signup.firstNamePlaceholder")}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              error={!firstNameValid}
            />
            <FormTextField
              label={t("signup.lastName")}
              type="text"
              name="lastName"
              placeholder={t("signup.lastNamePlaceholder")}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              error={!lastNameValid}
            />

            <FormTextField
              label={t("signup.email")}
              type="email"
              name="email"
              autoComplete="email"
              placeholder={t("signup.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={!emailValid}
            />
            <FormTextField
              label={t("signup.password")}
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder={t("signup.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              slotProps={{ htmlInput: { "data-testid": "password" } }}
              error={passwordsMismatch}
            />
            <FormTextField
              label={t("signup.confirmPassword")}
              type="password"
              name="password-confirm"
              placeholder={t("signup.confirmPasswordPlaceholder")}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              slotProps={{ htmlInput: { "data-testid": "password-confirm" } }}
              error={passwordsMismatch}
              helperText={passwordsMismatch ? t("signup.passwordsMismatch") : ""}
            />

            <ActionButton
              type="submit"
              fullWidth
              size="large"
              color="brand"
              disabled={!formValid}
            >
              {t("signup.createAccount")}
            </ActionButton>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
