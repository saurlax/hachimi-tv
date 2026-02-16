import NextLink from "next/link";
import { Cherry_Bomb_One } from "next/font/google";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";

const display = Cherry_Bomb_One({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-30" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-pink-500/30 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-32 h-60 w-60 rounded-full bg-cyan-400/20 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-48 w-48 rounded-full bg-amber-300/20 blur-3xl animate-float-fast" />

      <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-20">
        <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-[0.3em] text-slate-300">
          <Chip className="border border-pink-300/40 bg-pink-400/10 text-slate-100">
            Hachimi Stream
          </Chip>
          <Chip className="border border-cyan-200/40 bg-cyan-300/10 text-slate-100">
            Cute but sharp
          </Chip>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <h1
              className={`${display.className} animate-fade-up text-4xl leading-tight text-slate-50 sm:text-5xl lg:text-6xl`}
            >
              Hachimi TV is a cozy, stylish home for bite-size streams and
              full-length adventures.
            </h1>
            <p className="max-w-xl text-lg text-slate-200/80">
              Watch your favorite hachimi moments, remix highlights, and share
              with a community that loves the vibe. Smooth playback, playful
              rooms, and creator tools that feel effortless.
            </p>
            <div className="flex flex-wrap gap-4">
              <NextLink href="/discover">
                <Button className="rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_35px_-18px_rgba(236,72,153,0.9)]">
                  Start watching
                </Button>
              </NextLink>
              <NextLink href="/platform">
                <Button
                  variant="bordered"
                  className="rounded-full border-slate-200/30 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-100 backdrop-blur"
                >
                  Upload your hachimi
                </Button>
              </NextLink>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-slate-300">
              {[
                { value: "120k", label: "daily views" },
                { value: "8k+", label: "active creators" },
                { value: "4.9", label: "community rating" },
              ].map((stat) => (
                <Card
                  key={stat.label}
                  className="border border-white/10 bg-white/5"
                >
                  <CardBody className="px-4 py-3">
                    <p className="text-slate-100">{stat.value}</p>
                    <p className="text-slate-300/70">{stat.label}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="border border-white/10 bg-linear-to-br from-white/10 via-white/5 to-white/0">
              <CardHeader className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-pink-200/80">
                  Live now
                </p>
                <Chip className="bg-pink-400/20 text-xs text-pink-100">
                  4 rooms
                </Chip>
              </CardHeader>
              <CardBody className="space-y-4">
                {[
                  "Hachimi lounge",
                  "Soft focus stream",
                  "Snackable playlist",
                ].map((title, index) => (
                  <Card
                    key={title}
                    className="border border-white/10 bg-white/5 animate-fade-up"
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    <CardBody className="flex items-center justify-between px-4 py-3">
                      <div>
                        <p className="text-sm text-slate-100">{title}</p>
                        <p className="text-xs text-slate-400">Always cozy</p>
                      </div>
                      <span className="text-xs text-cyan-200/80">Join</span>
                    </CardBody>
                  </Card>
                ))}
              </CardBody>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Hachimi radar",
                  detail: "Find the cutest clips fast",
                },
                {
                  title: "Creator kits",
                  detail: "Brand kits, overlays, loops",
                },
                { title: "Cozy rooms", detail: "Invite-only stream hangouts" },
                { title: "Instant remix", detail: "Clip, stitch, and share" },
              ].map((item) => (
                <Card
                  key={item.title}
                  className="border border-white/10 bg-white/5"
                >
                  <CardBody className="p-4 text-sm text-slate-200">
                    <p className="text-base text-slate-100">{item.title}</p>
                    <p className="mt-1 text-slate-400">{item.detail}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">
              Trending
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-100">
              Tonight is a hachimi night.
            </h2>
          </div>
          <NextLink
            href="/feed"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200"
          >
            View all
          </NextLink>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "Velvet loop", tag: "4.5k watching" },
            { title: "Tea time edits", tag: "New drop" },
            { title: "Mini concert", tag: "Premiere" },
          ].map((item) => (
            <Card
              key={item.title}
              className="group border border-white/10 bg-linear-to-br from-slate-900/80 via-slate-900/40 to-slate-900/10"
            >
              <CardBody className="p-5">
                <div className="flex h-44 items-end justify-between rounded-2xl bg-linear-to-br from-pink-500/30 via-fuchsia-500/10 to-cyan-400/20 p-4">
                  <Chip className="bg-white/15 text-xs uppercase tracking-[0.2em] text-white/80">
                    {item.tag}
                  </Chip>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-lg text-slate-100">{item.title}</p>
                  <span className="text-xs text-slate-400">Play</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-6xl px-6 pb-20">
        <Card className="border border-white/10 bg-white/5">
          <CardBody className="grid gap-8 p-8 md:grid-cols-[1.2fr_0.8fr] md:items-center md:p-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-pink-200/80">
                For creators
              </p>
              <h3 className="mt-4 text-3xl font-semibold text-slate-100">
                Make your hachimi glow.
              </h3>
              <p className="mt-3 text-slate-300">
                Launch a channel in minutes. Customize your room, set cozy mood
                filters, and pin the cutest moments on your front page.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <NextLink href="/platform">
                <Button className="rounded-2xl bg-cyan-400/80 px-5 py-3 text-sm font-semibold text-slate-950">
                  Build my channel
                </Button>
              </NextLink>
              <NextLink href="/login">
                <Button
                  variant="bordered"
                  className="rounded-2xl border-white/20 px-5 py-3 text-sm font-semibold text-slate-100"
                >
                  Talk to the team
                </Button>
              </NextLink>
            </div>
          </CardBody>
        </Card>
      </section>
    </main>
  );
}
