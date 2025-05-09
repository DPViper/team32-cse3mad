import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { POI } from "../type";
import { useTheme } from "@/contexts/ThemeContext";

interface Props {
  poi: POI;
  isInFirestore: boolean;
  onViewDetails: () => void;
  onAdd?: () => void | Promise<void>;
}

export const POICard = ({ poi, isInFirestore, onViewDetails, onAdd }: Props) => {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.white }]}>
      {poi.image && (
        <Image source={{ uri: poi.image }} style={styles.image} resizeMode="cover" />
      )}

      <View style={styles.textContainer}>
        <Text style={styles.title}>{poi.title}</Text>
        {poi.address && (
          <Text style={[styles.address, { color: theme.textSecondary }]}>
            {poi.address}
          </Text>
        )}
      </View>

      <View style={styles.buttonRow}>
        {isInFirestore ? (
          <>
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={onViewDetails}>
              <Text style={styles.buttonText}>View details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.buttonOutline, { borderColor: theme.primary }]}>
              <Text style={[styles.buttonOutlineText, { color: theme.primary }]}>Add to favorites</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={onAdd}>
            <Text style={styles.buttonText}>Add to POIs</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    height: 160,
    borderRadius: 8,
    marginBottom: 8,
    width: "100%",
  },
  textContainer: {
    marginBottom: 10,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 2,
  },
  address: {
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    flexWrap: "wrap",
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#6A4E42",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  buttonOutline: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#6A4E42",
    backgroundColor: "#F3EDE8",
  },

  buttonOutlineText: {
    color: "#6A4E42",
    fontWeight: "600",
  },
});
