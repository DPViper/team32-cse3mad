import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { SubmitRating } from "../services/submitRatings";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";

type StarRatingProps = {
  poiId: string;
  rating: number;
  userId?: string;
  onChange: (value: number) => void;
};

export default function StarRating({
  rating,
  onChange,
  poiId,
  userId,
}: StarRatingProps) {
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const stars = [1, 2, 3, 4, 5];

  const handlePress = (star: number) => {
    onChange(star);

    // only submit if IDs are provided
    if (poiId && userId) {
      SubmitRating({ poiId, rating: star, user: { uid: userId } });
    }
  };

  return (
    <View style={styles.container}>
      {stars.map((star) => (
        <TouchableOpacity key={star} onPress={() => onChange(star)}>
          <Ionicons
            name={star <= rating ? "star" : "star-outline"}
            size={24}
            color={theme.rating}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function createThemedStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      marginVertical: 8,
    },
  });
}
