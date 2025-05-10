import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";

export default function POIDetailScreen() {
  const route = useRoute();
  const { poi } = route.params as any;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{poi.title}</Text>
      {poi.image && <Image source={{ uri: poi.image }} style={styles.image} />}
      <Text style={styles.address}>{poi.description}</Text>
      <Text style={styles.rating}>⭐ {poi.averageRating?.toFixed(1) || poi.rating || "N/A"}</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Post a Review</Text>
      </TouchableOpacity>

      <Text style={styles.subTitle}>Reviews</Text>
      <View style={styles.reviewCard}>
        <Text style={styles.reviewName}>Alex</Text>
        <Text style={styles.reviewDate}>2 days ago</Text>
        <Text style={styles.reviewText}>The food and service were both excellent. Will definitely come back.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 12,
  },
  address: {
    color: "#666",
  },
  rating: {
    fontSize: 16,
    marginVertical: 8,
  },
  button: {
    backgroundColor: "orange",
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
  },
  reviewCard: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  reviewName: {
    fontWeight: "bold",
  },
  reviewDate: {
    fontSize: 12,
    color: "#999",
  },
  reviewText: {
    marginTop: 4,
  },
});