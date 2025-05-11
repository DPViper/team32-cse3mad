import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useState } from "react";
import StarRating from "@/app/features/poi/components/StarRating";
import { submitRating } from "@/app/features/poi/services/submitRatings";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

export default function ReviewScreen() {
  const theme = useTheme();
  const styles = createThemedStyles(theme);
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
      await submitRating(id.toString(), user.uid, rating, text);
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

      <StarRating rating={rating} onChange={setRating} />

      <TextInput
        placeholder="Write your review here"
        placeholderTextColor={theme.placeholderText}
        value={text}
        onChangeText={setText}
        multiline
        style={styles.textbox}
      />
      <Button style={styles.button} onPress={handleSubmit}>
        Submit Review
      </Button>
    </View>
  );
}

function createThemedStyles(theme: any) {
  return StyleSheet.create({
    container: { paddingHorizontal: 16, backgroundColor: theme.background },
    header: {
      fontSize: 22,
      marginBottom: 8,
      alignSelf: "center",
      color: theme.textDark,
      fontFamily: "PlusJakartaSansBold",
    },
    image: { height: 200, borderRadius: 20, marginBottom: 12 },

    textbox: {
      height: 120,
      borderColor: theme.secondary,
      backgroundColor: theme.inputBackground,
      borderWidth: 1,
      borderRadius: 8,
      padding: 10,
      textAlignVertical: "top",
      marginBottom: 16,
    },
    button: {
      paddingVertical: 10,
      borderRadius: 10,
      alignSelf: "center",
      width: "80%",
    },
    buttonText: { textAlign: "center", color: "#fff", fontWeight: "600" },
  });
}
