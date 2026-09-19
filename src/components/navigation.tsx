"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { parentBrand } from "@/config/brands";
import { BrandMark } from "./ui";
export const navigation = [
  ["Home", "/"],
  ["Clubs", "/clubs"],
  ["Tournaments", "/tournaments"],
  ["Fixtures & results", "/fixtures"],
  ["Teams", "/teams"],
  ["News", "/news"],
  ["Gallery", "/gallery"],
  ["About", "/about"],
];
export function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <header className="site-header">
      <div className="nav-shell">
        <Link href="/" className="header-brand" aria-label="Western Roos home">
          <BrandMark brand={parentBrand} compact />
          <span>
            WESTERN ROOS<small>TOURNAMENT SOFTBALL CLUB</small>
          </span>
        </Link>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? "Close ×" : "Menu ☰"}
        </button>
        <nav
          id="main-navigation"
          aria-label="Main navigation"
          className={open ? "navigation is-open" : "navigation"}
        >
          {navigation.map(([label, href]) => (
            <Link
              onClick={() => setOpen(false)}
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
          <Link
            onClick={() => setOpen(false)}
            className="nav-join"
            href="/join"
          >
            Join us <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
