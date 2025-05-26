import { fireEvent, render, waitFor } from "@testing-library/react-native";
import RegisterScreen from "../app/(auth)/register";

describe("RegisterScreen", () => {
  it("renders basic UI elements", () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    // Check for input fields
    expect(getByPlaceholderText("Display Name")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();

    // Check for buttons and links
    expect(getByText("Register")).toBeTruthy();
    expect(getByText("Already have an account? Login")).toBeTruthy();
  });

  it("shows error messages if required fields are empty", async () => {
    const { getByText } = render(<RegisterScreen />);
    fireEvent.press(getByText("Register"));
    await waitFor(() => {
      expect(getByText("Display name is required")).toBeTruthy();
      expect(getByText("Email is required")).toBeTruthy();
      expect(getByText("Password is required")).toBeTruthy();
    });
  });
});
