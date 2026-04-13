import { useEffect, useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import type { Theme } from "../constants/theme";

export function InteractiveBackground({ theme }: { theme: Theme }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
    };

    const initialTrailX = window.innerWidth / 2;
    const initialTrailY = Math.max(80, window.innerHeight / 2 - 190);
    const trailLength = 24;
    const trail: Particle[] = Array.from({ length: trailLength }, () => ({
      x: initialTrailX,
      y: initialTrailY,
      vx: 0,
      vy: 0,
      size: 0,
      alpha: 0,
    }));
    const ambientCount = 70;
    const ambient: Particle[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (ambient.length === 0) {
        for (let i = 0; i < ambientCount; i += 1) {
          ambient.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.28,
            vy: (Math.random() - 0.5) * 0.28,
            size: 1.2 + Math.random() * 2.6,
            alpha: 0.18 + Math.random() * 0.28,
          });
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const pointer = { x: initialTrailX, y: initialTrailY };
    let pointerHasMoved = false;
    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointerHasMoved = true;
    };
    window.addEventListener("pointermove", handlePointerMove);

    let lastFrame = performance.now();

    const animate = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const now = performance.now();
      const dt = Math.min((now - lastFrame) / 16.67, 2);
      lastFrame = now;

      const w = canvas.width;
      const h = canvas.height;
      const t = now * 0.001;
      const background = theme === "light" ? "#F5F5F5" : "#171717";
      const ambientColor = theme === "light" ? "40,40,40" : "225,225,225";
      const snakeColor = theme === "light" ? "20,20,20" : "235,235,235";

      ctx.fillStyle = background;
      ctx.fillRect(0, 0, w, h);

      // Keep subtle background particles alive to make the scene feel active.
      for (let i = 0; i < ambient.length; i += 1) {
        const dot = ambient[i];
        dot.x += dot.vx * dt;
        dot.y += dot.vy * dt;
        if (dot.x < -6) dot.x = w + 6;
        if (dot.x > w + 6) dot.x = -6;
        if (dot.y < -6) dot.y = h + 6;
        if (dot.y > h + 6) dot.y = -6;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${ambientColor},${dot.alpha})`;
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // The "snake" head eases toward the pointer while the tail follows.
      const head = trail[0];
      const idleX = initialTrailX + Math.sin(t * 0.8) * w * 0.04;
      const idleY = initialTrailY + Math.cos(t * 1.05) * h * 0.03;
      const targetX = pointerHasMoved ? pointer.x : idleX;
      const targetY = pointerHasMoved ? pointer.y : idleY;

      head.vx += (targetX - head.x) * 0.04 * dt;
      head.vy += (targetY - head.y) * 0.04 * dt;
      head.vx *= 0.84;
      head.vy *= 0.84;
      head.x += head.vx * dt;
      head.y += head.vy * dt;

      for (let i = 1; i < trail.length; i += 1) {
        const prev = trail[i - 1];
        const segment = trail[i];
        segment.x += (prev.x - segment.x) * (0.22 - i * 0.004) * dt;
        segment.y += (prev.y - segment.y) * (0.22 - i * 0.004) * dt;
      }

      for (let i = trail.length - 1; i >= 0; i -= 1) {
        const segment = trail[i];
        const ratio = 1 - i / trail.length;
        const size = 1 + ratio * 6;
        const alpha = 0.03 + ratio * 0.28;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${snakeColor},${alpha})`;
        ctx.arc(segment.x, segment.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove);
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

