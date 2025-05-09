import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
  ViewStyle,
  StyleProp,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

type ButtonProps = {
  onPress: (event: GestureResponderEvent) => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: "solid" | "ghost" | "outline" | "soft";
};

export const Button = ({
  onPress,
  children,
  style,
  variant = "solid",
}: ButtonProps) => {
  const theme = useTheme();
  const styles = createThemedStyles(theme);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        variant === "ghost"
          ? styles.ghost
          : variant === "outline"
          ? styles.outline
          : variant === "soft"
          ? styles.soft
          : styles.solid,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          variant === "ghost"
            ? styles.ghostText
            : variant === "outline"
            ? styles.outlineText
            : variant === "soft"
            ? styles.softText
            : {},
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const createThemedStyles = (theme: any) => {
  return StyleSheet.create({
    button: {
      paddingVertical: 14,
      paddingHorizontal: 18,
      borderRadius: 10,
      alignItems: "center",
    },
    solid: {
      backgroundColor: theme.button,
    },
    ghost: {
      backgroundColor: "transparent",
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.border,
    },
    soft: {
      backgroundColor: theme.placeholderText ?? "#EFEFEF",
    },
    text: {
      color: theme.textDark,
      fontSize: 16,
      fontFamily: "PlusJakartaSansSemiBold",
    },
    ghostText: {
      color: theme.secondary,
      textDecorationLine: "underline",
      fontFamily: "PlusJakartaSans",
    },
    outlineText: {
      color: theme.textDark,
      fontFamily: "PlusJakartaSansSemiBold",
    },
    softText: {
      color: theme.textDark,
      fontFamily: "PlusJakartaSansSemiBold",
    },
  });
};
