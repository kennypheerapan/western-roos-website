export type Brand = {
  name: string;
  shortName: string;
  primary: string;
  accent: string;
  secondary?: string;
  editorialSecondary?: string;
  foreground?: string;
  accentForeground?: string;
  logo: string | null;
  compactLogo: string | null;
};
export type Club = Brand & {
  slug: string;
  description: string;
  focus: string;
  pathways: string[];
  parentLabel: string;
  background: string;
  tagline: string;
  photographyAvailable: boolean;
};
export type Media = {
  src: string | null;
  alt: string;
  label: string;
  position?: string;
  mobilePosition?: string;
  sizes?: string;
  preload?: boolean;
};

