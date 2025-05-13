import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
export default function popular() {
  const theme = useTheme();
  const styles = createThemedStyles(theme);

  const [selectedTab, setSelectedTab] = useState<
    "today" | "thisWeek" | "thisMonth"
  >("today");
  const data = popularData[selectedTab];

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        {["today", "thisWeek", "thisMonth"].map((tab) => (
          <Text
            key={tab}
            style={[
              styles.tabText,
              selectedTab === tab && styles.tabTextSelected,
            ]}
            onPress={() => setSelectedTab(tab as any)}
          >
            {tab.replace(/([A-Z])/g, " $1").trim()}
          </Text>
        ))}
      </View>

      {/* POI List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // POI LIST ITEM
          <TouchableOpacity
            onPress={() => console.log("Navigate to detail:", item.id)}
            style={styles.listItem}
          >
            {/* Place Image */}
            <Image
              source={item.image}
              style={styles.placeImage}
              resizeMode="cover"
            />

            {/* Place Name and Rating */}
            <View style={styles.placeDetails}>
              <Text style={styles.placeName}>{item.name}</Text>
              <Text style={styles.placeRating}>{item.rating}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
    tabContainer: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 8,
    },
    tabText: {
      fontFamily: "PlusJakartaSans",
      textTransform: "capitalize",
      paddingBottom: 4,
      color: theme.textLight,
    },
    tabTextSelected: {
      color: theme.textDark,
      borderBottomWidth: 2,
      borderColor: theme.textDark,
    },
    listItem: {
      flexDirection: "row",
      marginBottom: 16,
      alignItems: "center",
      gap: 12,
    },
    placeImage: { width: 130, height: 60, borderRadius: 8 },
    placeDetails: {
      gap: 10,
    },
    placeName: {
      fontSize: 16,
      color: theme.textDark,
      fontFamily: "PlusJakartaSans",
      fontWeight: "600",
    },
    placeRating: { color: theme.textLight },
  });
}

// Sample data for popular places
const popularPlaces = [
  {
    id: "1",
    name: "Farmer’s Daughters",
    rating: 4.7,
    image: require("../../FakeAssets/img/farmerdaughter.jpeg"),
  },
  {
    id: "2",
    name: "Library at The Dock",
    rating: 4.8,
    image: require("../../FakeAssets/img/docklandlib.jpeg"),
  },
  {
    id: "3",
    name: "Point Ormond Lookout",
    rating: 4.6,
    image: require("../../FakeAssets/img/pointormond.jpg"),
  },
];

// this is data for the tabs
// today, thisWeek, thisMonth
const popularData = {
  today: [...popularPlaces],
  thisWeek: [...popularPlaces.slice(0, 2)],
  thisMonth: [...popularPlaces.slice(1)],
};
