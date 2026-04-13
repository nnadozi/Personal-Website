import { useEffect, useMemo, useState } from "react";

interface UseTypewriterOptions {
  speedMs?: number;
  startDelayMs?: number;
  showCursor?: boolean;
  cursor?: string;
  persistCursorAfterComplete?: boolean;
  cursorBlinkMs?: number;
}

export function useTypewriter(text: string, options: UseTypewriterOptions = {}) {
  const {
    speedMs = 22,
    startDelayMs = 450,
    showCursor = true,
    cursor = "|",
    persistCursorAfterComplete = false,
    cursorBlinkMs = 520,
  } = options;
  const [typed, setTyped] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    setTyped("");
    setHasStarted(false);
    setCursorVisible(true);
    let charIndex = 0;
    let typingTimer: ReturnType<typeof setInterval> | undefined;

    const startTimer = setTimeout(() => {
      setHasStarted(true);
      typingTimer = setInterval(() => {
        charIndex += 1;
        setTyped(text.slice(0, charIndex));

        if (charIndex >= text.length && typingTimer) {
          clearInterval(typingTimer);
        }
      }, speedMs);
    }, startDelayMs);

    return () => {
      clearTimeout(startTimer);
      if (typingTimer) clearInterval(typingTimer);
    };
  }, [text, speedMs, startDelayMs]);

  useEffect(() => {
    if (!showCursor) return;

    const isTyping = typed.length < text.length;
    const shouldBlink = isTyping || persistCursorAfterComplete;
    if (!shouldBlink || !hasStarted) return;

    const blinkTimer = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, cursorBlinkMs);

    return () => clearInterval(blinkTimer);
  }, [typed.length, text.length, showCursor, hasStarted, persistCursorAfterComplete, cursorBlinkMs]);

  // Keep a terminal-like cursor during typing and optionally after completion.
  const output = useMemo(() => {
    const isTyping = typed.length < text.length;
    const shouldShowCursor = showCursor && hasStarted && cursorVisible && (isTyping || persistCursorAfterComplete);
    if (!shouldShowCursor) return typed;
    return `${typed}${cursor}`;
  }, [typed, text.length, showCursor, cursor, hasStarted, cursorVisible, persistCursorAfterComplete]);

  return output;
}
