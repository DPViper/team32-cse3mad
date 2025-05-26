import { render, waitFor } from "@testing-library/react-native";
import { POIDetailModal } from "../app/features/poi/components/POIDetailModal";
import {
  getPOIComments,
  getPOIDetails,
} from "../app/features/poi/services/poiService";

// Mock the POI services
jest.mock("../app/features/poi/services/poiService", () => ({
  getPOIDetails: jest.fn(),
  getPOIComments: jest.fn(),
}));

// Mock the theme context
jest.mock("@/contexts/ThemeContext", () => ({
  useTheme: () => ({
    background: "#fff",
    textDark: "#000",
    secondary: "#666",
    border: "#ddd",
    textSecondary: "#999",
  }),
}));

// Mock the auth context
jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { uid: "test-user-id" },
  }),
}));

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock SafeAreaProvider
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock SafeScreen
jest.mock("@/components/SafeScreen", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

describe("POIDetailModal", () => {
  const mockPOI = {
    id: "test-poi-id",
    title: "Test POI",
    description: "Test Description",
    image: "https://example.com/test-image.jpg",
    averageRating: 4.5,
  };

  const mockComments = [
    {
      id: "comment-1",
      displayName: "Test User",
      comment: "Great place!",
      rating: 5,
      createdAt: { toDate: () => new Date() },
    },
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup default mock implementations
    (getPOIDetails as jest.Mock).mockResolvedValue(mockPOI);
    (getPOIComments as jest.Mock).mockResolvedValue(mockComments);
  });

  it("loads and displays POI image from Firestore", async () => {
    const { getByTestId } = render(
      <POIDetailModal poiId="test-poi-id" onClose={() => {}} />
    );

    // Wait for the POI details to be loaded
    await waitFor(() => {
      expect(getPOIDetails).toHaveBeenCalledWith("test-poi-id");
    });

    // Check if the image is displayed
    const image = getByTestId("poi-image");
    expect(image.props.source.uri).toBe("https://example.com/test-image.jpg");
  });

  // Test if the POI image is not present if the image is undefined
  it("handles POI without image", async () => {
    const poiWithoutImage = { ...mockPOI, image: undefined };
    (getPOIDetails as jest.Mock).mockResolvedValue(poiWithoutImage);

    const { queryByTestId } = render(
      <POIDetailModal poiId="test-poi-id" onClose={() => {}} />
    );

    // Wait for the POI details to be loaded
    await waitFor(() => {
      expect(getPOIDetails).toHaveBeenCalledWith("test-poi-id");
    });

    // Image should not be present
    expect(queryByTestId("poi-image")).toBeNull();
  });

  it("shows loading state while fetching data", async () => {
    // Delay the mock response
    (getPOIDetails as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockPOI), 100))
    );

    const { queryByTestId } = render(
      <POIDetailModal poiId="test-poi-id" onClose={() => {}} />
    );

    // Initially, the image should not be present (loading state)
    expect(queryByTestId("poi-image")).toBeNull();

    // Wait for data to load
    await waitFor(() => {
      expect(getPOIDetails).toHaveBeenCalledWith("test-poi-id");
    });
  });
});
