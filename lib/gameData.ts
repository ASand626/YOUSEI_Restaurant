export type CardType =
  | "cut"
  | "toast"
  | "place"
  | "mix"
  | "sandwich"
  | "microwave"
  | "wait"
  | "drizzle"
  | "break"
  | "roll";

export interface CardDef {
  type: CardType;
  name: string;
  emoji: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
}

export const CARD_DEFS: Record<CardType, CardDef> = {
  cut: {
    type: "cut",
    name: "切る",
    emoji: "🔪",
    bgColor: "#FFF0EE",
    borderColor: "#FF6348",
    textColor: "#CC2A1A",
  },
  toast: {
    type: "toast",
    name: "やく",
    emoji: "🔥",
    bgColor: "#FFF8EE",
    borderColor: "#FFA502",
    textColor: "#B36200",
  },
  place: {
    type: "place",
    name: "のせる",
    emoji: "🍽️",
    bgColor: "#EDFFF5",
    borderColor: "#2ED573",
    textColor: "#1A8A4A",
  },
  mix: {
    type: "mix",
    name: "まぜる",
    emoji: "🥄",
    bgColor: "#F4F2FF",
    borderColor: "#A29BFE",
    textColor: "#5A50D4",
  },
  sandwich: {
    type: "sandwich",
    name: "はさむ",
    emoji: "🥪",
    bgColor: "#FFFBEE",
    borderColor: "#D4A017",
    textColor: "#8B6000",
  },
  microwave: {
    type: "microwave",
    name: "チン！",
    emoji: "⚡",
    bgColor: "#EBF8FF",
    borderColor: "#4299E1",
    textColor: "#2B6CB0",
  },
  wait: {
    type: "wait",
    name: "まつ",
    emoji: "⏰",
    bgColor: "#FFF5F5",
    borderColor: "#FC8181",
    textColor: "#C53030",
  },
  drizzle: {
    type: "drizzle",
    name: "かける",
    emoji: "🍯",
    bgColor: "#FFFFF0",
    borderColor: "#D4A017",
    textColor: "#7B5E00",
  },
  break: {
    type: "break",
    name: "わる",
    emoji: "🥚",
    bgColor: "#FFFDF0",
    borderColor: "#ECC94B",
    textColor: "#975A16",
  },
  roll: {
    type: "roll",
    name: "まく",
    emoji: "🌯",
    bgColor: "#FFF9F0",
    borderColor: "#DD9F5D",
    textColor: "#8B5A2B",
  },
};
