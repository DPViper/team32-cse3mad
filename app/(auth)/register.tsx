import { useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from "react-hook-form";
import Toast from "react-native-toast-message";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { updateDoc } from "firebase/firestore";
import { useTheme } from "@/contexts/ThemeContext";
import { Dimensions } from "react-native";

export const options = {
  headerTitle: "Register",
};

export default function RegisterScreen() {
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegister = async () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert(e.message);
    }
  };

  const onSubmit = async (data: any) => {
    if (data.password.length < 6) {
      Toast.show({ type: "error", text1: "Password too short" });
      return;
    }
    setLoading(true);
    const randomSeed = Math.random().toString(36).substring(2, 10);
    const avatarUrl = `https://api.dicebear.com/7.x/adventurer/png?seed=${randomSeed}`;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;

      // Set display name in Firebase Auth
      await updateProfile(user, {
        displayName: data.displayName,
        photoURL: avatarUrl,
      });

      // ✅ Save user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        userID: user.uid,
        displayName: data.displayName,
        email: data.email,
        avatar: avatarUrl,
        phone: "",
        activeLevel: "Explorer",
        createdAt: new Date(),
      });

      if (!user.uid) return;

      await updateDoc(doc(db, "users", user.uid), {
        phone: "+123456789",
        activeLevel: "Explorer",
      });

      router.replace("/(tabs)");
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Error", text2: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        {/* illustration */}
        <View style={styles.topIllustration}>
          <Image
            source={require("../../assets/images/register-illustration.png")}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        {/* Display Name */}
        <Controller
          control={control}
          name="displayName"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Display Name"
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.displayName && (
          <Text style={{ color: "red" }}>Display name is required</Text>
        )}

        {/* email and password */}
        <Controller
          control={control}
          name="email"
          rules={{ required: true }}
          render={({ field: { onChange, value } }) => (
            <Input placeholder="Email" value={value} onChangeText={onChange} />
          )}
        />
        {errors.email && (
          <Text style={{ color: "red" }}>Email is required</Text>
        )}
        <Controller
          control={control}
          name="password"
          rules={{ required: true, minLength: 6 }}
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Password"
              secureTextEntry
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.password && (
          <Text style={{ color: "red" }}>
            {errors.password.type === "minLength"
              ? "Min 6 characters"
              : "Password is required"}
          </Text>
        )}

        <Button
          loading={loading}
          onPress={handleSubmit(onSubmit)}
          style={{ marginTop: 15 }}
        >
          Register
        </Button>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.registerLink}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function createThemedStyles(theme: any) {
  // Get the width of the screen
  const { width } = Dimensions.get("window");

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.primary,
      justifyContent: "center",
      padding: 20,
      gap: 12,
    },
    title: {
      fontSize: 24,
      fontWeight: 700,
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
    topIllustration: {
      alignItems: "center",
      width: "100%",
    },
    illustrationImage: {
      width: width * 0.75,
      height: width * 0.75,
    },
  });
}
