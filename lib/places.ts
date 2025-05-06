import axios from "axios";
import Constants from "expo-constants";

const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey;

export async function geocodeAddress(address: string) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;
  const res = await axios.get(url);

  console.log("Geocode API response:", res.data);

  if (!res.data.results || res.data.results.length === 0) {
    throw new Error("No location found from Google");
  }

  const result = res.data.results[0];
  return {
    location: result.geometry.location,
    placeId: result.place_id,
  };
}

export async function fetchPlaceDetails(placeId: string) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,photos,rating,geometry&key=${GOOGLE_API_KEY}`;
  const res = await axios.get(url);
  console.log("Google Place Details Response:", res.data);
  const result = res.data.result;

  if (
    !result ||
    !result.geometry ||
    !result.geometry.location ||
    typeof result.geometry.location.lat !== "number" ||
    typeof result.geometry.location.lng !== "number"
  ) {
    throw new Error("Missing or invalid coordinates in Place Details response");
  }

  const photoRef = result.photos?.[0]?.photo_reference;
  const photoUrl = photoRef
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${GOOGLE_API_KEY}`
    : undefined;

  return {
    title: result.name,
    description: result.formatted_address,
    coordinate: {
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
    },
    rating: result.rating,
    image: photoUrl,
  };
}
