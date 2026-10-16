import { Suspense } from "react";
import { homepageMedia } from "@/config/media";
import { Button, MediaArea } from "@/components/ui";
import { JoinExperience } from "./experience";
export function JoinPage() {
  return <div className="join-experience"><section className="container teams-hero join-hero"><div><p className="eyebrow">Western Roos / Join the game</p><h1>Find your place<br /><em>in the game.</em></h1><p>WRTSC welcomes new and returning players, Masters athletes, coaches, umpires, volunteers and supporters. Find your pathway through United’s community club or the West Coast Marlins Masters representative program.</p><Button href="#pathways">Find your pathway</Button></div><figure><MediaArea media={{ ...homepageMedia.join, preload: true }} /><figcaption>United Softball Club / Part of the Western Roos family</figcaption></figure></section><div className="container join-steps" aria-label="Your journey"><span>01 / Find your pathway</span><span>02 / Explore a pathway</span><span>03 / Prepare your application</span></div><Suspense fallback={<div className="container join-block" id="pathways"><h2>Find your pathway</h2><p>Loading your options. Backend availability is checked when the form loads.</p><noscript>Enable JavaScript to explore pathways and the membership application preview.</noscript></div>}><JoinExperience /></Suspense></div>;
}
