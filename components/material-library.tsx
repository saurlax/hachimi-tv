"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Check, Search } from "lucide-react";
import { usePreferences } from "@/components/preferences-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { builtinCharacters, characterName, type MaterialReference } from "@/lib/builtin-materials";

export function MaterialLibrary({ onSelect }: { onSelect?: (reference: MaterialReference) => void }) {
  const { t, locale } = usePreferences();
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [characterId, setCharacterId] = useState<string | null>(null);
  const [style, setStyle] = useState<"original" | "cute-sd" | "models">("original");
  const character = builtinCharacters.find((entry) => entry.id === characterId);
  const characters = builtinCharacters.filter((entry) =>
    [entry.name_zh, entry.name_ja, entry.name_en, characterName(entry, locale), ...entry.aliases]
      .join(" ").toLocaleLowerCase(locale).includes(search.trim().toLocaleLowerCase(locale)),
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {character && <Button variant="ghost" size="icon" aria-label={t("backToLibrary")} onClick={() => setCharacterId(null)}><ArrowLeft /></Button>}
        <h1 className="text-2xl font-bold">{character ? characterName(character, locale) : t("characters")}</h1>
        {character && <Badge variant="secondary">{t("builtin")}</Badge>}
        {character && <Button variant="link" asChild className="ml-auto"><a href={character.official_page} target="_blank" rel="noreferrer">{t("officialSource")}<ArrowUpRight /></a></Button>}
      </div>

      {character ? (
        <>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t("materialCategory")}>
            {([ ["original", "originalArt"], ["cute-sd", "cuteArt"], ["models", "modelSources"] ] as const).map(([value, label]) => (
              <Button key={value} variant={style === value ? "default" : "outline"} aria-pressed={style === value} onClick={() => setStyle(value)}>{t(label)}</Button>
            ))}
          </div>
          {style === "models" ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{t("modelLinksOnly")}</p>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {character.models.map((model) => (
                  <Card key={model.source_url}><CardContent className="space-y-3">
                    <h2 className="font-semibold">{model.title}</h2>
                    <p className="text-sm text-muted-foreground">{model.author}</p>
                    <Button variant="outline" asChild><a href={model.source_url} target="_blank" rel="noreferrer">{t("distributionPage")}<ArrowUpRight /></a></Button>
                  </CardContent></Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {character.assets.filter((asset) => asset.style === style).map((asset) => (
                <Card key={asset.id} className="overflow-hidden pt-0">
                  <a href={asset.src} target="_blank" rel="noreferrer" className="block bg-secondary/40 p-5 focus-visible:outline-2 focus-visible:outline-ring">
                    <Image src={asset.src} alt={asset.label} width={asset.dimensions[0]} height={asset.dimensions[1]} sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="h-72 w-full object-contain" />
                  </a>
                  <CardContent className="space-y-3">
                    <h2 className="text-sm font-semibold">{asset.label}</h2>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span>{asset.dimensions.join(" × ")}</span>
                      <a className="underline underline-offset-4" href={asset.source_page} target="_blank" rel="noreferrer">{t("source")}</a>
                    </div>
                    {onSelect && <Button className="w-full" onClick={() => onSelect({ id: asset.id, src: asset.src, label: `${characterName(character, locale)} / ${asset.label}`, origin: "builtin" })}><Check />{t("useReference")}</Button>}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <form role="search" className="flex w-full items-center gap-2" onSubmit={(event) => { event.preventDefault(); setSearch(query); }}>
            <Input aria-label={t("searchMaterials")} value={query} onChange={(event) => { setQuery(event.target.value); if (!event.target.value) setSearch(""); }} className="h-10 flex-1" />
            <Button type="submit" className="h-10 px-4"><Search aria-hidden="true" />{t("search")}</Button>
          </form>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {characters.map((entry) => {
                const cover = entry.assets[1];
                return <button key={entry.id} className="group rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-ring" onClick={() => { setCharacterId(entry.id); setStyle("original"); }}>
                  <Card className="h-full gap-0 overflow-hidden pt-0 transition-transform group-hover:-translate-y-1 motion-reduce:transform-none">
                    <div className="bg-secondary/40 p-4"><Image src={cover.src} alt={characterName(entry, locale)} width={cover.dimensions[0]} height={cover.dimensions[1]} sizes="(max-width: 1024px) 50vw, 25vw" className="h-48 w-full object-contain transition-transform group-hover:scale-105 motion-reduce:transform-none sm:h-60" /></div>
                    <CardContent className="flex flex-wrap items-center justify-between gap-2 pt-4"><h2 className="font-semibold">{characterName(entry, locale)}</h2><Badge variant="secondary">{t("builtin")}</Badge></CardContent>
                  </Card>
                </button>;
              })}
              {characters.length === 0 && <p role="status" className="col-span-full py-12 text-center text-sm text-muted-foreground">{t("noMaterials")}</p>}
            </div>
        </>
      )}
    </section>
  );
}
