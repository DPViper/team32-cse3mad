import {
  TextInput,
  StyleSheet,
  TextInputProps,
  View,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export const Input = (props: TextInputProps) => {
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = props.secureTextEntry;

  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholderTextColor={theme.secondary}
        {...props}
        style={[styles.input, props.style]}
        secureTextEntry={isPassword && !showPassword}
      />
      {isPassword && (
        <TouchableOpacity
          onPress={() => {
            setShowPassword((prev) => !prev);
          }}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color={theme.secondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

function createThemedStyles(theme: any) {
  return StyleSheet.create({
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.inputBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 12,
    },
    input: {
      flex: 1,
      height: 48,
      color: theme.textDark,
    },
  });
}
