import { TournamentDTO } from "./types/ITournament";
import { BracketMatch } from "./types/IMatch";

type BracketLayout = {
  rounds: {
    round: number;
    matches: {
      matchId: number;
      player1Text: string;
      player2Text: string;
      isPlayed: boolean;
      isNext: boolean;
      winner: string | null;
    }[];
  }[];
};

export class Tournament {
  private feederMap: Record<
    number,
    { slot1?: BracketMatch; slot2?: BracketMatch }
  > = {};

  constructor(
    private tournamentName: string,
    private numberOfPlayers: number,
    private adminId: number,
    private bracket: BracketMatch[],
    private tournamentId?: number
  ) {
    this.buildFeederMap();
  }

  static fromUsernames(
    playerNicknames: string[],
    tournamentName: string,
    numberOfPlayers: number,
    adminId: number
  ): Tournament {
    const bracket = Tournament.generateBracket(
      playerNicknames,
      numberOfPlayers
    );
    return new Tournament(tournamentName, numberOfPlayers, adminId, bracket);
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
      match.player1 = shuffled[i];
      match.player2 = shuffled[i + 1];
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

  public toJSON(): TournamentDTO {
    return {
      name: this.tournamentName,
      maxPlayers: this.numberOfPlayers,
      adminId: this.adminId,
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

  public getBracketLayout(): BracketLayout {
    const matchesByRound = this.groupBy(this.bracket, "round");
    const totalRounds = Object.keys(matchesByRound).length;

    const nextMatch = this.bracket.find((m) => !m.winner);
    const nextMatchId = nextMatch?.matchId;

    const rounds: BracketLayout["rounds"] = [];

    for (let round = 1; round <= totalRounds; round++) {
      const roundMatches = matchesByRound[round] || [];

      const matches = roundMatches.map((match) => {
        const isPlayed = !!match.winner;
        const isNext = match.matchId === nextMatchId;
        const feeder = this.feederMap[match.matchId];

        const player1Text =
          match.player1 ??
          (feeder?.slot1 ? `Winner Match ${feeder.slot1.matchId}` : "TBD");

        const player2Text =
          match.player2 ??
          (feeder?.slot2 ? `Winner Match ${feeder.slot2.matchId}` : "TBD");

        return {
          matchId: match.matchId,
          player1Text,
          player2Text,
          isPlayed,
          isNext,
          winner: match.winner
        };
      });

      rounds.push({ round, matches });
    }

    return { rounds };
  }

  public renderBracketHTML(layout: BracketLayout): string {
    let html = `
    <div class="w-full overflow-x-auto">
      <div class="flex flex-col md:flex-row justify-start gap-4 flex-wrap text-gray-900">
  `;

    for (const { round, matches } of layout.rounds) {
      const roundSpacing = this.getRoundSpacing(round);

      html += `
      <div class="flex-1 flex flex-col">
        <h3 class="text-center font-bold text-base md:text-lg uppercase border-b pb-1 text-blue-600 border-gray-300 mb-4">
          Round ${round}
        </h3>
        <div class="flex flex-col h-full justify-between space-y-2 ${roundSpacing}">
    `;

      for (const match of matches) {
        const cardBg = match.isPlayed
          ? "bg-gray-300"
          : match.isNext
            ? "bg-yellow-100"
            : "bg-gray-100";

        const textColor = match.isPlayed ? "text-gray-500" : "text-gray-900";
        const borderStyle = match.isNext
          ? "border-2 border-yellow-400"
          : "border";

        html += `
        <div class="${cardBg} ${textColor} p-4 rounded-md shadow ${borderStyle} text-xs md:text-sm">
          <h4 class="font-bold text-center text-sm md:text-base mb-2">Match ${match.matchId}</h4>
          <div class="flex justify-between">
            <span class="font-medium">${match.player1Text}</span>
            <span class="text-green-600 font-semibold">${match.winner === match.player1Text ? "🏆" : ""}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">${match.player2Text}</span>
            <span class="text-green-600 font-semibold">${match.winner === match.player2Text ? "🏆" : ""}</span>
          </div>
        </div>
      `;
      }

      html += `
        </div>
      </div>
    `;
    }

    html += `
      </div>
    </div>
  `;

    return html;
  }

  public getBracketAsHTML(): string {
    const layout = this.getBracketLayout();
    return this.renderBracketHTML(layout);
  }

  private getRoundSpacing(round: number): string {
    const roundSpacing: Record<number, string> = {
      1: "my-0",
      2: "my-0 md:my-16",
      3: "my-0 md:my-44",
      4: "my-0 md:my-100"
    };
    return roundSpacing[round] ?? "my-0";
  }

  private groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
    return arr.reduce(
      (acc, item) => {
        const group = String(item[key]);
        if (!acc[group]) acc[group] = [];
        acc[group].push(item);
        return acc;
      },
      {} as Record<string, T[]>
    );
  }

  private buildFeederMap() {
    this.feederMap = {};

    for (const match of this.bracket) {
      if (match.nextMatchId && match.winnerSlot) {
        if (!this.feederMap[match.nextMatchId]) {
          this.feederMap[match.nextMatchId] = {};
        }

        if (match.winnerSlot === 1) {
          this.feederMap[match.nextMatchId].slot1 = match;
        } else if (match.winnerSlot === 2) {
          this.feederMap[match.nextMatchId].slot2 = match;
        }
      }
    }
  }
}
