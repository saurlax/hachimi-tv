"use client";
import { useState } from "react";
import {
  ArrowUpRight,
  AudioLines,
  Cat,
  Flag,
  ImagePlus,
  Music2,
  Play,
  Sparkles,
  Star,
  Video,
} from "lucide-react";
import { AppSidebar, type WorkspaceSection } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const ideas = [
  {
    number: "01",
    title: "小马的第一首出道曲",
    subtitle: "元气旋律 / 偶像舞台",
    label: "音乐灵感",
    icon: Music2,
    color: "bg-[#ffedaa]",
    prompt:
      "一首元气满满的小马出道曲，明亮的旋律、轻快的鼓点，像站上舞台的第一束阳光。",
  },
  {
    number: "02",
    title: "今天，也要全力冲线！",
    subtitle: "热血节奏 / 赛场应援",
    label: "视频灵感",
    icon: Flag,
    color: "bg-[#f6dfd0]",
    prompt:
      "小马迎着阳光奔跑，红白蓝应援旗在风里飘动，镜头跟随冲线的瞬间，充满热血与活力。",
  },
  {
    number: "03",
    title: "没有烦恼，只有曼波",
    subtitle: "可爱日常 / 快乐循环",
    label: "音乐灵感",
    icon: AudioLines,
    color: "bg-[#dfe9ee]",
    prompt:
      "一段可爱又洗脑的曼波小曲，轻快、有趣，适合搭配小马蹦蹦跳跳的日常画面。",
  },
];
export default function Page() {
  const [section, setSection] = useState<WorkspaceSection>("发现");
  const [prompt, setPrompt] = useState("");
  const [reference, setReference] = useState("");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  function start(value = "") {
    setPrompt(value);
    setSection("创作");
    setNotice("");
  }
  const filtered = ideas.filter((idea) =>
    `${idea.title}${idea.subtitle}`.includes(query),
  );
  return (
    <SidebarProvider>
      <AppSidebar
        active={section}
        onNavigate={(value) => {
          setSection(value);
          setNotice("");
        }}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-3 border-b px-4 md:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="data-vertical:h-4" />
          <span className="text-sm font-medium">{section}</span>
          <span className="ml-auto hidden items-center gap-1.5 text-[10px] font-semibold tracking-widest text-muted-foreground sm:flex">
            <span className="size-1.5 rounded-full bg-[#d75e4e]" /> LET YOUR
            IDEAS RUN.
          </span>
        </header>
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-7 p-4 md:p-7">
          {section === "发现" || section === "搜索" ? (
            <>
              {section === "搜索" && (
                <Input
                  autoFocus
                  aria-label="搜索创作灵感"
                  placeholder="搜索创作灵感…"
                  className="max-w-md"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              )}
              {section === "发现" && (
                <section className="relative isolate overflow-hidden rounded-2xl border border-[#e9bd44] bg-[#ffdc68]">
                  <div
                    aria-hidden="true"
                    className="honey-grid absolute inset-0 -z-10"
                  />
                  <div className="relative grid min-h-80 gap-5 p-7 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
                    <div className="relative z-10">
                      <Badge
                        variant="outline"
                        className="border-[#b28b32]/40 bg-[#fff8df]/70 text-[#6c511d]"
                      >
                        <Star className="size-3 fill-current" />{" "}
                        哈基米创作俱乐部
                      </Badge>
                      <h1 className="mt-5 text-4xl leading-[1.2] font-black tracking-tight sm:text-5xl">
                        灵感就位，
                        <br />
                        快乐
                        <span className="relative inline-block text-[#9a422e]">
                          起跑！
                          <span
                            aria-hidden="true"
                            className="absolute -bottom-1 inset-x-0 h-1 -rotate-2 bg-[#fff9df]"
                          />
                        </span>
                      </h1>
                      <p className="mt-5 text-sm leading-7 text-[#6d542a]">
                        一张参考，一点脑洞。
                        <br />
                        让你的小马，拥有自己的音乐和故事。
                      </p>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <Button
                          onClick={() => start()}
                          className="h-10 bg-[#332c22] px-5 text-[#fff7df] hover:bg-[#51422c]"
                        >
                          <Sparkles />
                          开始创作
                          <ArrowUpRight />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            document
                              .getElementById("inspiration")
                              ?.scrollIntoView({ behavior: "smooth" })
                          }
                          className="h-10 border-[#b28b32]/40 bg-[#fff7dd]/60"
                        >
                          找点灵感
                        </Button>
                      </div>
                    </div>
                    <div
                      aria-hidden="true"
                      className="relative hidden min-h-64 items-center justify-center lg:flex"
                    >
                      <div className="race-orbit absolute h-48 w-96" />
                      <div className="race-orbit absolute h-60 w-[420px]" />
                      <span className="absolute top-2 right-1 rotate-6 rounded border border-[#ae8433]/40 bg-[#fff5d7] px-3 py-1 font-mono text-xs">
                        HACHIMI / 001
                      </span>
                      <div className="relative -rotate-12">
                        <div className="record-spin flex size-52 items-center justify-center rounded-full border-[13px] border-[#383326] bg-[#25241f] shadow-[8px_12px_0_#c49e3b55]">
                          <div className="absolute inset-7 rounded-full border border-white/15" />
                          <div className="absolute inset-10 rounded-full border border-white/10" />
                          <div className="flex size-24 items-center justify-center rounded-full border-4 border-[#fff4cf] bg-[#f5c947]">
                            <Cat
                              className="size-11 text-[#4d3825]"
                              strokeWidth={1.5}
                            />
                          </div>
                        </div>
                        <div className="racing-ribbon absolute -right-14 bottom-4 h-10 w-36 -rotate-12 border-y-4 border-[#fff6db]" />
                      </div>
                      <Star className="absolute top-12 left-7 size-8 rotate-12 fill-[#fff7db] text-[#fff7db]" />
                      <span className="absolute right-6 bottom-1 -rotate-6 font-mono text-xs font-bold tracking-widest text-[#886526]">
                        GOOD VIBES, FULL SPEED ↗
                      </span>
                    </div>
                  </div>
                  <div
                    aria-hidden="true"
                    className="racing-ribbon h-2 opacity-90"
                  />
                </section>
              )}
              <section id="inspiration" className="scroll-mt-5">
                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="mb-1 font-mono text-[10px] tracking-[0.18em] text-[#a87822]">
                      THE STARTING LINE
                    </p>
                    <h2 className="text-xl font-bold">从一个小小的灵感开始</h2>
                  </div>
                  <span className="hidden text-xs text-muted-foreground sm:block">
                    选个方向，跑出你的风格。
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {filtered.map(
                    ({
                      title,
                      number,
                      subtitle,
                      label,
                      icon: Icon,
                      color,
                      prompt: ideaPrompt,
                    }) => (
                      <Card key={number} className="gap-0 py-0">
                        <button
                          onClick={() => start(ideaPrompt)}
                          className={`group relative flex aspect-[2/1] w-full items-center justify-center overflow-hidden text-left ${color}`}
                          aria-label={`使用灵感：${title}`}
                        >
                          <span className="absolute top-3 left-4 font-mono text-[10px] tracking-wider opacity-60">
                            HACHIMI SOUNDS / {number}
                          </span>
                          <span className="absolute right-4 bottom-0 text-8xl font-black italic opacity-[0.06]">
                            {number}
                          </span>
                          <div className="flex size-16 -rotate-6 items-center justify-center rounded-2xl border border-current/10 bg-white/50 shadow-[4px_4px_0_#30291e0a] transition-transform group-hover:rotate-0">
                            <Icon className="size-8" strokeWidth={1.5} />
                          </div>
                          <ArrowUpRight className="absolute right-4 top-4 size-4 opacity-50" />
                        </button>
                        <CardContent className="space-y-2 p-4">
                          <Badge variant="secondary" className="font-normal">
                            {label}
                          </Badge>
                          <button
                            className="block text-left text-sm font-semibold hover:underline"
                            onClick={() => start(ideaPrompt)}
                          >
                            {title}
                          </button>
                          <p className="text-xs text-muted-foreground">
                            {subtitle}
                          </p>
                        </CardContent>
                      </Card>
                    ),
                  )}
                </div>
                {filtered.length === 0 && (
                  <p className="py-8 text-sm text-muted-foreground">
                    没有找到相关灵感，换个关键词试试。
                  </p>
                )}
              </section>
              <div className="flex items-center gap-4 rounded-xl border border-dashed bg-card p-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <ImagePlus className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">
                    你的小马，由你定义。
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    从参考图、喜欢的旋律，或一句天马行空的描述开始。
                  </p>
                </div>
                <Button
                  variant="ghost"
                  className="ml-auto shrink-0"
                  onClick={() => start()}
                >
                  <span className="hidden sm:inline">去创作</span>
                  <ArrowUpRight />
                </Button>
              </div>
            </>
          ) : section === "创作" ? (
            <section className="mx-auto w-full max-w-2xl space-y-6 py-5">
              <Badge variant="secondary">
                <Sparkles className="size-3" /> 创作起点
              </Badge>
              <h1 className="text-3xl font-bold">让小马的故事，从这里开始。</h1>
              <p className="text-sm text-muted-foreground">
                先收集灵感和参考，再为你的小马选择一个出发方向。
              </p>
              <Card>
                <CardContent className="space-y-5">
                  <label className="block space-y-2 text-sm font-medium">
                    <span>你的灵感</span>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="描述小马的模样、音乐的感觉，或你脑海中的画面…"
                      className="min-h-36 w-full rounded-lg border bg-background p-3 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </label>
                  <label className="block space-y-2 text-sm font-medium">
                    <span>参考素材</span>
                    <Input
                      type="file"
                      accept="image/*,audio/*,video/*"
                      onChange={(e) =>
                        setReference(e.target.files?.[0]?.name ?? "")
                      }
                    />
                    <span className="block text-xs font-normal text-muted-foreground">
                      {reference
                        ? `已选择：${reference}（仅在本地选择，尚未上传）`
                        : "可选择图片、音乐或视频作为参考。"}
                    </span>
                  </label>
                  <Button
                    onClick={() =>
                      setNotice(
                        "灵感已就绪。生成服务尚未接入，参考素材不会上传。",
                      )
                    }
                  >
                    <Sparkles />
                    准备生成
                  </Button>
                  {notice && (
                    <p role="status" className="text-sm text-muted-foreground">
                      {notice}
                    </p>
                  )}
                </CardContent>
              </Card>
            </section>
          ) : (
            <section className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-card px-6 py-20 text-center">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-secondary">
                <Video className="size-7 text-[#a87822]" />
              </div>
              <h1 className="text-xl font-bold">{section}</h1>
              <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                这里将收纳你的
                {section === "参考素材"
                  ? "小马参考图、音乐与视频素材"
                  : section === "收藏"
                    ? "心动作品与创作灵感"
                    : "小马视频与音乐作品"}
                。作品存储功能尚未接入。
              </p>
              <Button onClick={() => start()}>
                <Play className="size-4" />
                开始一次新创作
              </Button>
            </section>
          )}
          <footer className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-[10px] tracking-wider text-muted-foreground">
            <span>HACHIMI.TV — 小小脑洞，大大快乐。</span>
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="racing-ribbon inline-block h-2 w-12 rounded-sm"
              />{" "}
              MADE FOR YOUR NEXT HAPPY MOMENT
            </span>
          </footer>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
