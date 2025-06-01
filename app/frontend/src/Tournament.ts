import { TournamentDTO } from "./types/ITournament";
import { BracketMatch } from "./types/IMatch";

export class Tournament {
  constructor(
    private tournamentName: string,
    private numberOfPlayers: number,
    private userId: number,
    private userNickname: string,
    private bracket: BracketMatch[],
    private tournamentId?: number
  ) {}

  static fromUsernames(
    playerNicknames: string[],
    tournamentName: string,
    numberOfPlayers: number,
    userNickname: string,
    userId: number
  ): Tournament {
    const bracket = Tournament.generateBracket(
      playerNicknames,
      numberOfPlayers
    );
    return new Tournament(
      tournamentName,
      numberOfPlayers,
      userId,
      userNickname,
      bracket
    );
  }

  private static generateBracket(
    playerNicknames: string[],
    numberOfPlayers: number
  ): BracketMatch[] {
    const totalRounds = Math.log2(numberOfPlayers);
    const bracket: BracketMatch[] = [];
    let currentMatchId = 1;

    const roundMatches: number[][] = [];
    let matchCount = numberOfPlayers / 2;

    for (let round = 1; round <= totalRounds; round++) {
      const matchIds: number[] = [];
      for (let i = 0; i < matchCount; i++) {
        bracket.push({
          matchId: currentMatchId,
          round,
          player1: null,
          player2: null,
          winner: null
        });
        matchIds.push(currentMatchId++);
      }
      roundMatches.push(matchIds);
      matchCount = matchCount / 2;
    }

    // Link nextMatchId and winnerSlot
    for (let r = 0; r < roundMatches.length - 1; r++) {
      const current = roundMatches[r];
      const next = roundMatches[r + 1];

      for (let i = 0; i < current.length; i++) {
        const match = bracket.find((m) => m.matchId === current[i])!;
        match.nextMatchId = next[Math.floor(i / 2)];
        match.winnerSlot = i % 2 === 0 ? 1 : 2;
      }
    }

    // Assign usernames to round 1
    const shuffled = this.shuffle(playerNicknames, false);
    const firstRound = roundMatches[0];

    for (let i = 0; i < shuffled.length; i += 2) {
      const match = bracket.find((m) => m.matchId === firstRound[i / 2])!;
      const nickname1 = shuffled[i];
      const nickname2 = shuffled[i + 1];

      match.player1 = nickname1;
      match.player2 = nickname2;
    }

    return bracket;
  }

  public updateBracketWithResult(matchId: number, winner: string): void {
    const updated = this.bracket.map((m) => ({ ...m })); // clone

    const match = updated.find((m) => m.matchId === matchId);
    if (!match) throw new Error("Match not found");

    match.winner = winner;

    if (match.nextMatchId && match.winnerSlot) {
      const nextMatch = updated.find((m) => m.matchId === match.nextMatchId);
      if (!nextMatch) throw new Error("Next match not found");

      if (match.winnerSlot === 1) {
        nextMatch.player1 = winner;
      } else {
        nextMatch.player2 = winner;
      }
    }

    this.bracket = updated;
  }

  public getNextMatchToPlay(): BracketMatch | null {
    return (
      this.bracket
        .filter(
          (match) =>
            match.player1 !== null &&
            match.player2 !== null &&
            match.winner === null
        )
        .sort((a, b) => {
          // Prioritize by round, then matchId
          if (a.round !== b.round) return a.round - b.round;
          return a.matchId - b.matchId;
        })[0] || null
    );
  }

  public getBracket(): BracketMatch[] {
    return this.bracket;
  }

  public setId(Id: number): void {
    this.tournamentId = Id;
  }

  public getId(): number {
    if (!this.tournamentId) {
      throw new Error("TournamentId is not set");
    }
    return this.tournamentId;
  }

  public getUserNickname(): string | null {
    return this.userNickname;
  }

  public toJSON(): TournamentDTO {
    return {
      name: this.tournamentName,
      maxPlayers: this.numberOfPlayers,
      userId: this.userId,
      userNickname: this.userNickname,
      bracket: JSON.stringify(this.bracket)
    };
  }

  public static shuffle(array: string[], inPlace: boolean = true): string[] {
    // If we don't want to modify the original, copy it
    const result = inPlace ? array : [...array];

    for (let i = result.length - 1; i > 0; i--) {
      // Pick a random index from 0 to i
      const j = Math.floor(Math.random() * (i + 1));

      // Swap elements result[i] and result[j]
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }

  public getTournamentWinner(): string | null {
    const finalMatch = this.bracket.find((match) => !match.nextMatchId);
    return finalMatch?.winner ?? null;
  }

  public getTournamentName(): string {
    return this.tournamentName;
  }
}
