"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { AssetLibrary } from "@/components/asset-library";
import { MaterialLibrary } from "@/components/material-library";
import type { MaterialReference } from "@/lib/builtin-materials";
import { ArrowUpRight, AudioLines, Cat, File, Flag, Music2, Play, Search, Sparkles, Star, Video } from "lucide-react";
import { AppSidebar, type WorkspaceSection } from "@/components/app-sidebar";
import { PreferenceControls } from "@/components/preference-controls";
import { usePreferences } from "@/components/preferences-provider";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { MessageKey } from "@/lib/i18n";

const ideas = [
  { title: "ideaOne", subtitle: "subtitleOne", label: "musicIdea", prompt: "promptOne", icon: Music2, color: "idea-honey" },
  { title: "ideaTwo", subtitle: "subtitleTwo", label: "videoIdea", prompt: "promptTwo", icon: Flag, color: "idea-peach" },
  { title: "ideaThree", subtitle: "subtitleThree", label: "musicIdea", prompt: "promptThree", icon: AudioLines, color: "idea-blue" },
] satisfies { title: MessageKey; subtitle: MessageKey; label: MessageKey; prompt: MessageKey; icon: typeof Music2; color: string }[];

export default function Page() {
  const { t, locale } = usePreferences();
  const params = useSearchParams();
  const [section, setSection] = useState<WorkspaceSection>(params.get("section") === "assets" ? "assets" : "discover");
  const [prompt, setPrompt] = useState("");
  const [selectedReference, setSelectedReference] = useState<MaterialReference | null>(null);
  const [query, setQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [showNotice, setShowNotice] = useState(false);
  const [pickingReference, setPickingReference] = useState(false);

  useEffect(() => {
    document.title = `${t("brand")} | ${t(section)}`;
  }, [section, t]);

  function start(value = "") {
    setPrompt(value);
    setSection("create");
    setShowNotice(false);
  }
  const filtered = ideas.filter((idea) =>
    `${t(idea.title)} ${t(idea.subtitle)}`.toLocaleLowerCase(locale).includes(query.toLocaleLowerCase(locale)),
  );

  return (
    <SidebarProvider>
      <AppSidebar active={section} onNavigate={(value) => { setSection(value); setShowNotice(false); setPickingReference(false); }} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex w-full items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
            <span className="text-sm font-medium">{t(section)}</span>
            <div className="ml-auto"><PreferenceControls /></div>
          </div>
        </header>
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 md:p-6">
          {pickingReference && (section === "assets" || section === "characters") && <div><Button variant="outline" onClick={() => { setPickingReference(false); setSection("create"); }}>{t("cancel")}</Button></div>}
          {section === "discover" ? (
            <>
                <section className="hero-panel relative isolate overflow-hidden rounded-2xl border">
                  <div aria-hidden="true" className="honey-grid absolute inset-0 -z-10" />
                  <div className="relative grid min-h-80 gap-5 p-7 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
                    <div className="relative z-10">
                      <Badge variant="outline" className="hero-badge"><Star className="size-3 fill-current" />{t("club")}</Badge>
                      <h1 className="mt-5 text-4xl leading-[1.2] font-black sm:text-5xl">
                        {t("heroStart")}<br />
                        <span className="hero-highlight relative inline-block">{t("heroEnd")}<span aria-hidden="true" className="absolute -bottom-1 inset-x-0 h-1 -rotate-2 bg-current opacity-25" /></span>
                      </h1>
                      <div className="mt-7 flex flex-wrap gap-3">
                        <Button onClick={() => start()} className="h-10 px-5"><Sparkles />{t("start")}<ArrowUpRight /></Button>
                        <Button variant="outline" onClick={() => document.getElementById("inspiration")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })} className="h-10">{t("findIdeas")}</Button>
                      </div>
                    </div>
                    <div aria-hidden="true" className="relative hidden min-h-64 items-center justify-center lg:flex">
                      <div className="race-orbit absolute h-48 w-96" /><div className="race-orbit absolute h-60 w-[420px]" />
                      <div className="relative -rotate-12">
                        <div className="record-spin flex size-52 items-center justify-center rounded-full border-[13px] border-[#383326] bg-[#25241f] shadow-[8px_12px_0_#c49e3b55]">
                          <div className="absolute inset-7 rounded-full border border-white/15" /><div className="absolute inset-10 rounded-full border border-white/10" />
                          <div className="flex size-24 items-center justify-center rounded-full border-4 border-[#fff4cf] bg-[#f5c947]"><Cat className="size-11 text-[#4d3825]" strokeWidth={1.5} /></div>
                        </div>
                        <div className="racing-ribbon absolute -right-14 bottom-4 h-10 w-36 -rotate-12 border-y-4 border-[#fff6db]" />
                      </div>
                      <Star className="absolute top-12 left-7 size-8 rotate-12 fill-current opacity-50" />
                    </div>
                  </div>
                  <div aria-hidden="true" className="racing-ribbon h-2 opacity-90" />
                </section>
              <section id="inspiration" className="scroll-mt-5">
                <h2 className="mb-4 text-xl font-bold">{t("inspiration")}</h2>
                <form role="search" className="mb-4 flex w-full items-center gap-2" onSubmit={(event) => { event.preventDefault(); setQuery(searchInput); }}>
                  <Input aria-label={t("searchIdeas")} className="h-10 flex-1" value={searchInput} onChange={(event) => { setSearchInput(event.target.value); if (!event.target.value) setQuery(""); }} />
                  <Button type="submit" className="h-10 px-4"><Search aria-hidden="true" />{t("search")}</Button>
                </form>
                <div className="grid gap-4 md:grid-cols-3">
                  {filtered.map(({ title, subtitle, label, icon: Icon, color, prompt: ideaPrompt }) => (
                    <Card key={title} className="gap-0 overflow-hidden py-0">
                      <button onClick={() => start(t(ideaPrompt))} className={`group relative flex aspect-[2/1] w-full items-center justify-center ${color}`} aria-label={`${t("useIdea")}: ${t(title)}`}>
                        <div className="flex size-16 -rotate-6 items-center justify-center rounded-2xl border border-current/10 bg-card/50 transition-transform group-hover:rotate-0 motion-reduce:transition-none"><Icon className="size-8" strokeWidth={1.5} /></div>
                        <ArrowUpRight className="absolute top-4 right-4 size-4 opacity-50" />
                      </button>
                      <CardContent className="space-y-2 p-4">
                        <Badge variant="secondary" className="font-normal">{t(label)}</Badge>
                        <button className="block text-left text-sm font-semibold hover:underline" onClick={() => start(t(ideaPrompt))}>{t(title)}</button>
                        <p className="text-xs text-muted-foreground">{t(subtitle)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {filtered.length === 0 && <p className="py-8 text-sm text-muted-foreground">{t("noResults")}</p>}
              </section>
            </>
          ) : section === "characters" ? (
            <MaterialLibrary onSelect={pickingReference ? (material) => { setSelectedReference(material); setShowNotice(false); setPickingReference(false); setSection("create"); } : undefined} />
          ) : section === "assets" ? (
            <AssetLibrary onSelect={pickingReference ? (asset) => { setSelectedReference(asset); setShowNotice(false); setPickingReference(false); setSection("create"); } : undefined} />
          ) : section === "create" ? (
            <section className="mx-auto w-full max-w-2xl space-y-6">
              <h1 className="text-2xl font-bold">{t("createTitle")}</h1>
              <Card><CardContent className="space-y-5">
                <label className="block space-y-2 text-sm font-medium">
                  <span>{t("yourIdea")}</span>
                  <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} className="min-h-36 w-full rounded-lg border bg-background p-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </label>
                {selectedReference && <div className="flex items-center gap-4 rounded-lg border p-3">
                  {selectedReference.origin === "builtin" || selectedReference.contentType?.startsWith("image/") ? <Image unoptimized src={selectedReference.src} alt={selectedReference.label} width={80} height={96} className="h-24 w-20 shrink-0 object-contain" /> : <File className="size-10 shrink-0 text-muted-foreground" />}
                  <div className="min-w-0 flex-1 space-y-1"><p className="text-xs text-muted-foreground">{t("selectedReference")}</p><p className="break-words text-sm font-medium">{selectedReference.label}</p></div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedReference(null)}>{t("removeReference")}</Button>
                </div>}
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" onClick={() => { setPickingReference(true); setSection("characters"); }}>{t("chooseFromLibrary")}</Button>
                  <Button variant="outline" onClick={() => { setPickingReference(true); setSection("assets"); }}>{t("chooseAsset")}</Button>
                  <Button onClick={() => setShowNotice(true)}><Sparkles />{t("prepare")}</Button>
                </div>
                {showNotice && <p role="status" className="text-sm text-muted-foreground">{t("generationUnavailable")}</p>}
              </CardContent></Card>
            </section>
          ) : (
            <section className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-card px-6 py-20 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-secondary"><Video className="size-7" /></div>
              <h1 className="text-xl font-bold">{t(section)}</h1>
              <p className="max-w-sm text-sm leading-6 text-muted-foreground">{t("storageUnavailable")}</p>
              <Button onClick={() => start()}><Play className="size-4" />{t("start")}</Button>
            </section>
          )}
          <footer className="mt-auto flex items-center justify-between gap-2 border-t pt-4 text-xs text-muted-foreground">
            <span>{t("brand")} — {t("tagline")}</span>
            <span aria-hidden="true" className="racing-ribbon inline-block h-2 w-12 shrink-0 rounded-sm" />
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
