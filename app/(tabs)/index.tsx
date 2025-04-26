import { View, Text, StyleSheet } from "react-native";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";

export default function home() {
  return (
    <View style={styles.container}>
      <MapView
        // provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: -37.8136,
          longitude: 144.9631,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: -37.8136, longitude: 144.9631 }}
          title="Melbourne"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
