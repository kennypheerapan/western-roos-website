import type { Metadata } from "next";
import { Gallery } from "@/components/editorial/gallery";
import { ManagedSection } from '@/components/content/published';
export const dynamic='force-dynamic';
export const metadata: Metadata = { title: "Club gallery", description: "Supplied United club photography from the Western Roos family." };
export default function GalleryPage() { return <><div className="container editorial-page"><header className="editorial-intro"><p className="eyebrow">Western Roos / The moments that matter</p><h1>Club gallery</h1><p>On the diamond. Together as a team. Part of something bigger.</p><p className="editorial-disclosure">From the supplied United photography collection. Event details and dates are pending.</p></header><Gallery /></div><ManagedSection kinds={['album']} title="Approved photo & video albums"/></>; }
