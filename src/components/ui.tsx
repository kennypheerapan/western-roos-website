import Link from "next/link";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { Brand, Media } from "@/types";
export function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
export function Button({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      className={`button ${secondary ? "button-secondary" : ""}`}
      href={href}
    >
      {children}
      <Arrow />
    </Link>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  href,
  link,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  link?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {link}
          <Arrow />
        </Link>
      )}
    </div>
  );
}
export function BrandMark({
  brand,
  compact = false,
}: {
  brand: Brand;
  compact?: boolean;
}) {
  const src = compact ? (brand.compactLogo ?? brand.logo) : brand.logo;
  return src ? (
    <Image
      className="brand-logo"
      src={src}
      alt={`${brand.name} logo`}
      width={160}
      height={100}
    />
  ) : (
    <span
      className={`brand-placeholder ${compact ? "compact" : ""}`}
      aria-label={`${brand.name}: official logo pending`}
    >
      <span>{brand.shortName}</span>
      <small>Logo pending</small>
    </span>
  );
}
export function clubStyle(brand: Brand): CSSProperties {
  return {
    "--club-primary": brand.primary,
    "--club-accent": brand.accent,
    "--club-secondary": brand.secondary ?? "#17233b",
    "--club-editorial-secondary": brand.editorialSecondary ?? brand.secondary,
    "--club-foreground": brand.foreground ?? "#f5f7fa",
    "--club-accent-foreground": brand.accentForeground ?? "#091323",
  } as CSSProperties;
}
export function MediaArea({
  media,
  className = "",
}: {
  media: Media;
  className?: string;
}) {
  const mediaStyle = {
    "--media-position": media.position ?? "center",
    "--media-position-mobile": media.mobilePosition ?? media.position ?? "center",
  } as CSSProperties;

  return (
    <div
      className={`media-area ${className}`}
      data-media-state={media.src ? "ready" : "placeholder"}
      data-media-source={media.src ? "official-supplied" : "pending"}
      style={mediaStyle}
    >
      {media.src ? (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes={media.sizes ?? "(max-width: 700px) 100vw, 50vw"}
          preload={media.preload}
          loading={media.preload ? undefined : "lazy"}
        />
      ) : (
        <>
          <span className="media-cross" aria-hidden="true">
            +
          </span>
          <div className="media-caption">
            <span>{media.label}</span>
          </div>
        </>
      )}
    </div>
  );
}

