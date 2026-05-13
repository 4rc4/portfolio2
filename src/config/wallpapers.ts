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
];
