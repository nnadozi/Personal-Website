import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps } from "react";
import { useRef, useState } from "react";
import { Animated, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { themeColors, type Theme } from "../constants/theme";
import { openExternalUrl } from "../utils/linking";

type MaterialIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

interface IconLinkButtonProps {
  icon: ComponentProps<typeof Ionicons>["name"];
  /** When set, show this MaterialCommunityIcons icon instead (e.g. "gmail" for Gmail). */
  materialIcon?: MaterialIconName;
  label: string;
  tooltip: string;
  href: string;
  theme: Theme;
}

export function IconLinkButton({ icon, materialIcon, label, tooltip, href, theme }: IconLinkButtonProps) {
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const showTooltip = icon === "document-text-outline" || icon === "send-outline" || materialIcon === "gmail";

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: Platform.OS !== "web",
      tension: 400,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: Platform.OS !== "web",
      tension: 400,
      friction: 8,
    }).start();
  };

  const iconColor = themeColors[theme].text;

  const colors = themeColors[theme];
  const bgDefault = colors.iconBg;
  const borderDefault = colors.iconBorder;
  const bgHover = theme === "light" ? "#D1D5DB" : "#404040";
  const borderHover = theme === "light" ? "#9CA3AF" : "#525252";
  const shadowColor = theme === "light" ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.4)";

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={label}
      onPress={() => openExternalUrl(href)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={({ hovered, pressed }) => [
        styles.iconBtn,
        {
          backgroundColor: bgDefault,
          borderColor: borderDefault,
          ...(Platform.OS === "web" && !hovered
            ? ({ boxShadow: `0 4px 12px ${theme === "light" ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.35)"}` } as unknown as object)
            : {}),
        },
        hovered && {
          backgroundColor: bgHover,
          borderColor: borderHover,
          ...(Platform.OS === "web"
            ? ({
                boxShadow: `0 10px 30px ${shadowColor}, 0 0 0 1px ${borderHover}`,
                transform: "translateY(-4px) scale(1.08)",
              } as unknown as object)
            : {}),
        },
        pressed && styles.iconBtnPressed,
      ]}
    >
      {({ hovered }) => (
        <Animated.View style={[styles.iconBtnInner, { transform: [{ scale: scaleAnim }] }]}>
          {Platform.OS === "web" && (hovered || isFocused) && showTooltip && (
            <View
              pointerEvents="none"
              style={[
                styles.tooltip,
                {
                  backgroundColor: theme === "light" ? "#374151" : "#262626",
                  borderColor: theme === "light" ? "#4B5563" : "#404040",
                },
              ]}
            >
              <Text style={[styles.tooltipText, { color: theme === "light" ? "#FFFFFF" : "#F8FAFC" }]}>
                {tooltip}
              </Text>
              <View
                style={[
                  styles.tooltipArrow,
                  {
                    backgroundColor: theme === "light" ? "#374151" : "#262626",
                    borderColor: theme === "light" ? "#4B5563" : "#404040",
                  },
                ]}
              />
            </View>
          )}
          {materialIcon ? (
            <MaterialCommunityIcons name={materialIcon} size={24} color={iconColor} />
          ) : (
            <Ionicons name={icon} size={24} color={iconColor} />
          )}
        </Animated.View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    ...(Platform.OS === "web"
      ? ({
          transitionProperty: "transform, background-color, border-color, box-shadow",
          transitionDuration: "250ms",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          cursor: "pointer",
          userSelect: "none",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        } as unknown as object)
      : {}),
  },
  iconBtnPressed: {
    transform: [{ scale: 0.94 }],
  },
  iconBtnInner: {
    position: "relative",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  tooltip: {
    position: "absolute",
    bottom: 58,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    zIndex: 50,
    ...(Platform.OS === "web"
      ? ({
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        } as unknown as object)
      : {}),
  },
  tooltipText: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  tooltipArrow: {
    position: "absolute",
    bottom: -5,
    left: "50%",
    width: 10,
    height: 10,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    transform: [{ translateX: -5 }, { rotate: "45deg" }],
  },
});

