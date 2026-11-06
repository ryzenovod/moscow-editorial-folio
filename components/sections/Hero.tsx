import { siteConfig } from "@/config/site";
import Reveal from "@/components/Reveal";
import Frame from "@/components/Frame";

export default function Hero() {
  const { hero } = siteConfig;

  return (
    <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 sm:pb-24 sm:pt-20">
      <Reveal>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] opacity-50">
          {hero.eyebrow}
        </span>
      </Reveal>

      <Reveal delay={80}>
        <h1 className="mt-6 max-w-4xl font-display text-4xl font-bold leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl">
          {hero.headline}
        </h1>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-end">
        <Reveal delay={150}>
          <div>
            <p className="max-w-md leading-relaxed opacity-70">{hero.sub}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-ink-900 px-7 py-3.5 font-semibold text-ink-50 transition-opacity hover:opacity-85 dark:bg-ink-100 dark:text-ink-900"
              >
                {hero.primaryCta}
              </a>
              <a
                href="#work"
                className="inline-flex items-center justify-center rounded-full border border-current/20 px-7 py-3.5 font-semibold transition-colors hover:bg-current/5"
              >
                {hero.secondaryCta}
              </a>
            </div>
          </div>
        </Reveal>

        {/* Editorial three-up. Featured gallery frames */}
        <Reveal delay={220}>
          <div className="grid grid-cols-3 gap-3">
            <Frame ratio="portrait" className="mt-10" src="/moscow-editorial-folio/photos/02_Monochrome_Profile_IMG_E3079.jpg" alt="Monochrome Profile" />
            <Frame ratio="portrait" src="/moscow-editorial-folio/photos/00_Magazine_Cover.jpg" alt="MOSCOW Magazine Cover" />
            <Frame ratio="portrait" className="mt-6" src="/moscow-editorial-folio/photos/08_Park_Promenade_IMG_E3087.jpg" alt="Park Promenade" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
