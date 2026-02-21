import { useState } from "react";
import { Animated, Image, Platform, StyleSheet, View } from "react-native";
import { IconLinkButton } from "../components/IconLinkButton";
import { InteractiveBackground } from "../components/InteractiveBackground";
import { ThemeToggle } from "../components/ThemeToggle";
import { PROFILE } from "../constants/profile";
import { themeColors, type Theme } from "../constants/theme";
import { useAnimations } from "../hooks/useAnimations";
import { styles } from "../styles";

export default function Index() {
  const [theme, setTheme] = useState<Theme>("dark");
  const { contentAnim, avatarAnimStyle, nameAnimStyle, aboutAnimStyle, buttonsAnimStyle } = useAnimations();
  const colors = themeColors[theme];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ThemeToggle theme={theme} onToggle={() => setTheme(theme === "light" ? "dark" : "light")} />

      {Platform.OS === "web" ? (
        <InteractiveBackground theme={theme} />
      ) : (
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} />
      )}

      <Animated.View style={[styles.cardWrap, contentAnim, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
        <Animated.View style={avatarAnimStyle}>
          <Image source={PROFILE.avatar} style={[styles.avatar, { borderColor: colors.cardBorder }]} />
        </Animated.View>

        <Animated.Text style={[styles.name, { color: colors.text }, nameAnimStyle]}>
          {PROFILE.fullName}
        </Animated.Text>
        <Animated.Text style={[styles.about, { color: colors.text }, aboutAnimStyle]}>
          {PROFILE.about}
        </Animated.Text>

        <Animated.View style={[styles.linkRow, buttonsAnimStyle]}>
          <IconLinkButton
            icon="logo-github"
            label="Open GitHub"
            tooltip="GitHub"
            href={PROFILE.links.github}
            theme={theme}
          />
          <IconLinkButton
            icon="logo-linkedin"
            label="Open LinkedIn"
            tooltip="LinkedIn"
            href={PROFILE.links.linkedin}
            theme={theme}
          />
          <IconLinkButton icon="document-text-outline" label="Open Resume" tooltip="Resume" href={PROFILE.links.cv} theme={theme} />
          <IconLinkButton
            icon="send-outline"
            materialIcon="gmail"
            label="Send Email"
            tooltip="Email"
            href={PROFILE.links.email}
            theme={theme}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}
