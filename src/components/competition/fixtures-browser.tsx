"use client";
import { useState } from "react";
import type { CompetitionData } from "@/data/competition/types";
import { filterMatches, getMatches, matchTime } from "@/data/competition";
import { brands } from "@/config/brands";
import { CompetitionEmptyState, FixtureCard, ResultCard } from "./cards";

export function FixturesBrowser({ data }: { data: CompetitionData }) {
  const [tournament, setTournament] = useState("");
  const [division, setDivision] = useState("");
  const [team, setTeam] = useState("");
  const [status, setStatus] = useState("");
  const filtered = !!(tournament || division || team || status);
  const matches = filterMatches(getMatches(data), { tournament, division, team, status });
  const upcoming = matches.filter(m => m.status !== "final").sort((a, b) => (matchTime(a) || Infinity) - (matchTime(b) || Infinity));
  const results = matches.filter(m => m.status === "final" && m.result).sort((a, b) => matchTime(b) - matchTime(a));
  return <>
    <div className="competition-filters" role="group" aria-label="Filter fixtures and results">
      <label>Tournament<select aria-label="Tournament" value={tournament} onChange={e => { setTournament(e.target.value); setDivision(""); }}><option value="">All tournaments</option>{data.tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
      <label>Division<select aria-label="Division" value={division} onChange={e => setDivision(e.target.value)}><option value="">All divisions</option>{data.divisions.filter(d => !tournament || d.tournamentId === tournament).map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
      <label>Pathway / Team<select aria-label="Pathway / Team" value={team} onChange={e => setTeam(e.target.value)}><option value="">All pathways & teams</option><optgroup label="Organisation / pathways">{Object.entries(brands).map(([id, b]) => <option key={id} value={`club:${id}`}>{b.shortName}</option>)}{[...new Set(data.teams.map(t => t.club))].filter(id => !Object.hasOwn(brands, id)).map(id => <option key={id} value={`club:${id}`}>{id}</option>)}</optgroup><optgroup label="Teams">{data.teams.map(t => <option key={t.id} value={`team:${t.id}`}>{t.name}</option>)}</optgroup></select></label>
      <label>Status<select aria-label="Status" value={status} onChange={e => setStatus(e.target.value)}><option value="">All statuses</option>{["scheduled", "live", "final", "postponed", "cancelled"].map(s => <option value={s} key={s}>{s === "scheduled" ? "Upcoming" : s[0].toUpperCase() + s.slice(1)}</option>)}</select></label>
      <button className="competition-reset" onClick={() => { setTournament(""); setDivision(""); setTeam(""); setStatus(""); }}>Reset filters</button>
    </div>
    <p className="muted" role="status">{filtered ? `${matches.length} matching matches` : "Confirmed fixtures and results"}</p>
    <section className="competition-block"><h2>{status === "live" ? "Live matches" : status === "cancelled" ? "Cancelled fixtures" : status === "postponed" ? "Postponed fixtures" : "Upcoming fixtures"}</h2><div className="competition-grid">{upcoming.length ? upcoming.map(m => <FixtureCard key={m.id} match={m} />) : <CompetitionEmptyState title={filtered ? "No matching fixtures" : "Fixtures coming soon"} description={filtered ? "Try another filter or reset your selection." : "Competition details are being prepared."} />}</div></section>
    <section id="results" className="competition-block"><h2>Latest results</h2><div className="competition-grid">{results.length ? results.map(m => <ResultCard key={m.id} match={m} />) : <CompetitionEmptyState title={filtered ? "No matching results" : "No confirmed results yet"} description={filtered ? "Try another filter or reset your selection." : "Results will appear here once confirmed."} />}</div></section>
  </>;
}

