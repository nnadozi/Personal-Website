import { useEffect, useMemo, useRef } from "react";
import { Animated, Platform } from "react-native";

export function useAnimations() {
  const entrance = useRef(new Animated.Value(0)).current;
  const avatarAnim = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const sequence = Animated.sequence([
      Animated.parallel([
        Animated.spring(avatarAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(entrance, {
          toValue: 1,
          duration: 800,
          useNativeDriver: Platform.OS !== "web",
        }),
      ]),
      Animated.spring(buttonsAnim, {
        toValue: 1,
        tension: 30,
        friction: 5,
        useNativeDriver: Platform.OS !== "web",
      }),
    ]);

    sequence.start();
  }, [entrance, avatarAnim, buttonsAnim]);

  const contentAnim = useMemo(
    () => ({
      opacity: entrance,
      transform: [
        {
          translateY: entrance.interpolate({
            inputRange: [0, 1],
            outputRange: [40, 0],
          }),
        },
      ],
    }),
    [entrance]
  );

  const avatarAnimStyle = useMemo(
    () => ({
      opacity: avatarAnim,
      transform: [
        {
          scale: avatarAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1.2, 1],
          }),
        },
        {
          rotate: avatarAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ["-180deg", "0deg"],
          }),
        },
      ],
    }),
    [avatarAnim]
  );

  const buttonsAnimStyle = useMemo(
    () => ({
      opacity: buttonsAnim,
      transform: [
        {
          translateY: buttonsAnim.interpolate({
            inputRange: [0, 0.7, 1],
            outputRange: [40, -8, 0],
          }),
        },
        {
          scale: buttonsAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 1.15, 1],
          }),
        },
      ],
    }),
    [buttonsAnim]
  );

  return {
    contentAnim,
    avatarAnimStyle,
    buttonsAnimStyle,
  };
}

