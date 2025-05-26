import { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";
import { useRouter } from "expo-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Toast from "react-native-toast-message";
import { useTheme } from "@/contexts/ThemeContext";

export const options = {
  headerTitle: "Forgot Password",
};

export default function ForgotPasswordScreen() {
  const theme = useTheme();
  const styles = createThemedStyles(theme);

  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleReset = async () => {
    if (!email) {
      Toast.show({ type: "error", text1: "Please enter your email" });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Toast.show({ type: "success", text1: "Reset email sent!" });
      router.back();
    } catch (e: any) {
      Toast.show({ type: "error", text1: "Error", text2: e.message });
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
            source={require("../../assets/images/forgot-password-illustration.png")}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        {/* title */}
        <Text style={styles.title}>Enter your email address</Text>

        {/* email */}
        <Input
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Button style={{ marginTop: 10 }} onPress={handleReset}>
          Send Reset Link
        </Button>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.registerLink}>Remember your password?</Text>
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
