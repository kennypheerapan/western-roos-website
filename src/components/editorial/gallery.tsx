"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { associationLabels, galleryCategories, galleryItems } from "@/data/editorial";
import { Filters } from "./news";
import { EditorialPhoto } from "./photo";

export function Gallery() {
  const [category, setCategory] = useState("all");
  const [active, setActive] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const items = galleryItems.filter(item => category === "all" || item.category === category);
  const index = items.findIndex(item => item.id === active);
  const current = items[index];
  const isOpen = !!current;

  useEffect(() => {
    if (!isOpen) return;
    const element = dialog.current!;
    const y = window.scrollY;
    const old = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };
    element.showModal();
    // Fixed positioning also locks the background on touch browsers.
    Object.assign(document.body.style, { overflow: "hidden", position: "fixed", top: "-" + y + "px", width: "100%" });
    return () => {
      element.close();
      Object.assign(document.body.style, old);
      window.scrollTo({ top: y, behavior: "instant" });
      trigger.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  function step(delta: number) {
    setActive(items[(index + delta + items.length) % items.length].id);
  }

  return (
    <section className="editorial-section" aria-label="Club photographs">
      <Filters options={galleryCategories.filter(c => galleryItems.some(i => i.category === c.id))} value={category} onChange={setCategory} label="Gallery categories" />
      <p className="editorial-status" role="status">{items.length} photographs / Select a photograph to explore</p>
      <div className="editorial-gallery">
        {items.map((item, i) => (
          <button type="button" className="editorial-gallery-item" key={item.id} aria-label={"Open photograph: " + item.media.label} onClick={event => { trigger.current = event.currentTarget; setActive(item.id); }}>
            <div className="editorial-photo"><EditorialPhoto media={item.media} featured={i === 0} /></div>
            <span><span className="eyebrow">{associationLabels[item.club]}</span><strong>{item.media.label}</strong></span>
          </button>
        ))}
      </div>
      {!items.length && <p className="editorial-empty">Photography for this category is pending.</p>}
      <dialog ref={dialog} className="gallery-viewer" aria-labelledby="viewer-title"
        onCancel={event => { event.preventDefault(); setActive(null); }}
        onKeyDown={event => {
          if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
          if (event.key === "Tab") {
            const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
          }
        }}>
        {current && <>
          <div className="viewer-top">
            <p id="viewer-title">{current.media.label}</p>
            <button type="button" autoFocus onClick={() => setActive(null)} aria-label="Close image viewer">Close ×</button>
          </div>
          <div className="viewer-image">
            <Image key={current.id} src={current.original} alt={current.media.alt} fill sizes="100vw" loading="eager" style={{ objectFit: "contain" }} />
          </div>
          <div className="viewer-bottom">
            <button type="button" onClick={() => step(-1)} aria-label="Previous image">← Previous</button>
            <p aria-live="polite" aria-atomic="true">{index + 1} / {items.length}<span>{associationLabels[current.club]}{current.date ? " / " + current.date : ""}{current.event ? " / " + current.event : ""}</span></p>
            <button type="button" onClick={() => step(1)} aria-label="Next image">Next →</button>
          </div>
        </>}
      </dialog>
    </section>
  );
}
