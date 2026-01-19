import type { CivilizationGuide, MapGuide, CivilizationKey } from "./schema";

// Import civilization markdown files
import abbasidContent from "@/content/civilizations/abbasid.md?raw";
import ayyubidsContent from "@/content/civilizations/ayyubids.md?raw";
import byzantinesContent from "@/content/civilizations/byzantines.md?raw";
import chineseContent from "@/content/civilizations/chinese.md?raw";
import delhiContent from "@/content/civilizations/delhi.md?raw";
import englishContent from "@/content/civilizations/english.md?raw";
import frenchContent from "@/content/civilizations/french.md?raw";
import holyRomanEmpireContent from "@/content/civilizations/holy_roman_empire.md?raw";
import japaneseContent from "@/content/civilizations/japanese.md?raw";
import jeanneDarcContent from "@/content/civilizations/jeanne_darc.md?raw";
import maliansContent from "@/content/civilizations/malians.md?raw";
import mongolsContent from "@/content/civilizations/mongols.md?raw";
import orderOfTheDragonContent from "@/content/civilizations/order_of_the_dragon.md?raw";
import ottomansContent from "@/content/civilizations/ottomans.md?raw";
import rusContent from "@/content/civilizations/rus.md?raw";
import zhuXisLegacyContent from "@/content/civilizations/zhu_xis_legacy.md?raw";
import knightsTemplarContent from "@/content/civilizations/knights_templar.md?raw";
import houseOfLancasterContent from "@/content/civilizations/house_of_lancaster.md?raw";
import macedonianDynastyContent from "@/content/civilizations/macedonian_dynasty.md?raw";
import sengokuDaimyoContent from "@/content/civilizations/sengoku_daimyo.md?raw";
import goldenHordeContent from "@/content/civilizations/golden_horde.md?raw";
import tughlaqDynastyContent from "@/content/civilizations/tughlaq_dynasty.md?raw";

// Import map markdown files
import altaiContent from "@/content/maps/altai.md?raw";
import dryArabiaContent from "@/content/maps/dry-arabia.md?raw";
import gorgeContent from "@/content/maps/gorge.md?raw";
import hillAndDaleContent from "@/content/maps/hill-and-dale.md?raw";
import rockyRiverContent from "@/content/maps/rocky-river.md?raw";
import archipelagoContent from "@/content/maps/archipelago.md?raw";
import sunkenlandsContent from "@/content/maps/sunkenlands.md?raw";
import carmelContent from "@/content/maps/carmel.md?raw";
import enlightenedHorizonContent from "@/content/maps/enlightened-horizon.md?raw";
import canalContent from "@/content/maps/canal.md?raw";
import boulderBayContent from "@/content/maps/boulder-bay.md?raw";
import fourLakesContent from "@/content/maps/four-lakes.md?raw";

// Civilization Guides Database
export const civilizationGuides: Record<CivilizationKey, CivilizationGuide> = {
  abbasid: {
    name: "Abbasid Dynasty",
    key: "abbasid",
    content: abbasidContent
  },
  ayyubids: {
    name: "Ayyubids",
    key: "ayyubids",
    content: ayyubidsContent
  },
  byzantines: {
    name: "Byzantines",
    key: "byzantines",
    content: byzantinesContent
  },
  chinese: {
    name: "Chinese",
    key: "chinese",
    content: chineseContent
  },
  delhi: {
    name: "Delhi Sultanate",
    key: "delhi",
    content: delhiContent
  },
  english: {
    name: "English",
    key: "english",
    content: englishContent
  },
  french: {
    name: "French",
    key: "french",
    content: frenchContent
  },
  holy_roman_empire: {
    name: "Holy Roman Empire",
    key: "holy_roman_empire",
    content: holyRomanEmpireContent
  },
  japanese: {
    name: "Japanese",
    key: "japanese",
    content: japaneseContent
  },
  jeanne_darc: {
    name: "Jeanne d'Arc",
    key: "jeanne_darc",
    content: jeanneDarcContent
  },
  malians: {
    name: "Malians",
    key: "malians",
    content: maliansContent
  },
  mongols: {
    name: "Mongols",
    key: "mongols",
    content: mongolsContent
  },
  order_of_the_dragon: {
    name: "Order of the Dragon",
    key: "order_of_the_dragon",
    content: orderOfTheDragonContent
  },
  ottomans: {
    name: "Ottomans",
    key: "ottomans",
    content: ottomansContent
  },
  rus: {
    name: "Rus",
    key: "rus",
    content: rusContent
  },
  zhu_xis_legacy: {
    name: "Zhu Xi's Legacy",
    key: "zhu_xis_legacy",
    content: zhuXisLegacyContent
  },
  knights_templar: {
    name: "Knights Templar",
    key: "knights_templar",
    content: knightsTemplarContent
  },
  house_of_lancaster: {
    name: "House of Lancaster",
    key: "house_of_lancaster",
    content: houseOfLancasterContent
  },
  macedonian_dynasty: {
    name: "Macedonian Dynasty",
    key: "macedonian_dynasty",
    content: macedonianDynastyContent
  },
  sengoku_daimyo: {
    name: "Sengoku Daimyo",
    key: "sengoku_daimyo",
    content: sengokuDaimyoContent
  },
  golden_horde: {
    name: "Golden Horde",
    key: "golden_horde",
    content: goldenHordeContent
  },
  tughlaq_dynasty: {
    name: "Tughlaq Dynasty",
    key: "tughlaq_dynasty",
    content: tughlaqDynastyContent
  }
};

// Map Guides Database
export const mapGuides: Record<string, MapGuide> = {
  "Altai": {
    name: "Altai",
    type: "Land",
    content: altaiContent
  },
  "Dry Arabia": {
    name: "Dry Arabia",
    type: "Land",
    content: dryArabiaContent
  },
  "Gorge": {
    name: "Gorge",
    type: "Land",
    content: gorgeContent
  },
  "Hill and Dale": {
    name: "Hill and Dale",
    type: "Land",
    content: hillAndDaleContent
  },
  "Rocky River": {
    name: "Rocky River",
    type: "Hybrid",
    content: rockyRiverContent
  },
  "Archipelago": {
    name: "Archipelago",
    type: "Water",
    content: archipelagoContent
  },
  "Sunkenlands": {
    name: "Sunkenlands",
    type: "Land",
    content: sunkenlandsContent
  },
  "Carmel": {
    name: "Carmel",
    type: "Land",
    content: carmelContent
  },
  "Enlightened Horizon": {
    name: "Enlightened Horizon",
    type: "Land",
    content: enlightenedHorizonContent
  },
  "Canal": {
    name: "Canal",
    type: "Hybrid",
    content: canalContent
  },
  "Boulder Bay": {
    name: "Boulder Bay",
    type: "Hybrid",
    content: boulderBayContent
  },
  "Four Lakes": {
    name: "Four Lakes",
    type: "Hybrid",
    content: fourLakesContent
  }
};
