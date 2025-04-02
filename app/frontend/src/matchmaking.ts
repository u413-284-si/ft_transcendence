import MatchAnnouncement from "./views/MatchAnnouncement";
import { Tournament } from "./types/ITournament";

export function createMatches(event: Event){
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const nicknames = Array.from(formData.entries()).map(
    ([key, value]) => value as string
  );
  console.log("Player Nicknames:", nicknames);

  // Fisher-Yates Shuffle Algorithm
  for (let i = nicknames.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nicknames[i], nicknames[j]] = [nicknames[j], nicknames[i]];
  }

  // Pair players into matches
  const matches: [string, string][] = [];
  for (let i = 0; i < nicknames.length; i += 2) {
    matches.push([nicknames[i], nicknames[i + 1]]);
  }

  // Create a tournament object
  const tournament: Tournament = {
    matches: matches,
    currentMatch: 0,
  };
}
