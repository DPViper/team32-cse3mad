import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Dimensions, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { POI } from "../type";
import { fetchPlaceDetails } from "@/lib/places";
import { savePOI } from "../services/poiService";
import { POICard } from "../components/POICard";
import { POIDetailModal } from "../components/POIDetailModal";
import Constants from "expo-constants";
import 'react-native-get-random-values';

export default function POIMapScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const mapRef = useRef<MapView>(null);

  const [pois, setPOIs] = useState<POI[]>([]);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  // Load POIs from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "pois"), async (snapshot) => {
      const poiList: POI[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          address: data.address,
          coordinate: {
            latitude: data.latitude,
            longitude: data.longitude,
          },
          rating: data.rating,
          averageRating: data.averageRating,
          comments: data.comments,
          image: data.image,
        };
      });
      setPOIs(poiList);
    });

    return () => unsub();
  }, []);

  // Handle place selection
  const handlePlaceSelect = async (data: any) => {
    try {
      const poi = await fetchPlaceDetails(data.place_id);
      console.log("Returned POI:", poi);
      if (!poi.id || !poi.coordinate?.latitude || !poi.coordinate?.longitude) {
        Alert.alert("Invalid place data.");
        return;
      }

      setSelectedPOI(poi);

      mapRef.current?.animateToRegion({
        latitude: poi.coordinate.latitude,
        longitude: poi.coordinate.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      console.error("Error fetching details:", error);
      Alert.alert("Failed to fetch place details");
    }
  };

  const fetchPOIs = async () => {
    const snapshot = await getDocs(collection(db, "pois"));
    const poiList: POI[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        address: data.address,
        coordinate: {
          latitude: data.latitude,
          longitude: data.longitude,
        },
        rating: data.rating,
        averageRating: data.averageRating,
        comments: data.comments,
        image: data.image,
      };
    });
    setPOIs(poiList);
  };

  const handleSavePOI = async () => {
    if (!selectedPOI || !user) return;

    try {
      const id = await savePOI(selectedPOI, user, selectedPOI.rating || 0);

      const updatedPOI = { ...selectedPOI, id };
      setSelectedPOI(updatedPOI);

      Alert.alert("Shared!", `${selectedPOI.title} is now visible to all users!`);
    } catch {
      Alert.alert("Error", "Failed to share POI.");
    }
  };

  const isExistingPOI = selectedPOI && pois.some((p) => p.id === selectedPOI.id);

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search for a place"
        onPress={handlePlaceSelect}
        fetchDetails={false}
        query={{
          key: Constants.expoConfig?.extra?.googleMapsApiKey,
          language: "en",
        }}
        styles={{
          container: styles.autocompleteContainer,
          textInputContainer: styles.textInputContainer,
          textInput: styles.textInput,
        }}
        enablePoweredByContainer={false}
      />

      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: -37.8136,
          longitude: 144.9631,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {pois.map((poi) =>
          poi.coordinate?.latitude && poi.coordinate?.longitude ? (
            <Marker
              key={poi.id}
              coordinate={poi.coordinate}
              title={poi.title}
              onPress={() => {
                const existing = pois.find((p) => p.id === poi.id);
                if (existing) setSelectedPOI(existing);
              }}
            />
          ) : null
        )}
      </MapView>

      {selectedPOI && (
        <View style={{ position: "absolute", bottom: 10, width: "100%", paddingHorizontal: 10 }}>
          <POICard
            poi={selectedPOI}
            isInFirestore={!!isExistingPOI}
            onViewDetails={() => setShowDetail(true)}
            onAdd={() => handleSavePOI()}
          />
        </View>
      )}

      {showDetail && selectedPOI && (
        <POIDetailModal poiId={selectedPOI.id} onClose={() => setShowDetail(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  autocompleteContainer: {
    position: "absolute",
    top: 10,
    width: Dimensions.get("window").width,
    zIndex: 10,
  },
  textInputContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderRadius: 8,
    overflow: "hidden",
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  textInput: {
    height: 40,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});
