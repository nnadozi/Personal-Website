import { Ionicons } from "@expo/vector-icons";
import { Platform, Pressable } from "react-native";
import type { Theme } from "../constants/theme";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === "dark";
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={({ pressed }) => [
        {
          position: "absolute",
          top: 30,
          right: 30,
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDark ? "#FFFFFF" : "#000000",
          zIndex: 1000,
          ...(Platform.OS === "web"
            ? ({
                cursor: "pointer",
                transition: "transform 0.2s ease",
                transform: pressed ? "scale(0.95)" : "scale(1)",
              } as unknown as object)
            : {}),
        },
      ]}
    >
      <Ionicons
        name={isDark ? "sunny" : "moon"}
        size={22}
        color={isDark ? "#000000" : "#FFFFFF"}
      />
    </Pressable>
  );
}

