import { z } from "zod";

// Civilization type mapping
export const civilizations = {
  abbasid: "Abbasid Dynasty",
  ayyubids: "Ayyubids",
  byzantines: "Byzantines",
  chinese: "Chinese",
  delhi: "Delhi Sultanate",
  english: "English",
  french: "French",
  holy_roman_empire: "Holy Roman Empire",
  japanese: "Japanese",
  jeanne_darc: "Jeanne d'Arc",
  malians: "Malians",
  mongols: "Mongols",
  order_of_the_dragon: "Order of the Dragon",
  ottomans: "Ottomans",
  rus: "Rus",
  zhu_xis_legacy: "Zhu Xi's Legacy",
  knights_templar: "Knights Templar",
  house_of_lancaster: "House of Lancaster",
  macedonian_dynasty: "Macedonian Dynasty",
  sengoku_daimyo: "Sengoku Daimyo",
  golden_horde: "Golden Horde",
  tughlaq_dynasty: "Tughlaq Dynasty"
} as const;

export type CivilizationKey = keyof typeof civilizations;

// Player autocomplete response
export const playerSchema = z.object({
  name: z.string(),
  profile_id: z.number(),
  rating: z.number().nullable(),
  rank: z.number().nullable(),
  rank_level: z.string().nullable(),
  win_rate: z.number().nullable(),
  avatars: z.object({
    small: z.string(),
    medium: z.string(),
    full: z.string()
  })
});

export type Player = z.infer<typeof playerSchema>;

// Last game response
export const lastGameSchema = z.object({
  game_id: z.number(),
  map: z.string(),
  started_at: z.string(),
  duration: z.number(),
  teams: z.array(z.array(z.object({
    name: z.string(),
    profile_id: z.number(),
    civilization: z.string(),
    result: z.enum(["win", "loss"]),
    rating: z.number(),
    rating_diff: z.number()
  })))
});

export type LastGame = z.infer<typeof lastGameSchema>;

// Guide types
export interface CivilizationGuide {
  name: string;
  key: CivilizationKey;
  content: string; // Markdown content
}

export interface MapGuide {
  name: string;
  type: "Land" | "Hybrid" | "Water";
  content: string; // Markdown content
}
