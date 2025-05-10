import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { submitRating } from "../services/submitRatings";

type StarRatingProps = {
  rating: number;
  itemId: string;
  userId: string;
  onChange: (value: number) => void;
};

export default function StarRating({ rating, onChange, itemId, userId }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  const handlePress = (star: number) => {
    // update local UI
    onChange(star);

    // persist to Firestore
    submitRating(itemId, userId, star);
  };
  
  return (
    <View style={styles.container}>
      {stars.map((star) => (
        <TouchableOpacity key={star} onPress={() => onChange(star)}>
          <Text style={[styles.star, star <= rating && styles.filled]}>
            ★
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 8,
  },
  star: {
    fontSize: 24,
    color: "#CCC",
    marginHorizontal: 2,
  },
  filled: {
    color: "#FFD700",
  },
});
