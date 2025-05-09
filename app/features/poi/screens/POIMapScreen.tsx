import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Alert,
  TouchableOpacity,
  TextInput,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Constants from "expo-constants";
import { fetchPlaceDetails } from "@/lib/places";
import "react-native-get-random-values";
import { db } from "@/lib/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import {
  collection,
  addDoc,
  onSnapshot,
  DocumentData,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useTheme } from "@/contexts/ThemeContext";
import { POI } from "../type";
import StarRating from "../components/StarRating";
import { calculateAverageRating, savePOI } from "../services/poiService";

export default function HomeScreen() {
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const [pois, setPOIs] = useState<POI[]>([]);
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null);
  const mapRef = useRef<MapView>(null);
  const { user } = useAuth();
  const [ratings, setRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0); // create average rating
  const [comment, setComment] = useState<string>(""); // create comments
  const [comments, setComments] = useState<any[]>([]);

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
          averageRating: data.averageRating,
          comments: data.comments,
          image: data.image,
        };
      });
      setPOIs(poiList);

      //Update selectedPOI if it's in the new list
      if (selectedPOI) {
        const updatedPOI = poiList.find((poi) => poi.id === selectedPOI.id);
        if (updatedPOI) {
          setSelectedPOI(updatedPOI);
          setAverageRating(updatedPOI.averageRating || 0);
        }
      }
    });

    return () => unsub();
  }, [selectedPOI?.id]);

  // Listen realtime comments
  useEffect(() => {
    if (selectedPOI) {
      const unsub = onSnapshot(
        collection(db, `pois/${selectedPOI.id}/comments`),
        (snapshot) => {
          try {
            const commentList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setComments(commentList);
          } catch (error) {
            console.error("Error processing comments:", error);
            Alert.alert("Error", "Failed to load comments");
          }
        },
        (error) => {
          console.error("Error fetching comments:", error);
          Alert.alert("Error", "Failed to fetch comments");
        }
      );
      return () => unsub();
    }
  }, [selectedPOI?.id]);

  // Function for handling rating change
  const handleRatingChange = async (newRating: number) => {
    if (!selectedPOI || !user) return;
    setRating(newRating);
    try {
      await setDoc(doc(collection(db, `pois/${selectedPOI.id}/ratings`), user.uid), {
        value: newRating,
        ratedAt: new Date(),
      });
      const avg = await calculateAverageRating(selectedPOI.id);
      setAverageRating(avg);
    } catch (error) {
      console.error("Error updating rating:", error);
      Alert.alert("Error", "Failed to update rating");
    }
  };

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
      setRating(0); // reset rating 0 when a new POI is selected
      setAverageRating(0); //reset average rating 0 when a new POI is selected

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
      const docRef = doc(db, "pois", selectedPOI.id);
      await setDoc(docRef, {
        title: selectedPOI.title,
        description: selectedPOI.description,
        latitude: selectedPOI.coordinate.latitude,
        longitude: selectedPOI.coordinate.longitude,
        rating: ratings,
        averageRating: ratings,
        image: selectedPOI.image ?? null,
        createdBy: user.uid,
        createdAt: new Date(),
      });
      await handleRatingChange(ratings);
      Alert.alert("Shared!", `${selectedPOI.title} is now visible to all users!`);
    } catch (err) {
      console.error("Error saving POI:", err);
      Alert.alert("Error", "Failed to share POI.");
    }
  };

  const handlePostComment = async () => {
    if (!user || !selectedPOI || comment.trim() === "") return;
    try {
      await addDoc(collection(db, `pois/${selectedPOI.id}/comments`), {
        userId: user.uid,
        displayName: user.displayName || "Anonymous",
        comment,
        rating: ratings,
        createdAt: new Date(),
      });
      setComment("");
      Alert.alert("Comment posted");
    } catch (error) {
      console.error("Error posting comment:", error);
      Alert.alert("Error", "Failed to post comment");
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
            <Callout
              onPress={async () => {
                setSelectedPOI(poi);

                try {
                  // Lấy rating của người dùng hiện tại nếu có
                  if (user) {
                    const userRatingDoc = await getDocs(
                      collection(db, `pois/${poi.id}/ratings`)
                    );
                    const myRatingDoc = userRatingDoc.docs.find(
                      (doc) => doc.id === user.uid
                    );
                    setRating(myRatingDoc?.data()?.value || 0);
                  }

                  // Lấy average rating từ POI hoặc tính toán lại
                  if (poi.averageRating !== undefined) {
                    setAverageRating(poi.averageRating);
                  } else {
                    const avg = await calculateAverageRating(poi.id);
                    setAverageRating(avg);
                  }
                } catch (error) {
                  console.error("Error fetching ratings:", error);
                }
              }}
            >
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
          {/* {selectedPOI.rating && <Text>⭐ {selectedPOI.rating}</Text>} */}
          {/* Adding rating */}

          // 
          <StarRating
            rating={ratings}
            averageRating={averageRating}
            onChange={handleRatingChange}
          />

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
          // Comments UI
          <Text style={{ fontWeight: "bold", marginTop: 10 }}>
            Your Comment:
          </Text>
          <TextInput
            style={{
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 6,
              padding: 8,
              marginTop: 6,
            }}
            placeholder="Write your comment..."
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity
            onPress={handlePostComment}
            style={{
              backgroundColor: "#007BFF",
              padding: 10,
              marginTop: 8,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              💬 Post Comment
            </Text>
          </TouchableOpacity>
          <Text style={{ fontWeight: "bold", marginTop: 12 }}>Comments:</Text>
          <ScrollView style={{ maxHeight: 100, marginTop: 4 }}>
            {comments.map((c) => (
              <View key={c.id} style={{ marginBottom: 8 }}>
                <Text style={{ fontWeight: "600" }}>
                  {typeof c.displayName === "string" &&
                  typeof c.rating === "number"
                    ? `${c.displayName} ⭐ ${c.rating}`
                    : "Anonymous ⭐ 0"}
                </Text>
                <Text>{String(c.comment ?? "")}</Text>
              </View>
            ))}
          </ScrollView>
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

function createThemedStyles(theme: any) {
  return StyleSheet.create({
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
}
