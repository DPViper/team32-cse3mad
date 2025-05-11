import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";

import React from "react";

export default function SafeScreen({ children }: React.PropsWithChildren<{}>) {
  const theme = useTheme();
  const style = createThemedStyles(theme);
  const insets = useSafeAreaInsets();
  return (
    <View style={[style.container, { paddingTop: insets.top }]}>
      {children}
    </View>
  );
}
function createThemedStyles(theme: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
  });
}
