import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../../../components/auth/Login";
import { loginUser } from "../../../components/auth/AuthService";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation, Link } from "react-router-dom";

jest.mock("../../../components/auth/AuthService", () => ({
  loginUser: jest.fn(),
}));

jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: {} }),
    Link: ({ children }) => <span>{children}</span>,
  };
});

beforeAll(() => {
  delete window.location;
  window.location = { reload: jest.fn() };
});

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

test("renders login form fields and button", () => {
  render(<Login />);
  expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
});

test("shows error when submitting empty fields", async () => {
  render(<Login />);
  fireEvent.click(screen.getByRole("button", { name: /login/i }));
  expect(await screen.findByText(/please, enter a valid username and paasword/i)).toBeInTheDocument();
});

test("successful login calls services, stores tokens and navigates", async () => {
  const fakeToken = "fake.jwt.token";
  loginUser.mockResolvedValue({ token: fakeToken });
  jwtDecode.mockReturnValue({ roles: ["USER"], id: "123" });

  render(<Login />);

  fireEvent.change(screen.getByLabelText(/Username/i), {
    target: { value: "user@example.com", name: "email" },
  });
  fireEvent.change(screen.getByLabelText(/Password/i), {
    target: { value: "password123", name: "password" },
  });
  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  await waitFor(() => {
    expect(loginUser).toHaveBeenCalledWith("user@example.com", "password123");
    expect(localStorage.getItem("authToken")).toBe(fakeToken);
    expect(localStorage.getItem("userRoles")).toBe(JSON.stringify(["USER"]));
    expect(localStorage.getItem("userId")).toBe("123");
    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    expect(window.location.reload).toHaveBeenCalled();
  });
});

test("displays server error message on login failure", async () => {
  const serverMessage = "Invalid credentials";
  loginUser.mockRejectedValue({
    response: { data: { message: serverMessage } },
  });

  render(<Login />);

  fireEvent.change(screen.getByLabelText(/Username/i), {
    target: { value: "baduser", name: "email" },
  });
  fireEvent.change(screen.getByLabelText(/Password/i), {
    target: { value: "badpass", name: "password" },
  });
  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  expect(await screen.findByText(serverMessage)).toBeInTheDocument();
});

test("redirects on mount if already authenticated", () => {
  localStorage.setItem("authToken", "existing.token");
  render(<Login />);
  expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
});