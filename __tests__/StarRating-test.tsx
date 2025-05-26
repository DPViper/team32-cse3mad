import { fireEvent, render } from "@testing-library/react-native";
import StarRating from "../app/features/poi/components/StarRating";

describe("StarRating", () => {
  // Mock function to track rating changes
  const mockOnChange = jest.fn();

  // Reset mock before each test
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  // Test if component renders the correct number of stars
  it("renders 5 stars", () => {
    const { getAllByText } = render(
      <StarRating rating={0} onChange={mockOnChange} poiId="test-poi" />
    );
    const stars = getAllByText("★");
    expect(stars).toHaveLength(5);
  });

  // Test if clicking a star triggers the onChange callback with correct rating
  it("calls onChange when a star is pressed", () => {
    const { getAllByText } = render(
      <StarRating rating={0} onChange={mockOnChange} poiId="test-poi" />
    );
    const stars = getAllByText("★");
    fireEvent.press(stars[2]); // Press the third star (index 2 = rating 3)
    expect(mockOnChange).toHaveBeenCalledWith(3);
  });
});
