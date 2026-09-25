import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/methodology")({
  head: () => ({
    meta: [
      { title: "Methodology — Second Draft" },
      {
        name: "description",
        content:
          "How Second Draft transforms a small business's digital presence: the fit call, the second draft, and launch & manage — plus the principles behind every project.",
      },
      { property: "og:title", content: "Methodology — Second Draft" },
      {
        property: "og:description",
        content:
          "The three-step method behind every Second Draft transformation, and the principles that guide the work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/methodology" }],
  }),
  component: Methodology,
});

const BOOK_CALL_URL = "#book";

const menu = [
  { id: "principles", label: "Principles" },
  { id: "fit-call", label: "01 · The fit call" },
  { id: "second-draft", label: "02 · The second draft" },
  { id: "launch", label: "03 · Launch & manage" },
];

const principles = [
  {
    title: "First impressions are the whole game",
    desc: "A customer decides in seconds whether a business feels current. Everything we build is in service of that moment.",
  },
  {
    title: "One partner, no telephone game",
    desc: "The person you talk to is the person who does the work. Strategy, design, copy, and systems stay in one head.",
  },
  {
    title: "Shipped beats perfect",
    desc: "A real page in front of real customers teaches more than a deck ever will. We get to a second draft fast, then refine.",
  },
  {
    title: "Managed, not abandoned",
    desc: "A transformation that goes stale in a year wasn't one. We keep the site, content, and systems current after launch.",
  },
];

const phases = [
  {
    id: "fit-call",
    num: "1",
    title: "The fit call",
    time: "30 minutes · free",
    body: [
      "Every engagement starts with a single conversation. We look at your current site together — what's working, what's dated, and what a customer actually experiences when they find you.",
      "You leave with an honest read on whether a transformation would move the needle for your business, whether or not we work together. No deck, no pitch theater.",
    ],
    out: "You walk away with: a clear diagnosis of your current presence and what a transformation would fix first.",
  },
  {
    id: "second-draft",
    num: "2",
    title: "The second draft",
    time: "1–2 weeks",
    body: [
      "We build a real first pass — actual pages, actual words, actual systems — not mockups of mockups. Your brand, website, content plan, and the automation behind the scenes, drafted end to end.",
      "Then you react. Your notes shape the refinement rounds until it reads the way your business was always meant to.",
    ],
    out: "You walk away with: a working second draft of your entire digital presence, refined with your input.",
  },
  {
    id: "launch",
    num: "3",
    title: "Launch & manage",
    time: "Ongoing",
    body: [
      "We ship it — and then we stay. Content gets published, systems keep running, and the site evolves as your business does.",
      "This is the part most shops skip. A great launch that goes stale by next year is money spent standing still. We keep your second draft current so it keeps working while you do.",
    ],
    out: "You walk away with: a presence that stays current — site, content, and systems managed for you.",
  },
];

function Methodology() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link
            to="/"
            className="font-display text-sm font-extrabold uppercase tracking-[0.15em]"
          >
            Second Draft
          </Link>
          <nav className="hidden items-center gap-8 sm:flex">
            <span className="label-caps text-foreground">Methodology</span>
            <span className="label-caps">Brand / Web / Content / AI Systems</span>
          </nav>
          <a
            href={BOOK_CALL_URL}
            className="border border-foreground px-5 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition-colors hover:bg-foreground hover:text-background"
          >
            Book a fit call
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 sm:pt-28">
        <p className="animate-rise label-caps">How the work gets done</p>
        <h1
          className="animate-rise mt-8 max-w-4xl font-display text-5xl font-extrabold uppercase leading-[1.02] tracking-tight text-balance sm:text-7xl"
          style={{ animationDelay: "0.1s" }}
        >
          A method,{" "}
          <span className="font-serif font-medium normal-case italic tracking-normal text-serif">
            not a mystery.
          </span>
        </h1>
        <p
          className="animate-rise mt-10 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty"
          style={{ animationDelay: "0.25s" }}
        >
          Three steps, four principles, one partner. This is exactly what
          working with Second Draft looks like — before you ever book a call.
        </p>
      </section>

      {/* Submenu */}
      <nav className="sticky top-[73px] z-30 border-y border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl gap-8 overflow-x-auto px-6 py-4">
          {menu.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="label-caps whitespace-nowrap transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Principles */}
      <section id="principles" className="scroll-mt-32">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">
              Principles
            </h2>
            <span className="label-caps">What every project runs on</span>
          </div>
          <div className="grid gap-px border border-border bg-border sm:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title} className="bg-background p-7">
                <h3 className="font-display text-lg font-extrabold uppercase tracking-wide">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phases */}
      {phases.map((phase) => (
        <section
          key={phase.id}
          id={phase.id}
          className="scroll-mt-32 border-t border-border"
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 sm:py-24 md:grid-cols-[auto_1fr] md:gap-16">
            <span className="font-serif text-6xl italic leading-none text-serif">
              {phase.num}
            </span>
            <div>
              <div className="flex flex-wrap items-baseline gap-4">
                <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">
                  {phase.title}
                </h2>
                <span className="label-caps">{phase.time}</span>
              </div>
              <div className="mt-6 max-w-2xl space-y-5 leading-relaxed text-muted-foreground">
                {phase.body.map((para) => (
                  <p key={para.slice(0, 24)}>{para}</p>
                ))}
              </div>
              <p className="mt-8 max-w-2xl border-l-2 border-foreground pl-5 font-serif text-lg italic text-serif">
                {phase.out}
              </p>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section id="book" className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <p className="label-caps">Step one takes thirty minutes</p>
          <h2 className="mt-8 max-w-3xl font-display text-4xl font-extrabold uppercase leading-[1.02] tracking-tight text-balance sm:text-6xl">
            Start with the{" "}
            <span className="font-serif font-medium normal-case italic tracking-normal text-serif">
              fit call.
            </span>
          </h2>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <a
              href={BOOK_CALL_URL}
              className="border border-foreground px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] transition-colors hover:bg-foreground hover:text-background"
            >
              Book a fit call →
            </a>
            <Link
              to="/"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Back to the studio
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-6 py-8 sm:flex-row sm:items-center">
          <span className="font-display text-sm font-extrabold uppercase tracking-[0.15em]">
            Second Draft
          </span>
          <span className="label-caps">
            © 2026 · Brand / Web / Content / AI Systems
          </span>
        </div>
      </footer>
    </div>
  );
}
