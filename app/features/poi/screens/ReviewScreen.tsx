import { useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import StarRating from "@/app/features/poi/components/StarRating";
import { SubmitRating } from "@/app/features/poi/services/submitRatings";
import { useAuth } from "@/hooks/useAuth";
import { SubmitComments } from "@/app/features/poi/services/submitComments";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { pickImage, uploadImageAsync } from "@/hooks/useStorage";

export default function ReviewScreen() {
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const { id, image } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const [imageUri, setImageUri] = useState<string | null>(null);

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) setImageUri(uri);
  };

  const handleSubmit = async () => {
    if (!user || !id) {
      Alert.alert("Error", "Missing user or POI ID.");
      return;
    }

    let uploadedUrl: string | undefined = undefined;
    try {
      if (imageUri && user) {
        uploadedUrl = await uploadImageAsync(imageUri, user.uid);
      }
    } catch (err) {
      console.error("Lỗi upload ảnh:", err);
      Alert.alert("Lỗi", "Không thể upload ảnh. Vui lòng thử lại.");
      return; // Không submit tiếp nếu upload lỗi
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
        imageUrl: uploadedUrl || "",
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

      <StarRating rating={rating} onChange={setRating} poiId={id.toString()} />

      <TextInput
        placeholder="Write your review here"
        placeholderTextColor={theme.placeholderText}
        value={text}
        onChangeText={setText}
        multiline
        style={styles.textbox}
      />
      <Button onPress={handlePickImage}>Chọn ảnh</Button>
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 100, height: 100 }} />}
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
