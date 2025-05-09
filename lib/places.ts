import axios from "axios";
import Constants from "expo-constants";
import { POI } from "@/app/features/poi/type";

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

export async function fetchPlaceDetails(placeId: string): Promise<POI> {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,photos,rating,geometry,place_id&key=${GOOGLE_API_KEY}`;
  const res = await axios.get(url);
  const result = res.data.result;

  if (
    !result?.geometry?.location?.lat ||
    !result?.geometry?.location?.lng ||
    !result?.place_id
  ) {
    throw new Error("Missing required location or ID data");
  }

  const photoRef = result.photos?.[0]?.photo_reference;
  const photoUrl = photoRef
    ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${GOOGLE_API_KEY}`
    : undefined;

  return {
    id: result.place_id,
    title: result.name,
    description: result.formatted_address,
    address: result.formatted_address,
    coordinate: {
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
    },
    rating: result.rating,
    image: photoUrl,
  };
}