"use client";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { BRAND_REVEAL_SESSION_KEY } from "./brand-reveal-session";
type Phase = "intro" | "crest" | "monogram" | "settle" | "open" | "done";

export function BrandReveal() {
  const [phase, setPhase] = useState<Phase>("intro");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const playThisMount = useRef<boolean | null>(null);

  const play = useCallback(() => {
    timers.current.forEach(clearTimeout);
    setPhase("intro");
    timers.current = [
      setTimeout(() => setPhase("crest"), 160),
      setTimeout(() => setPhase("monogram"), 610),
      setTimeout(() => setPhase("settle"), 1080),
      setTimeout(() => setPhase("open"), 1370),
      setTimeout(() => setPhase("done"), 2280),
    ];
  }, []);

  useLayoutEffect(() => {
    // Remember the decision across React's development effect replay.
    if (playThisMount.current === null) {
      playThisMount.current = false;
      try {
        const seen = window.sessionStorage.getItem(BRAND_REVEAL_SESSION_KEY) === "1";
        // Mark on entry, so leaving before the animation ends also counts.
        window.sessionStorage.setItem(BRAND_REVEAL_SESSION_KEY, "1");
        playThisMount.current = !seen && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      } catch {
        // Blocked browser storage must never create a repeated waiting screen.
      }
    }
    if (!playThisMount.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("done");
      return;
    }
    play();
    return () => timers.current.forEach(clearTimeout);
  }, [play]);

  const isAtLeast = (target: Phase) => {
    const order: Phase[] = ["intro", "crest", "monogram", "settle", "open", "done"];
    return order.indexOf(phase) >= order.indexOf(target);
  };

  return <>
{phase !== "done" && (
        <div className={`reveal reveal-${phase}`} aria-hidden="true">
          <div className="curtain curtain-left"><i /></div>
          <div className="curtain curtain-right"><i /></div>
          <div className={`reveal-mark ${isAtLeast("crest") ? "show-crest" : ""} ${isAtLeast("monogram") ? "show-monogram" : ""}`}>
            <svg className="crest-lines" viewBox="0 0 435 508" role="presentation">
              <path pathLength="1" d="M43 72 C118 69 167 51 217 21 C268 54 317 68 390 72 L390 286 C390 371 338 427 217 484 C95 427 43 371 43 286 Z" />
              <path pathLength="1" d="M57 84 C125 80 171 63 217 38 C262 65 310 80 376 84 L376 283 C376 360 329 411 217 466 C104 411 57 360 57 283 Z" />
            </svg>
            <span className="monogram" />
          </div>
          <p className="reveal-caption">Pichler Advisory</p>
        </div>
      )}
</>;
}
