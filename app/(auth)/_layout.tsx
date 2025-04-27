import { Stack } from "expo-router/stack";
import { useTheme } from "@/contexts/ThemeContext";
export default function AuthLayout() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTitleStyle: {
          fontFamily: "PlusJakartaSans",
        },
        headerTintColor: theme.textDark,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Log in", headerShown: true }}
      />
      <Stack.Screen
        name="register"
        options={{ title: "Register", headerShown: true }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{ title: "Forgot Password" }}
      />
    </Stack>
  );
}
