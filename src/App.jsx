import React from "react";
import { render, screen } from "@testing-library/react";
import {
  createMemoryRouter,
  RouterProvider,
  createRoutesFromElements,
  Route
} from "react-router-dom";
import RootLayout from "../components/layout/RootLayout";
import Home from "../components/home/Home";
import VeterinarianListing from "../components/veterinarian/VeterinarianListing";
import UserRegistration from "../components/user/UserRegistration";
import Login from "../components/auth/Login";
import AdminDashboard from "../components/admin/AdminDashboard";

const routes = createRoutesFromElements(
  <Route path="/" element={<RootLayout />} errorElement={<h1>Not Found</h1>}>
    <Route index element={<Home />} />
    <Route path="doctors" element={<VeterinarianListing />} />
    <Route path="register-user" element={<UserRegistration />} />
    <Route path="login" element={<Login />} />
    <Route path="admin-dashboard/:userId/admin-dashboard" element={<AdminDashboard />} />
  </Route>
);

function renderWithRouter(initialEntries) {
  const router = createMemoryRouter(routes, { initialEntries });
  return render(<RouterProvider router={router} />);
}

describe("App Routing", () => {
  test("renders Home component on default route", async () => {
    renderWithRouter(["/"]);
    expect(await screen.findByText(/home page/i)).toBeInTheDocument();
  });

  test("renders VeterinarianListing component on /doctors", async () => {
    renderWithRouter(["/doctors"]);
    expect(await screen.findByText(/listing page/i)).toBeInTheDocument();
  });

  test("renders UserRegistration component on /register-user", async () => {
    renderWithRouter(["/register-user"]);
    expect(await screen.findByText(/registration page/i)).toBeInTheDocument();
  });

  test("renders Login component on /login", async () => {
    renderWithRouter(["/login"]);
    expect(await screen.findByText(/login page/i)).toBeInTheDocument();
  });

  test("renders AdminDashboard component on /admin-dashboard", async () => {
    renderWithRouter(["/admin-dashboard/1/admin-dashboard"]);
    expect(await screen.findByText(/admin dashboard page/i)).toBeInTheDocument();
  });

  test("renders Not Found on unknown route", async () => {
    renderWithRouter(["/unknown-route"]);
    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });
});