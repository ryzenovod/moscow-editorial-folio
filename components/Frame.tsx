"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const RATIO_CLASS: Record<string, string> = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[3/2]",
  square: "aspect-square",
};

export default function Frame({
  ratio = "portrait",
  className = "",
  alt,
  src,
}: {
  seed?: string;
  index?: number;
  ratio?: string;
  className?: string;
  alt?: string;
  src?: string;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 35, scale: 0.96, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-sm ${RATIO_CLASS[ratio] ?? RATIO_CLASS.portrait} ${className}`}
      role={alt ? "img" : undefined}
      aria-label={alt}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? "Editorial photograph"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-neutral-800" />
      )}
    </motion.div>
  );
}
