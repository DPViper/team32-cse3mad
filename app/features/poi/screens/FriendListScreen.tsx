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
import { Button } from "@/components/ui/button";

type Friend = {
  id: string;
  uid: string;
  displayName: string;
  avatar?: string;
};

export default function FriendsListScreen() {
  const { user } = useAuth();
  const theme = useTheme();
  const styles = createThemedStyles(theme);
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
        source={{
          uri:
            item.avatar ??
            "https://api.dicebear.com/7.x/adventurer/png?seed=placeholder",
        }}
        style={styles.avatar}
      />
      <Text style={styles.friendName}>{item.displayName}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Ionicons
          name="search"
          size={18}
          color="#aaa"
          style={{ marginRight: 6, color: theme.placeholderText }}
        />
        <TextInput
          placeholder="Search"
          placeholderTextColor={theme.placeholderText}
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* view friend request button */}
      <Button
        onPress={() =>
          router.push("/features/poi/screens/FriendRequestsScreen")
        }
        style={styles.requestsButton}
      >
        View Friend Request
      </Button>

      {/* Friends list */}
      <FlatList
        data={filteredFriends}
        renderItem={renderFriend}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 10 }}
      />

      {/* Invite friends button */}
      <Button
        style={styles.inviteButton}
        onPress={() =>
          router.push("/features/poi/screens/SendFriendRequestScreen")
        }
      >
        Invite Friends
      </Button>
    </SafeAreaView>
  );
}

function createThemedStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    searchBar: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.textbox,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginVertical: 20,
      marginHorizontal: 10,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: "textdark",
      fontFamily: "PlusJakartaSans",
    },
    friendItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      paddingTop: 10,
      borderTopWidth: 0.5,
      borderBottomColor: theme.border,
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
      paddingVertical: 14,
      borderRadius: 12,
      alignSelf: "center",
      marginBottom: 20,
      width: "80%",
    },
    requestsButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 10,
      marginBottom: 16,
      alignSelf: "center",
    },
  });
}
