import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Friend = {
  id: string;
  uid: string;
  displayName: string;
  avatar?: string;
};

export default function FriendsListScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const router = useRouter();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      if (!user) return;

      const snap = await getDocs(collection(db, "friends", user.uid, "list"));
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        uid: doc.data().uid,
        displayName: doc.data().displayName,
        avatar: doc.data().avatar,
      }));
      setFriends(list);
    };

    fetchFriends();
  }, [user]);

  const filteredFriends = friends.filter((f: any) =>
    f.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  const renderFriend = ({ item }: { item: any }) => (
    <View style={styles.friendItem}>
      <Image
        source={{ uri: item.avatar ?? "https://api.dicebear.com/7.x/adventurer/png?seed=placeholder" }}
        style={styles.avatar}
      />
      <Text style={styles.friendName}>{item.displayName}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Friends</Text>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#aaa" style={{ marginRight: 6 }} />
        <TextInput
          placeholder="Search"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Friends list */}
      <FlatList
        data={filteredFriends}
        renderItem={renderFriend}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      {/* Invite friends button */}
      <TouchableOpacity
        style={styles.inviteButton}
        onPress={() => router.push("/features/poi/screens/SendFriendRequestScreen")}
      >
        <Text style={styles.inviteText}>Invite Friends</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "600" },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#eee",
  },
  friendName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  inviteButton: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
    backgroundColor: "#F58A07",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  inviteText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
