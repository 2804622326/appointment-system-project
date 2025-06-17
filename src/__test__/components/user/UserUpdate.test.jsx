import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserUpdate from "../../user/UserUpdate";
import { getUserById, updateUser } from "../../user/UserService";

jest.mock("../../user/UserService", () => ({
  getUserById: jest.fn(),
  updateUser: jest.fn(),
}));

describe("UserUpdate Component", () => {
  const mockUserData = {
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      userType: "VET",
      gender: "Male",
      phoneNumber: "1234567890",
      specialization: "Some Spec",
    },
  };

  beforeEach(() => {
    getUserById.mockResolvedValue(mockUserData);
    updateUser.mockResolvedValue({ message: "Update successful" });
  });

  it("renders the form and loads user data", async () => {
    render(
      <BrowserRouter>
        <UserUpdate />
      </BrowserRouter>
    );
    expect(getUserById).toHaveBeenCalled();
    expect(await screen.findByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
  });

  it("allows editing of allowed fields", async () => {
    render(
      <BrowserRouter>
        <UserUpdate />
      </BrowserRouter>
    );
    const firstNameInput = await screen.findByDisplayValue("John");
    fireEvent.change(firstNameInput, { target: { value: "Jane" } });
    expect(firstNameInput.value).toBe("Jane");
    const userTypeInput = screen.getByDisplayValue("VET");
    expect(userTypeInput).toBeDisabled();
  });

  it("submits updated data", async () => {
    render(
      <BrowserRouter>
        <UserUpdate />
      </BrowserRouter>
    );
    const phoneNumberInput = await screen.findByDisplayValue("1234567890");
    fireEvent.change(phoneNumberInput, { target: { value: "0987654321" } });
    const updateButton = screen.getByText("Update");
    fireEvent.click(updateButton);
    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith(
        expect.objectContaining({ phoneNumber: "0987654321" }),
        undefined
      );
    });
  });

  it("shows the specialization selector if userType is VET", async () => {
    render(
      <BrowserRouter>
        <UserUpdate />
      </BrowserRouter>
    );
    expect(await screen.findByText("Specialization")).toBeInTheDocument();
  });
});