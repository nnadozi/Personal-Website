import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  cardWrap: {
    width: "100%",
    maxWidth: 560,
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 20,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 16,
    borderWidth: 2,
  },
  name: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    letterSpacing: -0.4,
    textAlign: "center",
  },
  about: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 460,
    opacity: 0.8,
  },
  linkRow: {
    marginTop: 18,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});

