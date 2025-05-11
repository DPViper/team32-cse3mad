import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { submitRating } from "../services/submitRatings";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";

type StarRatingProps = {
  rating: number;
  itemId?: string;
  userId?: string;
  onChange: (value: number) => void;
};

export default function StarRating({
  rating,
  onChange,
  itemId,
  userId,
}: StarRatingProps) {
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const stars = [1, 2, 3, 4, 5];

  const handlePress = (star: number) => {
    onChange(star);

    // only submit if IDs are provided
    if (itemId && userId) {
      submitRating(itemId, userId, star, "");
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
