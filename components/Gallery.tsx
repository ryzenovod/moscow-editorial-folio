"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Frame from "@/components/Frame";
import { siteConfig } from "@/config/site";

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
 * Filterable masonry gallery with a keyboard-accessible lightbox.
 * Preserves the original Lumen design, typography, and layout.
 */
export default function Gallery() {
  const galleries = siteConfig.galleries;
  const [active, setActive] = useState<string>("all");
  const [open, setOpen] = useState<number | null>(null);

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

  const close = useCallback(() => setOpen(null), []);
  const next = useCallback(
    () => setOpen((i) => (i === null ? null : (i + 1) % visible.length)),
    [visible.length],
  );
  const prev = useCallback(
    () =>
      setOpen((i) =>
        i === null ? null : (i - 1 + visible.length) % visible.length,
      ),
    [visible.length],
  );

  // Keyboard controls + scroll lock while the lightbox is open.
  useEffect(() => {
    if (open === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, next, prev]);

  const current = open === null ? null : visible[open];

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

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <FilterButton
              label="All 20 Frames"
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
          </div>
        </div>

        {active !== "all" && (
          <p className="mt-5 max-w-xl text-sm opacity-60">
            {galleries.find((g) => g.slug === active)?.blurb}
          </p>
        )}

        <div className="masonry mt-10">
          {visible.map((s, i) => (
            <button
              key={`${s.gallery}-${s.index}-${s.photo.id}`}
              type="button"
              onClick={() => setOpen(i)}
              className="group block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-current text-left mb-6"
              aria-label={`Open ${s.photo.title} in lightbox`}
            >
              <div className="transition-opacity duration-300 group-hover:opacity-85 shadow-sm">
                <Frame
                  ratio={s.ratio}
                  src={s.photo.src}
                  alt={s.photo.title}
                />
              </div>
              <div className="mt-2.5 px-0.5">
                <p className="text-xs font-medium tracking-wide opacity-90">{s.photo.title}</p>
                <p className="text-[10px] uppercase tracking-wider opacity-50 mt-0.5">{s.galleryName}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {current && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={current.photo.title}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous photograph"
            className="absolute left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-8"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>

          <figure
            className="max-h-[88vh] w-full max-w-4xl flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[78vh] w-full flex items-center justify-center">
              <Image
                src={current.photo.src}
                alt={current.photo.title}
                width={current.photo.width}
                height={current.photo.height}
                className="max-h-[76vh] w-auto max-w-full rounded-sm object-contain shadow-2xl"
                priority
              />
            </div>
            <figcaption className="mt-3 text-center text-xs tracking-[0.16em] text-white/70">
              <span className="font-semibold text-white uppercase">{current.photo.title}</span> · {current.galleryName} · {open! + 1} / {visible.length}
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next photograph"
            className="absolute right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-8"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      )}
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
