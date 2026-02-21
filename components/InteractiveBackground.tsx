import { useEffect, useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import type { Theme } from "../constants/theme";

export function InteractiveBackground({ theme }: { theme: Theme }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const animate = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const t = (timeRef.current += 0.015);
      const w = canvas.width;
      const h = canvas.height;
      const cy = h / 2;

      ctx.fillStyle = theme === "light" ? "#F5F5F5" : "#171717";
      ctx.fillRect(0, 0, w, h);

      // Organic but rhythmic: layered waves with soft harmonics and gentle drift
      const layers =
        theme === "light"
          ? [
              { r: 185, g: 185, b: 185, amp: 110, freq: 0.0028, speed: 0.48, phase: 0, yBias: -0.05 },
              { r: 165, g: 165, b: 165, amp: 92, freq: 0.0034, speed: -0.38, phase: 1.4, yBias: 0.02 },
              { r: 200, g: 200, b: 200, amp: 78, freq: 0.0024, speed: 0.42, phase: 2.7, yBias: -0.02 },
              { r: 150, g: 150, b: 150, amp: 68, freq: 0.0038, speed: -0.44, phase: 4.1, yBias: 0.05 },
              { r: 175, g: 175, b: 175, amp: 58, freq: 0.003, speed: 0.36, phase: 0.9, yBias: -0.01 },
            ]
          : [
              { r: 85, g: 85, b: 85, amp: 110, freq: 0.0028, speed: 0.48, phase: 0, yBias: -0.05 },
              { r: 100, g: 100, b: 100, amp: 92, freq: 0.0034, speed: -0.38, phase: 1.4, yBias: 0.02 },
              { r: 75, g: 75, b: 75, amp: 78, freq: 0.0024, speed: 0.42, phase: 2.7, yBias: -0.02 },
              { r: 95, g: 95, b: 95, amp: 68, freq: 0.0038, speed: -0.44, phase: 4.1, yBias: 0.05 },
              { r: 82, g: 82, b: 82, amp: 58, freq: 0.003, speed: 0.36, phase: 0.9, yBias: -0.01 },
            ];

      const alpha1 = theme === "light" ? 0.16 : 0.2;
      const alpha2 = theme === "light" ? 0.1 : 0.12;
      const sharedDrift = Math.sin(t * 0.1) * 32;

      for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        const layerDrift = Math.sin(t * 0.16 + i * 0.6) * 18;
        const yBase = cy + layer.yBias * h * 0.14 + sharedDrift + layerDrift;

        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, `rgba(${layer.r},${layer.g},${layer.b},${alpha1})`);
        gradient.addColorStop(0.5, `rgba(${layer.r + 15},${layer.g + 15},${layer.b + 15},${alpha2})`);
        gradient.addColorStop(1, `rgba(${layer.r},${layer.g},${layer.b},${alpha1})`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, yBase);

        for (let x = 0; x <= w; x += 2) {
          const a = x * layer.freq + t * layer.speed + layer.phase;
          const wave =
            Math.sin(a) * layer.amp +
            Math.sin(a * 1.7 + t * 0.3) * (layer.amp * 0.35);
          const y = yBase + wave;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [theme]);

  const bgColor = theme === "light" ? "#F5F5F5" : "#171717";

  if (Platform.OS !== "web") {
    return <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: bgColor }]} />;
  }

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: "hidden", backgroundColor: bgColor }]}>
      {Platform.OS === "web" && (
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />
      )}
    </View>
  );
}

