export type Wallpaper = {
  id: string;
  name: string;
  background: string;
};

export const wallpapers: Wallpaper[] = [
  {
    id: "midnight-grid",
    name: "Midnight Grid",
    background:
      "radial-gradient(circle at top left, rgba(34, 211, 238, 0.35), transparent 35%), linear-gradient(135deg, #020617, #111827, #0f172a)",
  },
  {
    id: "violet-glass",
    name: "Violet Glass",
    background:
      "radial-gradient(circle at 20% 10%, rgba(168, 85, 247, 0.45), transparent 30%), radial-gradient(circle at 80% 20%, rgba(20, 184, 166, 0.25), transparent 25%), linear-gradient(135deg, #111827, #312e81, #020617)",
  },
  {
    id: "warm-dusk",
    name: "Warm Dusk",
    background:
      "radial-gradient(circle at 15% 20%, rgba(251, 146, 60, 0.38), transparent 30%), radial-gradient(circle at 85% 10%, rgba(244, 114, 182, 0.28), transparent 28%), linear-gradient(135deg, #1e1b4b, #451a03, #020617)",
  },
  {
    id: "emerald-depth",
    name: "Emerald Depth",
    background:
      "radial-gradient(circle at 20% 18%, rgba(52, 211, 153, 0.35), transparent 28%), radial-gradient(circle at 78% 74%, rgba(14, 165, 233, 0.25), transparent 28%), linear-gradient(135deg, #022c22, #020617, #0f172a)",
  },
  {
    id: "rose-nebula",
    name: "Rose Nebula",
    background:
      "radial-gradient(circle at 25% 25%, rgba(251, 113, 133, 0.40), transparent 30%), radial-gradient(circle at 80% 10%, rgba(168, 85, 247, 0.25), transparent 32%), linear-gradient(135deg, #1e1b4b, #4c0519, #020617)",
  },
  {
    id: "deep-ocean",
    name: "Deep Ocean",
    background:
      "radial-gradient(circle at 70% 20%, rgba(59, 130, 246, 0.38), transparent 34%), radial-gradient(circle at 20% 78%, rgba(45, 212, 191, 0.25), transparent 30%), linear-gradient(135deg, #020617, #082f49, #111827)",
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    background:
      "radial-gradient(circle at 15% 20%, rgba(251, 191, 36, 0.38), transparent 32%), radial-gradient(circle at 85% 25%, rgba(249, 115, 22, 0.24), transparent 28%), linear-gradient(135deg, #1c1917, #431407, #020617)",
  },
  {
    id: "mono-pro",
    name: "Mono Pro",
    background:
      "radial-gradient(circle at 20% 20%, rgba(148, 163, 184, 0.20), transparent 32%), linear-gradient(135deg, #020617, #111827, #030712)",
  },
];
