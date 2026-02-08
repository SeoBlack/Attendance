import {useEffect, useMemo, useState} from 'react';
import {
  Box,
  FormControl, InputLabel, MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';

import { ActionButton, FormTextField } from '../components/common';
import {requestSignup, USER_ROLE} from "../api/auth";
import {redirect} from "react-router-dom";

const userRoleOptions = Object.entries(USER_ROLE).map(([rk, role]) => <MenuItem key={rk} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</MenuItem>)

export default function SignupPage() {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordsMismatch, setPasswordsMismatch] = useState(false);

  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState(USER_ROLE.STUDENT);
  const [studentId, setStudentId] = useState('');

  const [emailValid, setEmailValid] = useState(true);
  const [firstNameValid, setFirstNameValid] = useState(true);
  const [lastNameValid, setLastNameValid] = useState(true);
  const [roleValid, setRoleValid] = useState(true);
  const [studentIdValid, setStudentIdValid] = useState(true);

  const formValid = useMemo(() => {
    return emailValid && firstNameValid && lastNameValid && roleValid && studentIdValid && !passwordsMismatch;
  }, [emailValid, firstNameValid, lastNameValid, roleValid, studentIdValid, passwordsMismatch])

  useEffect(()=> {
    setPasswordsMismatch((password?.trim() || "") === "" || password !== passwordConfirm);
  })
  const validateForm = () => {
    setEmailValid(email.trim() !== "");
    setFirstNameValid(firstName.trim() !== "");
    setLastNameValid(lastName.trim() !== "");
    setRoleValid(role !== "" as USER_ROLE);
    setStudentIdValid(role === USER_ROLE.STUDENT && studentId.trim() !== "");
  }

  useEffect(() => {
    validateForm()
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestSignup({
      email, password,
      firstName, lastName,
      role: role as USER_ROLE,
      studentId
    }).then(res => {
      redirect("/login")
      // TODO: Handle failures
      // TODO: Redirect to login with message on success
    }).catch(e => {
      // TODO: add toast
      console.error(e)
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

            <FormControl fullWidth>
              <InputLabel id="role-select-label">Role</InputLabel>
              <Select
                labelId="role-select-label"
                value={role}
                label="Select role"
                onChange={e => setRole(e.target.value)}
                error={!studentIdValid}
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

            {
              role === USER_ROLE.STUDENT ?
                (
                  <FormTextField
                  label="Student ID" type="text" name="studentId" placeholder="Enter your student ID" value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                  error={!studentIdValid}
                  />
                )
                : null
            }


            <FormTextField
              label="Email" type="email" name="email" autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={!emailValid}
            />
            <FormTextField
              label="Password" type="password" name="password" autoComplete="current-password" placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              error={passwordsMismatch}
            />
            <FormTextField
              label="Confirm password" type="password" name="password"  placeholder="Enter your password again"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
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
