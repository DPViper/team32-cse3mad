import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

export default function profile() {
  return (
    <View style={styles.container}>
      {/* Avatar and name */}
      <View style={styles.profile}>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.memberSince}>Joined Apr 2025</Text>
      </View>

      {/* test button to log out */}
      <TouchableOpacity
        style={{
          backgroundColor: "#FF0000",
          padding: 10,
          borderRadius: 5,
          marginBottom: 20,
        }}
        onPress={() => signOut(auth)}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  profile: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  memberSince: {
    fontSize: 14,
    color: "#888",
  },
  favTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  placeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  placeImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 15,
    fontWeight: "500",
  },
  placeType: {
    fontSize: 13,
    color: "#777",
  },
});
