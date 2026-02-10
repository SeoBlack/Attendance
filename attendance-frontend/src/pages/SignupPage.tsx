import {useEffect, useMemo, useState} from 'react';
import {
  Alert,
  Box,
  FormControl, InputLabel, MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';

import { ActionButton, FormTextField } from '../components/common';
import {USER_ROLE} from "../api/auth";
import {useNavigate} from "react-router-dom";
import {api} from "../api";

const userRoleOptions = Object.entries(USER_ROLE).map(([rk, role]) => <MenuItem key={rk} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</MenuItem>)
export default function SignupPage() {
  const navigate = useNavigate();


  const [signupError, setSignupError] = useState('');

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordsMismatch, setPasswordsMismatch] = useState(false);

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState(USER_ROLE.STUDENT);

  const [emailValid, setEmailValid] = useState(true);
  const [firstNameValid, setFirstNameValid] = useState(true);
  const [lastNameValid, setLastNameValid] = useState(true);
  const [roleValid, setRoleValid] = useState(true);

  const formValid = useMemo(() => {
    return emailValid && firstNameValid && lastNameValid && roleValid && !passwordsMismatch;
  }, [emailValid, firstNameValid, lastNameValid, roleValid, passwordsMismatch])

  useEffect(()=> {
    setPasswordsMismatch((password?.trim() || "") === "" || password !== passwordConfirm);
  }, [password, passwordConfirm])
  const validateForm = () => {
    setEmailValid(email.trim() !== "");
    setFirstNameValid(firstName.trim() !== "");
    setLastNameValid(lastName.trim() !== "");
    setRoleValid(role !== "" as USER_ROLE);
  }

  useEffect(() => {
    validateForm()
  }, [email, firstName, lastName, role])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.auth.requestSignup({
      email, password,
      firstName, lastName,
      role: role as USER_ROLE,
    }).then(async resp => {
      if(!resp.ok) setSignupError(await resp?.text() || "An unknown error occurred. Please try again later.")
      else navigate("/")
    }).catch(_ => {
      setSignupError("An unknown error occurred. Please try again later.")
    })
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >

      <Box
        sx={{
          flex: { md: '1 1 50%' },
          minHeight: { xs: '100vh', md: 'auto' },
          bgcolor: 'background.form',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
        }}
      >

        <Box
          component="form" onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: 400,
            p: 4,
          }}
        >
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" component="h1" fontWeight={700} color="text.primary" sx={{ fontFamily: 'inherit' }}>
                Sign up
              </Typography>
            </Box>
            {
              signupError ? (
                <Alert severity="error">{signupError}</Alert>
              ): null
            }

            <FormControl fullWidth>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                value={role}
                label="Role"
                onChange={e => setRole(e.target.value as USER_ROLE)}
                error={!roleValid}
              >
                {userRoleOptions}
              </Select>
            </FormControl>

            <FormTextField
              label="First name" type="text" name="firstName" placeholder="Your first name" value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              error={!firstNameValid}
            />
            <FormTextField
              label="Last name" type="text" name="lastName" placeholder="Your last name" value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              error={!lastNameValid}
            />

            <FormTextField
              label="Email" type="email" name="email" autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={!emailValid}
            />
            <FormTextField
              label="Password" type="password" name="password" autoComplete="new-password" placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              slotProps={{ htmlInput: {"data-testid": "password" }}}
              error={passwordsMismatch}
            />
            <FormTextField
              label="Confirm password" type="password" name="password-confirm"  placeholder="Enter your password again"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
              slotProps={{ htmlInput: {"data-testid": "password-confirm" }}}
              error={passwordsMismatch}
              helperText={passwordsMismatch ? "Passwords do not match!" : ""}

            />

            <ActionButton
              type="submit" fullWidth size="large" color="brand"
              disabled={!formValid}
            >
              Create account
            </ActionButton>

          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
