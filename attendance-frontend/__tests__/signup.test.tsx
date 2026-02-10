import {fireEvent, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import SignupPage from "../src/pages/SignupPage";
import {BrowserRouter} from "react-router-dom";
import { api } from "../src/api";

// Mock navigate to observe successful redirection
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockedNavigate,
  };
});

afterEach(() => {
  jest.restoreAllMocks();
  mockedNavigate.mockReset();
});

test('loads and displays signup page', async () => {
  render(
    <BrowserRouter>
      <SignupPage />
    </BrowserRouter>
  )

  expect(screen.getByRole('heading')).toHaveTextContent('Sign up')
  let inputs = screen.getAllByRole('textbox')
  expect(inputs).toHaveLength(3) // Passwords omitted for simplicity
  inputs.forEach(input => {expect(input).toBeRequired(); expect(input).toBeInvalid()})

  expect(screen.getByText('Create account')).toBeDisabled()
})

function fillGoodForm(){
  let inputs = screen.getAllByRole('textbox')

  fireEvent.change(inputs[0], {target: {value: "John"}})
  fireEvent.change(inputs[1], {target: {value: "Doe"}})
  fireEvent.change(inputs[2], {target: {value: "test@test.com"}})

  fireEvent.change(screen.getByTestId("password") as HTMLElement, {target: {value: "123456789"}})
  fireEvent.change(screen.getByTestId("password-confirm") as HTMLElement, {target: {value: "123456789"}})

}

test('successfully submits filled form and redirects to /', async () => {
  jest
    .spyOn(api.auth, 'requestSignup')
    .mockResolvedValue({ ok: true, text: async () => '' } as any);

  render(
    <BrowserRouter>
      <SignupPage />
    </BrowserRouter>
  )
  fillGoodForm()

  let submitBtn = screen.getByText('Create account')
  expect(submitBtn).not.toBeDisabled()
  await userEvent.click(submitBtn)
  await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith("/"))
})

test('shows relevant message when request fails', async () => {
  const serverError = "Some error from server"
  jest
    .spyOn(api.auth, 'requestSignup')
    .mockResolvedValue({ ok: false, text: async () => serverError } as any);

  render(
    <BrowserRouter>
      <SignupPage />
    </BrowserRouter>
  )
  fillGoodForm()

  let submitBtn = screen.getByText('Create account')
  expect(submitBtn).not.toBeDisabled()
  await userEvent.click(submitBtn)
  await screen.findByText(serverError)
  expect(mockedNavigate).not.toHaveBeenCalled()
})