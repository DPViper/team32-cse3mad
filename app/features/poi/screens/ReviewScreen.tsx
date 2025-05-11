import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import StarRating from "@/app/features/poi/components/StarRating";
import { SubmitRating } from "@/app/features/poi/services/submitRatings";
import { useAuth } from "@/hooks/useAuth";
import { SubmitComments } from "@/app/features/poi/services/submitComments";

export default function ReviewScreen() {
  const { id, image } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const handleSubmit = async () => {
    if (!user || !id) {
      Alert.alert("Error", "Missing user or POI ID.");
      return;
    }

    try {
      await SubmitRating({
        poiId: id.toString(), 
        rating,
        user,
      });
      await SubmitComments({
        poiId: id.toString(),
        rating,
        comment: text,
        user,
      });
      Alert.alert("Thank you!", "Your review has been submitted.");
      router.back();
    } catch (error) {
      console.error("Failed to submit review:", error);
      Alert.alert("Error", "Could not submit review.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload Review</Text>
      {image && (
        <Image source={{ uri: image as string }} style={styles.image} />
      )}

      <StarRating 
        rating={rating} 
        onChange={setRating} 
        poiId={id.toString()}
      />

      <TextInput
        placeholder="Write your review..."
        value={text}
        onChangeText={setText}
        multiline
        style={styles.textbox}
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Submit Review</Text>
      </TouchableOpacity>
    </View>

      
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  image: { height: 200, width: "100%", borderRadius: 8, marginBottom: 16 },
  textbox: {
    height: 120,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#F58A07",
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: { textAlign: "center", color: "#fff", fontWeight: "600" },
});