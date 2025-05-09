import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type StarRatingProps = {
  rating: number;
  averageRating: number;
  onChange: (value: number) => void;
};

export default function StarRating({ rating, averageRating, onChange }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Rating:</Text>
      <Text style={styles.average}>Average Rating: {averageRating.toFixed(1)} ⭐</Text>
      <View style={styles.stars}>
        {stars.map((star) => (
          <TouchableOpacity key={star} onPress={() => onChange(star)}>
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={24}
              style={styles.icon}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  label: {
    fontWeight: "bold",
  },
  average: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  stars: {
    flexDirection: "row",
    marginVertical: 8,
  },
  icon: {
    marginHorizontal: 2,
    color: "#171412",
  },
});