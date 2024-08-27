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
  }
}
