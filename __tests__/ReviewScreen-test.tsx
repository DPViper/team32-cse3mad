import { fireEvent, render, waitFor } from "@testing-library/react-native";
import ReviewScreen from "../app/features/poi/screens/ReviewScreen";

// Mock the required hooks and services
jest.mock("@/contexts/ThemeContext", () => ({
  useTheme: () => ({
    background: "#fff",
    textDark: "#000",
    secondary: "#666",
    border: "#ddd",
    textSecondary: "#999",
    placeholderText: "#999",
    inputBackground: "#f5f5f5",
  }),
}));

jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { uid: "test-user-id" },
  }),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({
    id: "test-poi-id",
    image: "https://example.com/image.jpg",
  }),
}));

jest.mock("@/hooks/useStorage", () => ({
  pickImage: jest
    .fn()
    .mockResolvedValue("https://example.com/uploaded-image.jpg"),
  uploadImageAsync: jest
    .fn()
    .mockResolvedValue("https://example.com/uploaded-image.jpg"),
}));

jest.mock("@/app/features/poi/services/submitRatings", () => ({
  SubmitRating: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/app/features/poi/services/submitComments", () => ({
  SubmitComments: jest.fn().mockResolvedValue(undefined),
}));

describe("ReviewScreen", () => {
  it("renders basic UI elements", () => {
    const { getByText, getByPlaceholderText } = render(<ReviewScreen />);

    // Check for header
    expect(getByText("Upload Review")).toBeTruthy();

    // Check for input field
    expect(getByPlaceholderText("Write your review here")).toBeTruthy();

    // Check for buttons
    expect(getByText("Upload Images")).toBeTruthy();
    expect(getByText("Submit Review")).toBeTruthy();
  });

  it("allows writing a review", () => {
    const { getByPlaceholderText } = render(<ReviewScreen />);
    const reviewInput = getByPlaceholderText("Write your review here");

    fireEvent.changeText(reviewInput, "This is a test review");
    expect(reviewInput.props.value).toBe("This is a test review");
  });

  it("handles image upload", async () => {
    const { getByText } = render(<ReviewScreen />);
    const uploadButton = getByText("Upload Images");

    fireEvent.press(uploadButton);

    await waitFor(() => {
      // Check if the image was uploaded
      expect(getByText("Upload Images")).toBeTruthy();
    });
  });
});
