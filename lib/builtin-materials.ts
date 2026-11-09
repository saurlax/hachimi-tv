import catalog from "@/references/characters/catalog.json";
import type { Locale } from "@/lib/i18n";

export type MaterialReference = { id: string; src: string; label: string; origin: "builtin" | "user"; contentType?: string };

export const builtinCharacters = catalog.characters.map((character) => ({
  ...character,
  assets: character.assets.map((asset) => ({
    ...asset,
    id: `${character.id}/${asset.local_path.split("/").at(-1)}`,
    src: asset.local_path.replace(/^public/, ""),
    label: asset.label.replace(/<br\s*\/?\s*>/gi, " ").replace(/<[^>]*>/g, ""),
  })),
}));

export type BuiltinCharacter = (typeof builtinCharacters)[number];
const traditionalNames: Record<string, string> = {
  tokaiteio: "東海帝王", matikanetannhauser: "待兼詩歌劇", mejiromcqueen: "目白麥昆",
  riceshower: "米浴", goldship: "黃金船", oguricap: "小栗帽", twinturbo: "雙渦輪",
};

export function characterName(character: BuiltinCharacter, locale: Locale) {
  if (locale === "ja") return character.name_ja;
  if (locale === "en") return character.name_en;
  return locale === "zh-TW" ? traditionalNames[character.id] : character.name_zh;
}
