import type { Media } from "@/types";

/**
 * BUILD 01.2 homepage photography registry.
 * These optimized web derivatives come from the supplied, unmodified United
 * originals in /public/images/club/united. Components retain fixed aspect ratios
 * and keep crop decisions here rather than scattering paths through the UI.
 */
export const homepageMedia: {
  hero: Media;
  join: Media;
  game: Media;
  community: Media;
  news: Media[];
  gallery: Media[];
  beyond: Media[];
} = {
  hero: {
    src: "/media/club/united/img-5667.webp",
    alt: "Softball batter, catcher and umpire ready at home plate during a daytime game.",
    label: "Daytime game action",
    position: "42% 45%",
    mobilePosition: "41% 42%",
    sizes: "(max-width: 700px) 115vw, (max-width: 1000px) 72vw, 58vw",
    preload: true,
  },
  join: {
    src: "/media/club/united/img-5656.webp",
    alt: "United Softball Club players gathered together in a team huddle.",
    label: "Team huddle",
    position: "56% 45%",
    mobilePosition: "49% 45%",
    sizes: "(max-width: 700px) 105vw, 65vw",
  },
  game: {
    src: "/media/club/united/img-5666.webp",
    alt: "Softball batter at the plate during a daytime game.",
    label: "Game-day action",
    position: "48% 42%",
  },
  community: {
    src: "/media/club/united/img-5655.webp",
    alt: "United Softball Club players standing arm in arm before play.",
    label: "Community and belonging",
    position: "51% 48%",
  },
  news: [
    {
      src: "/media/club/united/img-5664.webp",
      alt: "United Softball Club players together with medals and a championship banner.",
      label: "Club achievement",
      position: "50% 42%",
      mobilePosition: "51% 38%",
      sizes: "(max-width: 700px) 100vw, 65vw",
    },
    {
      src: "/media/club/united/img-5631.webp",
      alt: "Softball players from several teams smiling together on the field.",
      label: "Club community",
      position: "50% 44%",
      sizes: "(max-width: 700px) 100vw, 34vw",
    },
    {
      src: "/media/club/united/img-5632.webp",
      alt: "United Softball Club members together at a club awards gathering.",
      label: "Club life",
      position: "52% 42%",
      sizes: "(max-width: 700px) 100vw, 34vw",
    },
  ],
  gallery: [
    {
      src: "/media/club/united/img-5666.webp",
      alt: "Softball batter, catcher and umpire set at home plate during a daytime game.",
      label: "On the diamond",
      position: "50% 38%",
      sizes: "(max-width: 700px) 100vw, 50vw",
    },
    {
      src: "/media/club/united/img-5649.webp",
      alt: "United Softball Club players gathered beside their team area on game day.",
      label: "In the dugout",
      position: "48% 48%",
      mobilePosition: "45% 40%",
      sizes: "(max-width: 700px) 50vw, 25vw",
    },
    {
      src: "/media/club/united/img-5646.webp",
      alt: "United Softball Club players posing together on the field after a game.",
      label: "Team spirit",
      position: "50% 45%",
      sizes: "(max-width: 700px) 50vw, 25vw",
    },
    {
      src: "/media/club/united/img-5662.webp",
      alt: "United Softball Club trophies and awards arranged together.",
      label: "The details",
      position: "50% 52%",
      sizes: "(max-width: 700px) 100vw, 50vw",
    },
  ],
  beyond: [
    {
      src: "/media/club/united/img-5672.webp",
      alt: "United Softball Club batter preparing to hit during a daytime game.",
      label: "Learn and develop",
      position: "50% 42%",
      sizes: "(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 34vw",
    },
    {
      src: "/media/club/united/img-5633.webp",
      alt: "United Softball Club members sharing a social awards moment together.",
      label: "Events",
      position: "53% 46%",
      sizes: "(max-width: 700px) 100vw, 50vw",
    },
    {
      src: "/media/club/united/img-5655.webp",
      alt: "United Softball Club players standing together in a night-game huddle.",
      label: "Community",
      position: "52% 48%",
      sizes: "(max-width: 700px) 100vw, 50vw",
    },
  ],
};
