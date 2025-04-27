import { Children, createContext, useContext } from "react";
import { useColorScheme } from "react-native";
import { COLORS } from "@/constants/Colors";

const ThemeContext = createContext(COLORS.light); // Default theme

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? COLORS.dark : COLORS.light;

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
