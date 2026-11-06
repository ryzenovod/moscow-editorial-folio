"use client";

import { useState } from "react";
import Frame from "@/components/Frame";
import { siteConfig } from "@/config/site";
import Tilt from "react-parallax-tilt";
import { motion, AnimatePresence } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";

type PhotoItem = {
  id: number;
  title: string;
  src: string;
  width: number;
  height: number;
  ratio: "portrait" | "landscape" | "square";
};

type Shot = {
  gallery: string;
  galleryName: string;
  index: number;
  ratio: string;
  photo: PhotoItem;
};

/**
 * Filterable masonry gallery with a physical 3D glare tilt,
 * FLIP grid transitions, factory 4K Zoom Lightbox, and Before/After slider.
 */
export default function Gallery() {
  const galleries = siteConfig.galleries;
  const [active, setActive] = useState<string>("all");
  const [open, setOpen] = useState<number | null>(null);
  const [compareMode, setCompareMode] = useState<boolean>(false);

  const shots: Shot[] = galleries.flatMap((g) =>
    g.photos.map((p, i) => ({
      gallery: g.slug,
      galleryName: g.name,
      index: i,
      ratio: p.ratio ?? "portrait",
      photo: p,
    })),
  );

  const visible =
    active === "all" ? shots : shots.filter((s) => s.gallery === active);

  const slides = visible.map((s) => ({
    src: s.photo.src,
    alt: s.photo.title,
    title: s.photo.title,
    description: `${s.photo.title} · ${s.galleryName}`,
  }));

  return (
    <section id="work" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] opacity-50">
              Selected series
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-5xl">
              The Portfolio
            </h2>
          </div>

          {/* Filters & Comparison Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <FilterButton
              label={`All ${shots.length} Works`}
              isActive={active === "all"}
              onClick={() => {
                setActive("all");
                setOpen(null);
              }}
            />
            {galleries.map((g) => (
              <FilterButton
                key={g.slug}
                label={g.name}
                isActive={active === g.slug}
                onClick={() => {
                  setActive(g.slug);
                  setOpen(null);
                }}
              />
            ))}

            <button
              type="button"
              onClick={() => setCompareMode(!compareMode)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                compareMode
                  ? "bg-amber-600 text-white shadow-sm"
                  : "border border-amber-600/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/10"
              }`}
              aria-pressed={compareMode}
            >
              <span>{compareMode ? "⇄ Exit Comparison" : "⇄ Raw vs Retouch"}</span>
            </button>
          </div>
        </div>

        {active !== "all" && (
          <p className="mt-5 max-w-xl text-sm opacity-60">
            {galleries.find((g) => g.slug === active)?.blurb}
          </p>
        )}

        {compareMode && (
          <p className="mt-4 text-xs font-medium tracking-wide text-amber-700 dark:text-amber-400">
            Drag the central slider left/right on any photo to inspect iPhone RAW original vs 2K AI Retouch.
          </p>
        )}

        <div className="masonry mt-10">
          <AnimatePresence mode="popLayout">
            {visible.map((s, i) => (
              <motion.div
                key={`${s.gallery}-${s.index}-${s.photo.id}`}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="mb-6 block w-full text-left"
              >
                {compareMode ? (
                  <div className="relative overflow-hidden rounded-sm aspect-[4/5] shadow-sm">
                    <ReactCompareSlider
                      itemOne={
                        <ReactCompareSliderImage
                          src={s.photo.src.replace("/photos/", "/raw/")}
                          alt={`${s.photo.title} (iPhone Raw)`}
                        />
                      }
                      itemTwo={
                        <ReactCompareSliderImage
                          src={s.photo.src}
                          alt={`${s.photo.title} (2K Master Retouch)`}
                        />
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setOpen(i)}
                    className="group block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-current text-left"
                    aria-label={`Open ${s.photo.title} in lightbox`}
                  >
                    <Tilt
                      glareEnable={true}
                      glareMaxOpacity={0.18}
                      glareColor="#ffffff"
                      glarePosition="all"
                      tiltMaxAngleX={6}
                      tiltMaxAngleY={6}
                      scale={1.015}
                      transitionSpeed={1500}
                      className="w-full transition-opacity duration-300 group-hover:opacity-85 shadow-sm"
                    >
                      <Frame
                        ratio={s.ratio}
                        src={s.photo.src}
                        alt={s.photo.title}
                      />
                    </Tilt>
                  </button>
                )}
                <div className="mt-2.5 px-0.5">
                  <p className="text-xs font-medium tracking-wide opacity-90">{s.photo.title}</p>
                  <p className="text-[10px] uppercase tracking-wider opacity-50 mt-0.5">{s.galleryName}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Official Factory Lightbox with Zoom and Fullscreen */}
      <Lightbox
        open={open !== null}
        index={open ?? 0}
        close={() => setOpen(null)}
        slides={slides}
        plugins={[Fullscreen, Zoom]}
      />
    </section>
  );
}

function FilterButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-ink-900 text-ink-50 dark:bg-ink-100 dark:text-ink-900"
          : "border border-current/15 opacity-70 hover:opacity-100"
      }`}
    >
      {label}
    </button>
  );
}
