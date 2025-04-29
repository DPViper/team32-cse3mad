import { useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { useRouter } from "expo-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGoogleSignIn } from "@/lib/authWithGoogle";

import { useTheme } from "@/contexts/ThemeContext";

export default function LoginScreen() {
  const theme = useTheme();
  const styles = createThemedStyles(theme);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { promptAsync, request } = useGoogleSignIn();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert(e.message);
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
            source={require("../../assets/images/login-illustration.png")}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        {/* email and password */}
        <Input placeholder="Email" onChangeText={setEmail} value={email} />
        <Input
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />

        {/* error message */}
        {error !== "" && <Text style={styles.error}>{error}</Text>}

        {/* forgot password */}
        <TouchableOpacity onPress={() => router.push("/forgot-password")}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* login button */}
        <Button onPress={handleLogin} style={{ width: "100%", marginTop: 16 }}>
          Log in
        </Button>

        <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
          <Text style={styles.registerLink}>
            Don't have an account? Register
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
