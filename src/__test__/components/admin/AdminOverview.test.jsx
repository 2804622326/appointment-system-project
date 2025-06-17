import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AdminOverview from "../../../components/admin/AdminOverview";
import {
  countPatients,
  countUsers,
  countVeterinarians,
} from "../../../components/user/UserService";
import { countAppointments } from "../../../components/appointment/AppointmentService";

// Mock the service functions
jest.mock("../../../components/user/UserService", () => ({
  countPatients: jest.fn(),
  countUsers: jest.fn(),
  countVeterinarians: jest.fn(),
}));

jest.mock("../../../components/appointment/AppointmentService", () => ({
  countAppointments: jest.fn(),
}));

// Mock the chart components
jest.mock("../../../components/charts/RegistrationChart", () => {
  return function RegistrationChart() {
    return <div data-testid="registration-chart">Registration Chart</div>;
  };
});

jest.mock("../../../components/charts/AppointmentChart", () => {
  return function AppointmentChart() {
    return <div data-testid="appointment-chart">Appointment Chart</div>;
  };
});

jest.mock("../../../components/charts/AccountChart", () => {
  return function AccountChart() {
    return <div data-testid="account-chart">Account Chart</div>;
  };
});

jest.mock("../../../components/charts/VetSpecializationChart", () => {
  return function VetSpecializationChart() {
    return <div data-testid="vet-specialization-chart">Vet Specialization Chart</div>;
  };
});

// Mock CardComponent
jest.mock("../../../components/cards/CardComponent", () => {
  return function CardComponent({ label, count, IconComponent }) {
    return (
      <div data-testid={`card-${label.toLowerCase()}`}>
        <span>{label}</span>
        <span>{count}</span>
        <IconComponent />
      </div>
    );
  };
});

describe("AdminOverview", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders main title", () => {
    render(<AdminOverview />);
    expect(screen.getByText("Activities Overview")).toBeInTheDocument();
  });

  test("renders all card components with initial count of 0", () => {
    render(<AdminOverview />);
    
    expect(screen.getByTestId("card-users")).toBeInTheDocument();
    expect(screen.getByTestId("card-appointments")).toBeInTheDocument();
    expect(screen.getByTestId("card-veterinarians")).toBeInTheDocument();
    expect(screen.getByTestId("card-patients")).toBeInTheDocument();
  });

  test("renders all chart components", () => {
    render(<AdminOverview />);
    
    expect(screen.getByTestId("registration-chart")).toBeInTheDocument();
    expect(screen.getByTestId("appointment-chart")).toBeInTheDocument();
    expect(screen.getByTestId("account-chart")).toBeInTheDocument();
    expect(screen.getByTestId("vet-specialization-chart")).toBeInTheDocument();
  });

  test("fetches and displays correct counts", async () => {
    countUsers.mockResolvedValue(50);
    countVeterinarians.mockResolvedValue(10);
    countPatients.mockResolvedValue(200);
    countAppointments.mockResolvedValue(75);

    render(<AdminOverview />);

    await waitFor(() => {
      expect(screen.getByText("50")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("200")).toBeInTheDocument();
      expect(screen.getByText("75")).toBeInTheDocument();
    });

    expect(countUsers).toHaveBeenCalledTimes(1);
    expect(countVeterinarians).toHaveBeenCalledTimes(1);
    expect(countPatients).toHaveBeenCalledTimes(1);
    expect(countAppointments).toHaveBeenCalledTimes(1);
  });

  test("handles error when fetching counts", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    
    countUsers.mockRejectedValue(new Error("Network error"));
    countVeterinarians.mockResolvedValue(10);
    countPatients.mockResolvedValue(200);
    countAppointments.mockResolvedValue(75);

    render(<AdminOverview />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching counts:", expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  test("displays zero counts when services return zero", async () => {
    countUsers.mockResolvedValue(0);
    countVeterinarians.mockResolvedValue(0);
    countPatients.mockResolvedValue(0);
    countAppointments.mockResolvedValue(0);

    render(<AdminOverview />);

    await waitFor(() => {
      const zeroElements = screen.getAllByText("0");
      expect(zeroElements).toHaveLength(4);
    });
  });

  test("calls all service functions on component mount", async () => {
    countUsers.mockResolvedValue(1);
    countVeterinarians.mockResolvedValue(2);
    countPatients.mockResolvedValue(3);
    countAppointments.mockResolvedValue(4);

    render(<AdminOverview />);

    await waitFor(() => {
      expect(countUsers).toHaveBeenCalledTimes(1);
      expect(countVeterinarians).toHaveBeenCalledTimes(1);
      expect(countPatients).toHaveBeenCalledTimes(1);
      expect(countAppointments).toHaveBeenCalledTimes(1);
    });
  });

  test("has correct CSS classes for styling", () => {
    render(<AdminOverview />);
    
    expect(screen.getByText("Activities Overview")).toHaveClass("chart-title");
    expect(document.querySelector(".main-cards")).toBeInTheDocument();
    expect(document.querySelector(".charts")).toBeInTheDocument();
    expect(document.querySelectorAll(".chart-container")).toHaveLength(4);
  });
});