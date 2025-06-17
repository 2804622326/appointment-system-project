import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import PatientComponent from "../../../components/admin/PatientComponent";
import { getPatients } from "../../../patient/PatientService";

// Mock external dependencies
jest.mock("../../../patient/PatientService", () => ({
  getPatients: jest.fn(),
}));

jest.mock("../../../hooks/UseMessageAlerts", () => () => ({
  successMessage: "",
  setSuccessMessage: jest.fn(),
  errorMessage: "",
  setErrorMessage: jest.fn(),
  showSuccessAlert: false,
  setShowSuccessAlert: jest.fn(),
  showErrorAlert: false,
  setShowErrorAlert: jest.fn(),
}));

// Minimal stubs for child components
jest.mock("../../../common/AlertMessage", () => () => <div>AlertMessage</div>);
jest.mock("../../../user/UserFilter", () => (props) => (
  <div>
    <span>UserFilter</span>
    <button onClick={props.onClearFilters}>Clear Filters</button>
  </div>
));
jest.mock("../../../common/Paginator", () => (props) => (
  <div>
    Paginator - Page {props.currentPage} / {Math.ceil(props.totalItems / props.itemsPerPage)}
    <button onClick={() => props.paginate(props.currentPage + 1)}>Next</button>
  </div>
));
jest.mock("../../../common/NoDataAvailable", () => (props) => (
  <div>NoDataAvailable: {props.dataType}</div>
));

describe("PatientComponent", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders patients table when data is available", async () => {
    const patientsMock = [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phoneNumber: "123456789",
        gender: "Male",
        createdAt: "2023-10-01",
      },
    ];
    getPatients.mockResolvedValue({ data: patientsMock });

    render(
      <MemoryRouter>
        <PatientComponent />
      </MemoryRouter>
    );

    // Wait for the effect to update the state.
    await waitFor(() => {
      expect(screen.getByText("List of Patients")).toBeInTheDocument();
    });
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
  });

  test("renders NoDataAvailable when there are no patients", async () => {
    getPatients.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <PatientComponent />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/NoDataAvailable:/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/patients data/)).toBeInTheDocument();
  });

  test("handles pagination correctly with more than one page of patients", async () => {
    // Create 11 patients to trigger pagination (patientsPerPage is 10)
    const patientsMock = Array.from({ length: 11 }, (_, index) => ({
      id: index + 1,
      firstName: `First${index + 1}`,
      lastName: `Last${index + 1}`,
      email: `user${(index % 2) + 1}@example.com`,
      phoneNumber: `111-111-${index + 1}`,
      gender: index % 2 === 0 ? "Male" : "Female",
      createdAt: "2023-10-01",
    }));
    getPatients.mockResolvedValue({ data: patientsMock });

    render(
      <MemoryRouter>
        <PatientComponent />
      </MemoryRouter>
    );

    // Wait for table rows to be rendered.
    await waitFor(() => {
      const rows = screen.getAllByRole("row");
      // The header row plus 10 data rows = 11 rows total
      expect(rows.length).toBe(11);
    });

    // Check paginator shows current page 1
    expect(screen.getByText(/Page 1 \/ 2/)).toBeInTheDocument();

    // Navigate to next page
    userEvent.click(screen.getByText("Next"));

    await waitFor(() => {
      // Should now show page 2
      expect(screen.getByText(/Page 2 \/ 2/)).toBeInTheDocument();
    });
  });

  test("handles clear filters action", async () => {
    const patientsMock = [
      {
        id: 2,
        firstName: "Alice",
        lastName: "Smith",
        email: "alice@example.com",
        phoneNumber: "987654321",
        gender: "Female",
        createdAt: "2023-10-02",
      },
      {
        id: 3,
        firstName: "Bob",
        lastName: "Brown",
        email: "bob@example.com",
        phoneNumber: "555555555",
        gender: "Male",
        createdAt: "2023-10-03",
      },
    ];
    getPatients.mockResolvedValue({ data: patientsMock });

    render(
      <MemoryRouter>
        <PatientComponent />
      </MemoryRouter>
    );

    // Wait for data to be rendered.
    await waitFor(() => {
      expect(screen.getByText("List of Patients")).toBeInTheDocument();
    });
    // The UserFilter stub renders a button that clears filters.
    userEvent.click(screen.getByText("Clear Filters"));
    // After clearing filters, both patient emails should remain visible.
    await waitFor(() => {
      expect(screen.getByText("alice@example.com")).toBeInTheDocument();
      expect(screen.getByText("bob@example.com")).toBeInTheDocument();
    });
  });
});