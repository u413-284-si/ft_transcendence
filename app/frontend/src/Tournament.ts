export class Tournament {
  private matchesQueue: [string, string][] = [];
  private currentMatchNumber = 0;
  private currentWinner: string | null = null;

  constructor(
    private tournamentName: string,
    private numberOfPlayers: number,
    private playerNicknames: string[]
  ) {
    this.createMatches();
  }

  private createMatches() {
    // Fisher-Yates Shuffle Algorithm
    for (let i = this.numberOfPlayers - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.playerNicknames[i], this.playerNicknames[j]] = [
        this.playerNicknames[j],
        this.playerNicknames[i]
      ];
    }

    // Pair players into matches
    for (let i = 0; i < this.playerNicknames.length; i += 2) {
      this.matchesQueue.push([
        this.playerNicknames[i],
        this.playerNicknames[i + 1]
      ]);
    }
  }

  public getNextMatch(): [string, string] | null {
    if (this.matchesQueue.length === 0) {
      return null;
    }
    this.currentMatchNumber++;
    const match = this.matchesQueue.shift();
    return match ? match : null;
  }

  public setWinner(winner: string) {
    if (this.currentWinner === null) {
      this.currentWinner = winner;
      return;
    }
    this.matchesQueue.push([this.currentWinner, winner]);
    this.currentWinner = null;
  }

  public getWinner(): string | null {
    return this.currentWinner;
  }

  public getMatchNumber(): number {
    return this.currentMatchNumber;
  }
}
