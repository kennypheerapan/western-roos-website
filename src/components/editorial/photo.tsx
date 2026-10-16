"use client";
import Image from "next/image";
import type { Media } from "@/types";
import { editorialImageSources } from "@/data/editorial-images";

export function EditorialPhoto({ media, featured = false }: { media: Media; featured?: boolean }) {
  // Static export disables Next's server optimizer globally. The source element
  // supplies prebuilt responsive assets while Image retains layout/alt/loading.
  return (
    <picture>
      <source type="image/webp" srcSet={editorialImageSources[media.src!]} sizes={featured
        ? "(max-width: 700px) calc(100vw - 32px), 60vw"
        : "(max-width: 700px) calc(100vw - 32px), (max-width: 1000px) 46vw, 40vw"} />
      <Image src={media.src!} alt={media.alt} fill loading={featured ? "eager" : "lazy"}
        style={{ objectFit: "cover", objectPosition: media.position }} />
    </picture>
  );
}
