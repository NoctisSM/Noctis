import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import workSolar from "@/assets/work-solar.jpg";
import workSolarCurrent from "@/assets/work-solar-current.jpg";
import workGrant from "@/assets/work-grant.jpg";
import workDah from "@/assets/work-dah.jpg";
import offerDifferentiation from "@/assets/offer-differentiation.jpg";
import offerTransformation from "@/assets/offer-transformation.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Second Draft — Brand, Web, Content & AI Systems" },
      {
        name: "description",
        content:
          "Second Draft helps growing businesses rethink how they look, speak, and work through brand, web, content, and AI systems.",
      },
      { property: "og:title", content: "Second Draft — Brand, Web, Content & AI Systems" },
      {
        property: "og:description",
        content:
          "A founder-led transformation studio for businesses ready to look, speak, and work like what they have become.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const BOOK_CALL_URL = "#book";
const BUSINESS_START = new Date("2020-03-04T00:00:00-08:00");

// NOTE: `result` lines are 4th Park–style placeholder outcomes — swap with real
// client results when available.
const work = [
  { src: workSolarCurrent, before: workSolar, name: "Solar Pool Services", tag: "Web · Brand", size: "wide", result: "A dated, hard-to-find website rebuilt into a modern presence that finally matches the quality of their installations." },
  { src: workGrant, name: "Mygrant Glass", tag: "Web · AI Systems", size: "standard", result: "A family-owned auto glass wholesaler given a dependable online storefront for the shops that order from them daily." },
  { src: workDah, name: "Dahtech", tag: "Web · Brand", size: "wide", result: "A Salesforce consultancy positioned with a brand and website as sharp as the practice behind it." },
];

const offerings = [
  { eyebrow: "01 — Market Differentiation", lead: "Positioning growing businesses as the obvious choice in their market through", systems: "Brand & Content Systems", src: offerDifferentiation },
  { eyebrow: "02 — Digital Transformation", lead: "Rebuilding how growing businesses show up and operate online through", systems: "Web & AI Systems", src: offerTransformation },
];

const services = [
  {
    num: "01",
    title: "Brand System",
    body: "This approach is designed to establish a cohesive brand presence across all touchpoints.",
    includes: ["Brand Strategy", "Brand Identity", "Brand Assets", "Photography", "Videography", "Brand Guidelines"],
  },
  {
    num: "02",
    title: "Web System",
    body: "This approach is designed to create and maintain an impactful online presence.",
    includes: ["Web Strategy", "Web Hosting Setup", "Content Architecture", "Web Design & Development"],
  },
  {
    num: "03",
    title: "Content System",
    body: "This approach is designed to manage content across major platforms.",
    includes: ["Content Strategy", "Website Management", "Blog Management", "Social Media Management", "Email Management"],
  },
  {
    num: "04",
    title: "Second Draft AI System",
    body: "This approach is designed to implement a workflow automation that streamlines operations.",
    includes: ["AI Strategy", "Automation Development", "Automation Deployment", "Training", "Management & Optimization"],
  },
];

function BusinessDays() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(Math.floor((Date.now() - BUSINESS_START.getTime()) / 86_400_000));
  }, []);

  return <span>{days === null ? "In business since March 4, 2020" : `${days.toLocaleString()} days in business since March 4, 2020.`}</span>;
}

function Arrow() {
  return <span aria-hidden="true" className="text-base leading-none">↗</span>;
}

function Index() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <a href="#top" className="brand-wordmark" aria-label="Second Draft, home">
            Second Draft<span className="text-primary">.</span>
          </a>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
            <a href="#work" className="nav-link">Case Studies</a>
            <a href="#expertise" className="nav-link">Expertise</a>
            <Link to="/methodology" className="nav-link">Methodology</Link>
            <a href="#studio" className="nav-link">Studio</a>
          </nav>
          <Button asChild variant="outline" className="h-10 rounded-full border-foreground bg-transparent px-5 text-xs font-semibold shadow-none hover:bg-foreground hover:text-background">
            <a href={BOOK_CALL_URL}>Book a Fit Call <Arrow /></a>
          </Button>
        </div>
      </header>

      <main id="top">
        <section className="hero-field border-b border-border">
          <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-screen-2xl flex-col justify-end px-5 pb-10 pt-24 sm:px-8 sm:pb-14 lg:px-10 lg:pb-16">
            <p className="animate-rise mb-8 text-sm font-medium">Second Draft® — An independent transformation studio</p>
            <h1 className="animate-rise max-w-[1320px] font-display text-[clamp(2.9rem,6.4vw,7.2rem)] font-normal leading-[0.94] text-balance" style={{ animationDelay: "0.08s" }}>
              We help growing businesses rethink how they look, speak, and work <span className="text-muted-foreground">through Brand, Web, Content, &amp; AI Systems.</span>
            </h1>
            <div className="animate-rise mt-10 flex flex-wrap gap-3" style={{ animationDelay: "0.16s" }}>
              <Button asChild variant="outline" className="h-12 rounded-full border-foreground bg-transparent px-6 text-xs font-semibold shadow-none hover:bg-foreground hover:text-background">
                <a href="#work">Learn More <Arrow /></a>
              </Button>
              <Button asChild className="h-12 rounded-full px-6 text-xs font-semibold shadow-none">
                <a href={BOOK_CALL_URL}>Book a Fit Call <Arrow /></a>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-foreground text-background" aria-label="Trusted clients and experience">
          <div className="mx-auto max-w-screen-2xl px-5 pt-12 sm:px-8 lg:px-10">
            <p className="eyebrow text-background/55">Trusted by these companies &amp; organizations</p>
            <p className="mt-6 text-xl font-medium sm:text-2xl"><BusinessDays /></p>
          </div>
          <div className="overflow-hidden pb-10 pt-8">
            <div className="marquee-track">
              {[0, 1].map((copy) => (
                <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
                  {['Solar Pool Services', 'Mygrant Glass', 'Dahtech'].map((client) => (
                    <li key={client} className="flex items-center whitespace-nowrap text-xs font-semibold uppercase tracking-widest sm:text-sm">
                      <span className="px-6">{client}</span>
                      <span aria-hidden="true" className="text-background/40">·</span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </section>

        <section aria-label="What Second Draft delivers" className="border-b border-border">
          <div className="mx-auto grid max-w-screen-2xl lg:grid-cols-2">
            {offerings.map((offering, i) => (
              <article key={offering.eyebrow} className={i === 0 ? "border-b border-border lg:border-b-0 lg:border-r" : ""}>
                <div className="project-frame aspect-[16/8]">
                  <img src={offering.src} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 hover:scale-[1.02]" />
                </div>
                <div className="px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
                  <p className="eyebrow mb-5">{offering.eyebrow}</p>
                  <h3 className="max-w-xl font-display text-2xl leading-snug sm:text-3xl">
                    {offering.lead} <span className="italic text-primary">{offering.systems}</span>.
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="scroll-mt-20 border-b border-border py-20 sm:py-28">
          <div className="mx-auto max-w-screen-2xl px-5 sm:px-8 lg:px-10">
            <div className="mb-12 grid gap-6 sm:grid-cols-2 sm:items-end">
              <h2 className="section-title">Our Case Studies</h2>
              <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:justify-self-end">How we think, strategize, and implement—the approaches and results behind every transformation.</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {work.map((item, index) => (
                <figure key={item.name} className={`group ${index === 0 || index === 3 ? "lg:col-span-2" : ""}`}>
                  <div className={`project-frame ${index === 0 || index === 3 ? "aspect-[16/8]" : "aspect-[4/3]"}`}>
                    {item.before ? (
                      <div className="grid h-full grid-cols-2">
                        <div className="relative overflow-hidden border-r border-background/30">
                          <img src={item.before} alt={`${item.name} website before`} className="h-full w-full object-cover object-top grayscale transition duration-700 group-hover:grayscale-0" />
                          <span className="image-label">Before</span>
                        </div>
                        <div className="relative overflow-hidden">
                          <img src={item.src} alt={`${item.name} website after`} className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-[1.02]" />
                          <span className="image-label">After</span>
                        </div>
                      </div>
                    ) : (
                      <img src={item.src} alt={`${item.name} transformed website`} loading="lazy" className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-[1.02]" />
                    )}
                  </div>
                  <figcaption className="py-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-4">
                      <h3 className="font-display text-2xl sm:text-3xl">{item.name}</h3>
                      <span className="eyebrow">{item.tag}</span>
                    </div>
                    <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{item.result}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section id="methodology" className="scroll-mt-20 border-b border-border">
          <div className="mx-auto grid max-w-screen-2xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.9fr_2.1fr] lg:px-10">
            <div>
              <p className="eyebrow">Our Methodology</p>
              <h2 className="mt-8 section-title">Three phases.<br /><span className="font-serif font-normal italic text-primary">One way of working.</span></h2>
              <Button asChild variant="link" className="mt-8 h-auto p-0 text-xs font-semibold uppercase tracking-widest text-foreground underline decoration-primary underline-offset-4">
                <Link to="/methodology">See the full methodology</Link>
              </Button>
            </div>
            <ol className="border-t border-border">
              {[
                { num: "01", name: "The Fit Call", desc: "Discover the problem and the goal." },
                { num: "02", name: "The Second Draft", desc: "Develop the solution." },
                { num: "03", name: "Launch & Manage", desc: "Deploy the solution—and keep it working." },
              ].map((phase) => (
                <li key={phase.num} className="grid gap-4 border-b border-border py-7 sm:grid-cols-[4rem_0.8fr_1.2fr] sm:items-baseline">
                  <span className="eyebrow">{phase.num}</span>
                  <h3 className="text-xl font-medium sm:text-2xl">{phase.name}</h3>
                  <p className="leading-relaxed text-muted-foreground">{phase.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="expertise" className="scroll-mt-20 border-b border-border">
          <div className="mx-auto max-w-screen-2xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
            <p className="eyebrow mb-8">Our Expertise</p>
            <h2 className="max-w-5xl font-display text-[clamp(2.5rem,5vw,5.8rem)] font-normal leading-[0.96] text-balance">An integrated ecosystem.</h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Our expertise centers around the systems that drive market differentiation and digital transformation.
            </p>
            <div className="mt-16 border-t border-border">
              {services.map((service) => (
                <div key={service.num} className="service-row grid gap-5 border-b border-border py-7 sm:grid-cols-[4rem_1fr] sm:items-start sm:py-9">
                  <span className="eyebrow">{service.num}</span>
                  <div>
                    <h3 className="text-2xl font-medium sm:text-3xl">{service.title}</h3>
                    <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{service.body}</p>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      It includes <span className="text-primary" aria-hidden="true">➤</span> {service.includes.join(", ")}, etc.
                    </p>
                    <Button asChild variant="link" className="mt-4 h-auto p-0 text-xs font-semibold uppercase tracking-widest text-foreground underline decoration-primary underline-offset-4">
                      <Link to="/methodology">Learn more</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-label="Our ethos" className="border-b border-border">
          <div className="mx-auto max-w-screen-2xl px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
            <p className="eyebrow mb-8">Our Ethos</p>
            <p className="max-w-4xl font-display text-[clamp(1.7rem,3.2vw,3rem)] font-normal leading-snug text-balance">
              Second Draft® is an independent transformation studio led by Samhith Mitra. We partner with growing businesses to modernize how they look, speak, and work—building and managing their <span className="italic text-primary">Brand, Web, Content, and AI Systems</span> as one connected practice.
            </p>
          </div>
        </section>

        <section id="studio" className="scroll-mt-20 border-b border-border bg-secondary">
          <div className="mx-auto grid max-w-screen-2xl gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1fr_1.35fr] lg:px-10">
            <div>
              <p className="eyebrow">The studio</p>
              <h2 className="mt-8 section-title">Small on purpose.<br /><span className="font-serif font-normal italic text-primary">Serious by design.</span></h2>
            </div>
            <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-muted-foreground lg:pt-12">
              <p>Second Draft is led by Samhith Mitra. The person who hears the problem is the person who shapes the strategy, designs the pages, writes the words, and follows the work through.</p>
              <p>No account-manager relay. No work disappearing into a production line. Just one accountable creative partner, bringing every part of the business into focus.</p>
              <Button asChild variant="link" className="h-auto p-0 text-foreground underline decoration-primary underline-offset-8">
                <Link to="/methodology">Learn how the work gets done <Arrow /></Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="book" className="bg-foreground text-background">
          <div className="mx-auto max-w-screen-2xl px-5 py-24 sm:px-8 sm:py-32 lg:px-10">
            <p className="eyebrow text-background/55">A better next version starts here</p>
            <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
              <h2 className="font-display text-[clamp(3.2rem,7vw,8rem)] font-normal leading-[0.9]">Ready for your<br /><span className="italic text-accent">second draft?</span></h2>
              <div className="space-y-6 lg:pb-3">
                <p className="leading-relaxed text-background/65">Bring your current site and the one thing you wish it communicated better. Leave with a clear point of view on what should change first.</p>
                <Button asChild className="h-12 rounded-full bg-background px-6 text-xs font-semibold text-foreground shadow-none hover:bg-accent hover:text-accent-foreground">
                  <a href={BOOK_CALL_URL}>Book a Fit Call <Arrow /></a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-background/15 bg-foreground text-background">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
          <span className="brand-wordmark">Second Draft<span className="text-accent">.</span></span>
          <span className="eyebrow text-background/50">© 2026 · Brand / Web / Content / AI Systems</span>
        </div>
      </footer>
    </div>
  );
}