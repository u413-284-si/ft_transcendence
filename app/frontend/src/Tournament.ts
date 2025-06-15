import { TournamentDTO } from "./types/ITournament";
import { BracketMatch } from "./types/IMatch";
import { BracketLayout } from "./types/BracketLayout";

export class Tournament {
  private matchSlotMap: Record<
    number,
    { slot1?: BracketMatch; slot2?: BracketMatch }
  > = {};

  constructor(
    private tournamentName: string,
    private numberOfPlayers: number,
    private userId: number,
    private userNickname: string,
    private bracket: BracketMatch[],
    private tournamentId?: number
  ) {
    this.buildMatchSlotMap();
  }

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

  public getBracketAsHTML(): string {
    const layout = this.createBracketLayout();
    return this.renderBracketHTML(layout);
  }

  private createBracketLayout(): BracketLayout {
    const matchesByRound = this.groupBy(this.bracket, "round");
    const totalRounds = Object.keys(matchesByRound).length;

    const nextMatch = this.getNextMatchToPlay();
    const nextMatchId = nextMatch?.matchId;

    const rounds: BracketLayout["rounds"] = [];

    for (let round = 1; round <= totalRounds; round++) {
      const roundMatches = matchesByRound[round] || [];

      const matches = roundMatches.map((match) => {
        const isPlayed = !!match.winner;
        const isNext = match.matchId === nextMatchId;
        const matchSlots = this.matchSlotMap[match.matchId];

        const player1Text =
          match.player1 ??
          (matchSlots?.slot1
            ? `Winner Match ${matchSlots.slot1.matchId}`
            : "TBD");

        const player2Text =
          match.player2 ??
          (matchSlots?.slot2
            ? `Winner Match ${matchSlots.slot2.matchId}`
            : "TBD");

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
    <div class="w-full overflow-x-auto bg-black/90 p-4 rounded-lg">
      <div class="flex flex-col md:flex-row justify-start gap-6 flex-wrap text-neon-cyan">
  `;

    for (const { round, matches } of layout.rounds) {
      const roundSpacing = this.getRoundSpacing(round);

      html += `
      <div class="flex-1 flex flex-col">
        <h3 class="text-center font-extrabold tracking-widest text-neon-cyan border-b-2 border-neon-cyan pb-2 mb-6 uppercase text-base md:text-lg">
          Round ${round}
        </h3>
        <div class="flex flex-col h-full justify-between space-y-4 ${roundSpacing}">
    `;

      for (const match of matches) {
        // Background and border for card
        const cardBg =
          !match.isPlayed && match.isNext
            ? "bg-black ring-2 ring-neon-cyan"
            : "bg-emerald";

        const borderGlow = match.isNext ? "shadow-neon-cyan" : "shadow-inner";

        const textColor = match.isPlayed ? "text-teal" : "text-neon-cyan";

        html += `
        <div class="${cardBg} ${textColor} p-4 rounded-lg ${borderGlow} text-xs md:text-sm transition-all duration-300 ease-in-out">
          <h4 class="font-bold text-center text-sm md:text-base mb-3 uppercase tracking-wide">Match ${match.matchId}</h4>
          <div class="flex justify-center items-center gap-3 md:gap-4 text-sm md:text-base font-semibold">

            <!-- Player 1 -->
            <div class="flex items-center gap-2 w-[150px]">
              ${match.winner === match.player1Text ? "🏆" : ""}
              <span class="truncate block overflow-hidden whitespace-nowrap text-ellipsis w-full" title="${match.player1Text}">
                ${match.player1Text}
              </span>
            </div>

            <!-- Separator -->
            <span class="font-light">VS</span>

            <!-- Player 2 -->
            <div class="flex items-center gap-2 w-[150px]">
              <span class="truncate block overflow-hidden whitespace-nowrap text-ellipsis w-full" title="${match.player2Text}">
                ${match.player2Text}
              </span>
              ${match.winner === match.player2Text ? "🏆" : ""}
            </div>
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

  private buildMatchSlotMap() {
    this.matchSlotMap = {};

    for (const match of this.bracket) {
      if (!match.nextMatchId || !match.winnerSlot) {
        continue;
      }
      this.matchSlotMap[match.nextMatchId] ??= {};

      const slotKey = match.winnerSlot === 1 ? "slot1" : "slot2";
      this.matchSlotMap[match.nextMatchId][slotKey] = match;
    }
  }
}
