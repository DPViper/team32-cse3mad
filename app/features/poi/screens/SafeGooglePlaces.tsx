import React from "react";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteProps,
} from "react-native-google-places-autocomplete";

export const SafeGooglePlaces = (props: GooglePlacesAutocompleteProps) => {
  return (
    <GooglePlacesAutocomplete
      predefinedPlaces={[]} // ✅ Default empty array to avoid crash
      currentLocation={false}
      fetchDetails={true}
      enablePoweredByContainer={false}
      {...props} // Merge any other props
    />
  );
};
