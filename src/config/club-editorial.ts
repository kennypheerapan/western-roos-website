import type { Media } from "@/types";
export type Achievement = { title: string; year?: number; competition?: string; media: Media };
export type ClubEditorial = {
  hero: Media | null;
  action: Media[];
  achievements: Achievement[];
  news: { title: string; description: string; media: Media | null; provisional: boolean }[];
  gallery: Media[];
};
const photo = (id: number, alt: string, label: string, position = "50% 50%"): Media => ({
  src: `/media/club/united/build02-${id}.webp`, alt, label, position,
  sizes: "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 640px",
});
export const clubEditorial: Record<string, ClubEditorial> = {
  united: {
    hero: { ...photo(5663, "United softball players posing together on the diamond in navy and red uniforms.", "United. Together on the diamond."), preload: true },
    action: [
      photo(5670, "United batter preparing at home plate under the floodlights.", "Under the lights", "50% 48%"),
      photo(5639, "United fielder ready with a glove during a daytime game.", "Ready for the next play", "50% 30%"),
    ],
    achievements: [{ title: "Club achievements", media: photo(5664, "United players with medals and a PSL Champions banner.", "A moment to share") }],
    news: [{ title: "The people behind the play.", description: "A space for future United stories about participation, development and club life. Official articles will be added when supplied.", media: photo(5632, "United club members together with awards at a club gathering.", "Club life"), provisional: true }],
    gallery: [
      photo(5655, "United players standing arm in arm in a huddle at a night game.", "Team", "50% 48%"),
      photo(5647, "Club members smiling together beside the diamond.", "Club life", "50% 30%"),
      photo(5656, "United players gathered in a circle beside the field at night.", "Together", "50% 45%"),
    ],
  },
  // Add approved media here; the same media slots replace the graphic compositions.
  "west-coast-marlins": { hero: null, action: [], achievements: [], news: [], gallery: [] },
};
