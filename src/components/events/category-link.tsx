"use client";
import Link from "next/link";
import type { ComponentProps } from "react";

/** Preserve normal Next navigation, with native hash changes for same-page filters. */
export function EventCategoryLink({ href, onClick, ...props }: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  return <Link {...props} href={href} onClick={event => {
    onClick?.(event);
    if (!event.defaultPrevented && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0 && window.location.pathname === "/events") {
      event.preventDefault();
      window.location.hash = href.split("#")[1];
    }
  }} />;
}
