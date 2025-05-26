import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { SubmitRating } from "../services/submitRatings";

type StarRatingProps = {
  poiId: string;
  rating: number;
  userId?: string;
  onChange: (value: number) => void;
};

export default function StarRating({ rating, onChange, userId }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  const handlePress = (star: number) => {
  onChange(star);
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
