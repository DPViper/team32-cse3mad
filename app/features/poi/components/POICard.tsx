import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { POI } from "../type";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

interface Props {
  poi: POI;
  isInFirestore: boolean;
  onViewDetails: () => void;
  onAdd?: () => void | Promise<void>;
  onClose: () => void;
}

export const POICard = ({
  poi,
  isInFirestore,
  onViewDetails,
  onAdd,
  onClose,
}: Props) => {
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  console.log(poi);
  return (
    <View style={styles.card}>
      {/* Image  */}
      {poi.image && (
        <Image
          source={{ uri: poi.image }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      {/* Information */}

      <View style={styles.textContainer}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <Text style={styles.title}>{poi.title}</Text>
          {poi.averageRating && (
            <Text style={[styles.rating, { color: theme.textSecondary }]}>
              {poi.averageRating}
            </Text>
          )}
        </View>
        {poi.description && (
          <Text style={[styles.address]}>{poi.description}</Text>
        )}
      </View>

      <View style={styles.buttonRow}>
        {isInFirestore ? (
          <>
            <Button style={styles.button} onPress={onViewDetails}>
              View details
            </Button>
            <Button
              style={styles.button}
              onPress={() => console.log("Add fav")}
            >
              Add to favorites
            </Button>
          </>
        ) : (
          <Button onPress={onAdd || (() => {})} style={styles.button}>
            Add to POIs
          </Button>
        )}
      </View>

      {/* Close button */}
      <Button style={styles.closeButton} variant="outline" onPress={onClose}>
        Close
      </Button>
    </View>
  );
};

function createThemedStyles(theme: any) {
  return StyleSheet.create({
    card: {
      borderRadius: 10,
      padding: 12,
      marginVertical: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
      backgroundColor: theme.primary,
    },
    image: {
      height: 200,
      borderRadius: 12,
      marginBottom: 8,
      width: "100%",
    },
    textContainer: {
      marginBottom: 10,
    },
    title: {
      fontWeight: "600",
      fontFamily: "PlusJakartaSans",
      fontSize: 16,
      marginBottom: 2,
    },
    rating: {
      fontSize: 14,
      marginLeft: 6,
      fontWeight: "500",
    },
    address: {
      fontSize: 14,
      fontFamily: "PlusJakartaSans",
      color: theme.textSecondary,
    },
    buttonRow: {
      flexDirection: "row",
      marginTop: 12,
      flexWrap: "nowrap",
      justifyContent: "center",
    },
    button: {
      borderRadius: 50,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: theme.buttonBackground || "#e87c25",
      marginHorizontal: 8,
      minWidth: 140,
      alignItems: "center",
    },
    closeButton: {
      marginTop: 20,
      alignSelf: "center",
      width: "50%",
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
}
