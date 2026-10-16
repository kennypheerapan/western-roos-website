"use client";
import { joinHref } from "@/lib/enquiry";
import { useState } from "react";
import Link from "next/link";
import { clubs } from "@/config/brands";
import { getTeams, teamContext, type ClubTeam } from "@/data/teams";
import { BrandMark, Button, MediaArea, clubStyle } from "@/components/ui";
import { FixtureCard } from "@/components/competition/cards";

export function TeamExplorer({ club, snapshot, approvedTeams }: { club?: string; snapshot: number; approvedTeams?: ClubTeam[] }) {
  const [selected, setSelected] = useState(club ?? "");
  const [competition, setCompetition] = useState("");
  const [division, setDivision] = useState("");
  const entries = (approvedTeams ?? getTeams()).map(team => ({ team, context: teamContext(team, snapshot) }));
  const owned = entries.filter(({ team }) => !selected || team.club === selected);
  const competitions = [...new Map(owned.flatMap(({ context }) => context.tournaments).map(t => [t.id, t])).values()];
  const divisions = [...new Map(owned.flatMap(({ context }) => context.divisions).filter(d => !competition || d.tournamentId === competition).map(d => [d.id, d])).values()];
  const visible = owned.filter(({ context }) => (!competition || context.tournaments.some(t => t.id === competition)) && (!division || context.divisions.some(d => d.id === division)));
  return <section className="container teams-section" id="team-explorer"><div className="teams-heading"><div><p className="eyebrow">Team explorer</p><h2>Find your team.</h2></div><p>Club colours. Playing teams.<br />Confirmed details, all in one place.</p></div>
    {!club && <div className="team-filters" role="group" aria-label="Filter teams by pathway">{[["", "All"], ["united", "United"], ["west-coast-marlins", "Marlins Masters"]].map(([value, label]) => <button key={value} aria-pressed={selected === value} onClick={() => { setSelected(value); setCompetition(""); setDivision(""); }}>{label}</button>)}</div>}
    <div className="team-selects">{competitions.length > 0 && <label>Competition<select value={competition} onChange={e => { setCompetition(e.target.value); setDivision(""); }}><option value="">All competitions</option>{competitions.map(t => <option value={t.id} key={t.id}>{t.name}</option>)}</select></label>}{divisions.length > 0 && <label>Division<select value={division} onChange={e => setDivision(e.target.value)}><option value="">All divisions</option>{divisions.map(d => <option value={d.id} key={d.id}>{d.name}</option>)}</select></label>}</div>
    <p className="team-count muted" role="status">{visible.length} published teams · {selected ? clubs.find(c => c.slug === selected)?.shortName : "All pathways"}</p>
    {visible.length ? <div className="team-grid">{visible.map(({ team, context }) => { const identity = clubs.find(c => c.slug === team.club)!; return <article className="team-card" key={team.id} style={clubStyle(identity)}><BrandMark brand={identity} compact /><p className="eyebrow">{identity.name}{team.status === "archived" ? " / Archived" : ""}</p><h3><Link href={`/teams/${team.slug}`}>{team.name}</Link></h3>{team.teamPhoto && <MediaArea media={team.teamPhoto} />}{team.season && <p>{team.season}</p>}{context.divisions.map(d => <p key={d.id}>{d.name}</p>)}{context.tournaments.map(t => <Link className="text-link" key={t.id} href={`/tournaments/${t.slug}`}>{t.name} ↗</Link>)}{context.next && <div><p className="eyebrow">Next fixture</p><FixtureCard match={context.next} /></div>}{context.latest && <div><p className="eyebrow">Latest result</p><FixtureCard match={context.latest} /></div>}<Button href={`/teams/${team.slug}`}>Explore team</Button></article>; })}</div> : <div className="team-empty"><span className="team-empty-mark" aria-hidden="true">◇</span><div><p className="eyebrow">{entries.length ? "Your selection" : "Official team details pending"}</p><h3>{entries.length ? "No teams match these filters." : <>Your pathway comes first.<br />The team follows.</>}</h3><p>{entries.length ? "Choose another pathway, competition or division to explore more teams." : "Team names, divisions and playing details will appear here once confirmed. In the meantime, explore the community club and Masters representative pathways."}</p><div className="team-actions"><Button href={selected ? `/clubs/${selected}` : "/clubs"} secondary>{selected ? "Explore the pathway" : "Meet our pathways"}</Button><Link className="text-link" href={joinHref(selected || undefined)}>Join / enquiry information ↗</Link></div></div></div>}
  </section>;
}
