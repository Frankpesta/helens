"use client";

import { animate } from "animejs";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Short vibration on phones / supported devices; no-op elsewhere. */
export function triggerLightHaptic(pattern: number | number[] = 10): void {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* denied or unsupported */
  }
}

type PopIntensity = "subtle" | "medium";

/** Small scale “pop” on the clicked element (expects something that can transform, e.g. button). */
export function animateClickPop(
  el: HTMLElement | null,
  opts?: { intensity?: PopIntensity },
): void {
  if (!el || prefersReducedMotion()) return;
  const intensity = opts?.intensity ?? "medium";
  const keyframes =
    intensity === "subtle" ?
      ([1, 0.985, 1.02, 1] as const)
    : ([1, 0.96, 1.06, 1] as const);
  void animate(el, {
    scale: [...keyframes],
    duration: intensity === "subtle" ? 260 : 380,
    ease: "out(3)",
  });
}

/** Add-to-bag: pop + light double-tap haptic pattern. */
export function cartAddClickFeedback(el: HTMLElement | null): void {
  triggerLightHaptic([6, 4, 8]);
  animateClickPop(el, { intensity: "medium" });
}

/** Notices, checkout, etc.: slightly stronger haptic + same pop. */
export function primaryActionClickFeedback(el: HTMLElement | null): void {
  triggerLightHaptic([10, 5, 12]);
  animateClickPop(el, { intensity: "medium" });
}

/** Quantity nudges, small controls. */
export function subtleClickFeedback(el: HTMLElement | null): void {
  triggerLightHaptic(6);
  animateClickPop(el, { intensity: "subtle" });
}
