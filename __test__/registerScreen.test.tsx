import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import RegisterScreen from "../app/(auth)/register";

jest.mock("expo-router", () => ({
  useRouter: () => ({
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));
jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));
jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
}));
jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
}));
jest.mock("firebase/storage", () => ({
  getStorage: jest.fn(),
}));
jest.mock("@expo/vector-icons", () => {
  return {
    Ionicons: () => "Ionicons",
  };
});

jest.mock("react-native-toast-message", () => ({
  __esModule: true,
  default: {
    show: jest.fn(),
  },
}));

describe("RegisterScreen", () => {
  it("renders input fields and handles register button press", () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    expect(getByPlaceholderText("Display Name")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();

    fireEvent.changeText(getByPlaceholderText("Display Name"), "");
    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123");

    fireEvent.press(getByText("Register"));
  });
});
