import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";

export default function favorites() {
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  return (
    <View style={styles.container}>
      <Text>favorites</Text>
    </View>
  );
}

function createThemedStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.primary,
      justifyContent: "flex-start",
      padding: 20,
      gap: 12,
    },
    title: {
      fontSize: 24,
      color: theme.textDark,
      textAlign: "center",
      marginBottom: 16,
      fontFamily: "PlusJakartaSans",
    },
    error: {
      color: "#B00020",
      fontSize: 14,
      marginBottom: 8,
    },
    forgotPassword: {
      color: theme.secondary,
      fontSize: 14,
      alignSelf: "flex-end",
      textDecorationLine: "underline",
      fontFamily: "PlusJakartaSansSemiBold",
    },
    registerLink: {
      color: theme.secondary,
      fontSize: 14,
      textAlign: "center",
      textDecorationLine: "underline",
      fontFamily: "PlusJakartaSansSemiBold",
      marginTop: 8,
    },
  });
}

const favoritePlaces = [
  {
    id: "1",
    name: "Farmer’s Daughters",
    rating: 4.7,
    category: "Restaurant",
    image: require("../../FakeAssets/img/farmerdaughter.jpeg"),
  },
  {
    id: "2",
    name: "Library at The Dock",
    rating: 4.8,
    category: "Library",
    image: require("../../FakeAssets/img/docklandlib.jpeg"),
  },
  {
    id: "3",
    name: "Point Ormond Lookout",
    rating: 4.6,
    category: "Scenic Spot",
    image: require("../../FakeAssets/img/pointormond.jpg"),
  },
];
