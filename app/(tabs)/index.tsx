import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, Alert, TouchableOpacity } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Constants from "expo-constants";
import { fetchPlaceDetails } from "@/lib/places";
import 'react-native-get-random-values';
import { db } from "@/lib/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { collection, addDoc, onSnapshot, DocumentData } from "firebase/firestore";

type POI = {
  id: string;
  title: string;
  description: string;
  coordinate: { latitude: number; longitude: number };
  rating?: number;
  image?: string;
};

export default function HomeScreen() {
  const [pois, setPOIs] = useState<POI[]>([]);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const mapRef = useRef<MapView>(null);
  const { user } = useAuth();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "pois"), (snapshot) => {
      const poiList: POI[] = snapshot.docs.map((doc) => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          coordinate: {
            latitude: data.latitude,
            longitude: data.longitude,
          },
          rating: data.rating,
          image: data.image,
        };
      });
      setPOIs(poiList);
    });

    return () => unsub();
  }, []);

  const handlePlaceSelect = async (data: any) => {
    try {
      const placeId = data.place_id;
      const details = await fetchPlaceDetails(placeId);

      if (
        typeof details.coordinate?.latitude !== "number" ||
        typeof details.coordinate?.longitude !== "number"
      ) {
        alert("Invalid coordinates returned for this place.");
        return;
      }

      const newPOI: POI = {
        id: Date.now().toString(),
        title: details.title,
        description: details.description,
        coordinate: {
          latitude: details.coordinate.latitude,
          longitude: details.coordinate.longitude,
        },
        rating: details.rating,
        image: details.image ?? undefined,
      };

      setPOIs((prev) => [...prev, newPOI]);
      setSelectedPOI(newPOI);

      mapRef.current?.animateToRegion(
        {
          latitude: newPOI.coordinate.latitude,
          longitude: newPOI.coordinate.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        500
      );
    } catch (err) {
      console.error("Failed to fetch place details:", err);
      alert("Failed to add POI from selection.");
    }
  };

  const handleSavePOI = async () => {
    if (!selectedPOI || !user) return;

    try {
      await addDoc(collection(db, "pois"), {
        title: selectedPOI.title,
        description: selectedPOI.description,
        latitude: selectedPOI.coordinate.latitude,
        longitude: selectedPOI.coordinate.longitude,
        rating: selectedPOI.rating ?? null,
        image: selectedPOI.image ?? null,
        createdBy: user.uid,
        createdAt: new Date(),
      });

      Alert.alert("Shared!", `${selectedPOI.title} is now visible to all users!`);
      setSelectedPOI(null);
    } catch (err) {
      console.error("Error saving POI:", err);
      Alert.alert("Error", "Failed to share POI.");
    }
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search for a place"
        onPress={(data, _) => handlePlaceSelect(data)}
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
        style={styles.map}
        initialRegion={{
          latitude: -37.8136,
          longitude: 144.9631,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {pois.map((poi) => (
          <Marker key={poi.id} coordinate={poi.coordinate} title={poi.title}>
            <Callout onPress={() => setSelectedPOI(poi)}>
              <Text>{poi.title}</Text>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {selectedPOI && (
        <View style={styles.detailCard}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedPOI(null)}
          >
            <Text style={{ fontSize: 16 }}>❌</Text>
          </TouchableOpacity>
          <Text style={styles.poiTitle}>{selectedPOI.title}</Text>
          <Text style={styles.poiDescription}>{selectedPOI.description}</Text>
          {selectedPOI.rating && <Text>⭐ {selectedPOI.rating}</Text>}
          {selectedPOI.image && (
            <Image
              source={{ uri: selectedPOI.image }}
              style={{
                width: "100%",
                height: 150,
                borderRadius: 8,
                marginTop: 8,
              }}
              resizeMode="cover"
            />
          )}

          <View style={{ marginTop: 12 }}>
            <Text
              onPress={handleSavePOI}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                textAlign: "center",
                paddingVertical: 10,
                borderRadius: 8,
                fontWeight: "bold",
              }}
            >
              ➕ Add to POIs
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
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
  detailCard: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 99,
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    padding: 6,
    zIndex: 100,
  },
  poiTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  poiDescription: {
    marginTop: 4,
    fontSize: 14,
    color: "#555",
  },
});
