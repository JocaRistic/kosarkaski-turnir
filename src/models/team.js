export class Team {
  constructor(name, isoCode, rank) {
    this.name = name;
    this.isoCode = isoCode;
    this.rank = rank;
    this.points = 0;
    this.wins = 0;
    this.losses = 0;
    this.scoredPoints = 0;
    this.receivedPoints = 0;
    this.afterGroupRank;
  }

  // Azuriranje podataka za tim nakon meca
  addResult(won, scoredPoints, receivedPoints) {
    this.scoredPoints += scoredPoints;
    this.receivedPoints += receivedPoints;
    if (won) {
      this.wins += 1;
      this.points += 2;
    } else {
      this.losses += 1;
      this.points += 1;
    }
  }

  // Dodaj rank tima nakon grupne faze
  addGroupRank(rank) {
    this.afterGroupRank = rank;
  }
}
