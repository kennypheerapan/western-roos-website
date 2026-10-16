"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { parentBrand } from "@/config/brands";
import { navigation } from "@/config/navigation";
import { EventCategoryLink } from "./events/category-link";
import { BrandMark } from "./ui";
import { useCart } from './shop/cart-provider';
export function Navigation() {
  const {lines}=useCart();
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<string | null>(null);
  const pathname = usePathname();
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const groupToggle = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (group) { setGroup(null); groupToggle.current?.focus(); }
        else if (open) { setOpen(false); toggle.current?.focus(); }
      }
    };
    const outside = (e: PointerEvent) => { if (!header.current?.contains(e.target as Node)) { setGroup(null); setOpen(false); } };
    window.addEventListener("keydown", close);
    window.addEventListener("pointerdown", outside);
    return () => { window.removeEventListener("keydown", close); window.removeEventListener("pointerdown", outside); };
  }, [group, open]);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 1000px)");
    const reset = () => {
      setGroup(null);
      setOpen(false);
      if (media.matches && header.current?.querySelector("nav")?.contains(document.activeElement)) toggle.current?.focus();
      else if (!media.matches && document.activeElement?.closest(".nav-submenu")) groupToggle.current?.focus();
      else if (!media.matches && document.activeElement === toggle.current) header.current?.querySelector<HTMLAnchorElement>("nav > a")?.focus();
    };
    media.addEventListener("change", reset);
    return () => media.removeEventListener("change", reset);
  }, []);
  const closeAll = () => { setOpen(false); setGroup(null); };
  return <header className="site-header" ref={header} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) { setGroup(null); setOpen(false); } }}>
    <div className="nav-shell">
      <Link href="/" className="header-brand" aria-label="Western Roos home" onClick={closeAll}><BrandMark brand={parentBrand} compact /><span>WESTERN ROOS<small>TOURNAMENT SOFTBALL CLUB</small></span></Link>
      <button ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="main-navigation" onClick={() => { setOpen(!open); setGroup(null); }}>{open ? "Close ×" : "Menu ☰"}</button>
      <nav id="main-navigation" aria-label="Main navigation" className={open ? "navigation is-open" : "navigation"}>
        {navigation.map(item => "href" in item ? <Link onClick={closeAll} key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link> : <div className="nav-group" key={item.label}>
          <button className="nav-group-toggle" aria-expanded={group === item.label} aria-controls={`nav-${item.label.replaceAll(" ", "-")}`} data-active={item.children.some(child => pathname === child.href || pathname.startsWith(child.href + "/"))} onClick={e => { groupToggle.current = e.currentTarget; setGroup(group === item.label ? null : item.label); }}>{item.label} <span aria-hidden="true">⌄</span></button>
          <div className="nav-submenu" id={`nav-${item.label.replaceAll(" ", "-")}`} hidden={group !== item.label}>{item.children.map(child => child.href.includes("#") ? <EventCategoryLink key={child.href} href={child.href} onClick={closeAll}>{child.label}</EventCategoryLink> : <Link key={child.href} href={child.href} onClick={closeAll} aria-current={pathname === child.href ? "page" : undefined}>{child.label}{child.href === "/shop" ? ` · Cart (${lines.reduce((sum,line)=>sum+line.quantity,0)})` : ""}</Link>)}</div>
        </div>)}
        <Link onClick={closeAll} className="nav-join" href="/join" aria-current={pathname === "/join" ? "page" : undefined}>Join us <span aria-hidden="true">↗</span></Link>
      </nav>
    </div>
  </header>;
}
