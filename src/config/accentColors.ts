export type AccentColor = {
  id: string;
  name: string;
  hex: string;
  rgb: string;
};

export const accentColors: AccentColor[] = [
  {
    id: "cyan",
    name: "Cyber Cyan",
    hex: "#22d3ee",
    rgb: "34, 211, 238",
  },
  {
    id: "violet",
    name: "Violet",
    hex: "#a78bfa",
    rgb: "167, 139, 250",
  },
  {
    id: "emerald",
    name: "Emerald",
    hex: "#34d399",
    rgb: "52, 211, 153",
  },
  {
    id: "rose",
    name: "Rose",
    hex: "#fb7185",
    rgb: "251, 113, 133",
  },
  {
    id: "amber",
    name: "Amber",
    hex: "#fbbf24",
    rgb: "251, 191, 36",
  },
];
