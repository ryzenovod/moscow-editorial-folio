import Image from "next/image";

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
    <div
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
    </div>
  );
}
