import type { TournamentRead } from "./types/ITournament.ts";
import type { BracketLayout } from "./types/BracketLayout.ts";
import type { BracketMatchRead } from "./types/BracketMatch.ts";
import { formatPlayerName } from "./components/NicknameInput.js";
import type { PlayerType } from "./types/IMatch.js";

export class Tournament {
  private matchSlotMap: Record<
    number,
    { slot1?: BracketMatchRead; slot2?: BracketMatchRead }
  > = {};
  private tournamentId: number;
  private tournamentName: string;
  private userNickname: string;
  private roundReached: number;
  private bracket: BracketMatchRead[];

  constructor({
    id,
    name,
    userNickname,
    roundReached,
    bracket
  }: TournamentRead) {
    this.tournamentId = id;
    this.tournamentName = name;
    this.userNickname = userNickname;
    this.roundReached = roundReached;
    this.bracket = bracket;
    this.buildMatchSlotMap();
  }

  public updateBracketWithResult(matchNumber: number, winner: string): void {
    const updated = this.bracket.map((m) => ({ ...m })); // clone

    const match = updated.find((m) => m.matchNumber === matchNumber);
    if (!match) throw new Error(i18next.t("error.matchNotFound"));

    match.winner = winner;

    if (match.nextMatchNumber && match.winnerSlot) {
      const playerType =
        winner === match.player1Nickname
          ? match.player1Type
          : match.player2Type;
      const nextMatch = updated.find(
        (m) => m.matchNumber === match.nextMatchNumber
      );
      if (!nextMatch) throw new Error(i18next.t("error.nextMatchNotFound"));

      if (match.winnerSlot === 1) {
        nextMatch.player1Nickname = winner;
        nextMatch.player1Type = playerType;
      } else {
        nextMatch.player2Nickname = winner;
        nextMatch.player2Type = playerType;
      }
    }

    this.bracket = updated;

    const hasUserWon = winner === this.userNickname;
    if (hasUserWon) {
      this.roundReached++;
    }
  }

  public getNextMatchToPlay(): BracketMatchRead | null {
    return (
      this.bracket
        .filter(
          (match) =>
            match.player1Nickname !== null &&
            match.player2Nickname !== null &&
            match.winner === null
        )
        .sort((a, b) => {
          // Prioritize by round, then matchId
          if (a.round !== b.round) return a.round - b.round;
          return a.matchNumber - b.matchNumber;
        })[0] || null
    );
  }

  public getBracket(): BracketMatchRead[] {
    return this.bracket;
  }

  public getId(): number {
    return this.tournamentId;
  }

  public getUserNickname(): string | null {
    return this.userNickname;
  }

  public getRoundReached(): number {
    return this.roundReached;
  }

  public getTournamentWinner(): { name: string; type: PlayerType } {
    const finalMatch = this.bracket.find((match) => !match.nextMatchNumber);
    if (!finalMatch) throw new Error(i18next.t("error.matchNotFound"));
    const winnerType =
      finalMatch.winner === finalMatch.player1Nickname
        ? finalMatch.player1Type
        : finalMatch.player2Type;
    return { name: finalMatch.winner!, type: winnerType! };
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
    const nextMatchId = nextMatch?.matchNumber;

    const rounds: BracketLayout["rounds"] = [];

    for (let round = 1; round <= totalRounds; round++) {
      const roundMatches = matchesByRound[round] || [];

      const matches = roundMatches.map((match) => {
        const isPlayed = !!match.winner;
        const isNext = match.matchNumber === nextMatchId;
        const matchSlots = this.matchSlotMap[match.matchNumber];

        let player1Text =
          match.player1Nickname ??
          (matchSlots?.slot1
            ? i18next.t("global.matchWinner", {
                matchId: matchSlots.slot1.matchNumber
              })
            : i18next.t("global.toBeDefined"));

        let player2Text =
          match.player2Nickname ??
          (matchSlots?.slot2
            ? i18next.t("global.matchWinner", {
                matchId: matchSlots.slot2.matchNumber
              })
            : i18next.t("global.toBeDefined"));

        if (match.player1Type) {
          player1Text = formatPlayerName(player1Text, match.player1Type);
        }
        if (match.player2Type) {
          player2Text = formatPlayerName(player2Text, match.player2Type);
        }

        let winnerText = "";
        if (match.winner) {
          const isP1Winner = match.winner == match.player1Nickname;
          winnerText = isP1Winner ? player1Text : player2Text;
        }

        return {
          matchId: match.matchNumber,
          player1Text,
          player2Text,
          isPlayed,
          isNext,
          winner: winnerText
        };
      });

      rounds.push({ round, matches });
    }

    return { rounds };
  }

  public renderBracketHTML(layout: BracketLayout): string {
    let html = `
    <div class="w-full overflow-x-auto p-4 rounded-lg">
      <div class="flex flex-col md:flex-row justify-start gap-6 flex-wrap text-neon-cyan">
  `;

    for (const { round, matches } of layout.rounds) {
      const roundSpacing = this.getRoundSpacing(round);

      html += `
      <div class="flex-1 flex flex-col">
        <h3 class="text-center font-extrabold tracking-widest text-neon-cyan border-b-2 border-neon-cyan pb-2 mb-6 uppercase text-base md:text-lg">
          ${i18next.t("global.round", { round: round })}
        </h3>
        <div class="flex flex-col h-full justify-between space-y-4 ${roundSpacing}">
    `;

      for (const match of matches) {
        // Background and border for card
        const cardBg = match.isPlayed
          ? "bg-emerald-dark"
          : match.isNext
            ? "bg-black ring-2 ring-neon-cyan"
            : "bg-emerald-light";

        const borderGlow = match.isNext ? "shadow-neon-cyan" : "shadow-inner";

        const textColor = match.isPlayed ? "text-teal" : "text-neon-cyan";

        html += `
        <div class="${cardBg} ${textColor} p-4 rounded-lg ${borderGlow} text-xs md:text-sm transition-all duration-300 ease-in-out">
          <h4 class="font-bold text-center text-sm md:text-base mb-3 uppercase tracking-wide">${i18next.t("global.match", { matchId: match.matchId })}</h4>
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
              ${match.winner === match.player2Text ? "🏆" : ""}
              <span class="truncate block overflow-hidden whitespace-nowrap text-ellipsis w-full" title="${match.player2Text}">
                ${match.player2Text}
              </span>
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
      if (!match.nextMatchNumber || !match.winnerSlot) {
        continue;
      }
      this.matchSlotMap[match.nextMatchNumber] ??= {};

      const slotKey = match.winnerSlot === 1 ? "slot1" : "slot2";
      this.matchSlotMap[match.nextMatchNumber][slotKey] = match;
    }
  }
}
