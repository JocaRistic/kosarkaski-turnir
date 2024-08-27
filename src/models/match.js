export class Match {
  constructor(team1, team2) {
    this.team1 = team1;
    this.team2 = team2;
    this.team1Score = 0;
    this.team2Score = 0;
    this.winner = null;
  }

  // Simulacija utakmice
  playMatch() {
    // Bolje rangiran tim, ima vece sanse za pobedom
    const rankDifference = this.team2.rank - this.team1.rank;
    const team1WinProbability = 0.5 + rankDifference / 100;

    const team1Win = Math.random() < team1WinProbability;

    // Generisanje random skora
    const score1 = getRandomScoreBetween(50, 100);
    const score2 = getRandomScoreBetween(50, 100);

    let winnerScore, losserScore;

    if (score1 > score2) {
      winnerScore = score1;
      losserScore = score2;
    } else if (score1 < score2) {
      winnerScore = score2;
      losserScore = score1;
    } else {
      winnerScore = score1;
      losserScore = score2 - getRandomScoreBetween(1, 10);
    }

    if (team1Win) {
      this.team1Score = winnerScore;
      this.team2Score = losserScore;
      this.winner = this.team1;
      this.team1.addResult(true, this.team1Score, this.team2Score);
      this.team2.addResult(false, this.team2Score, this.team1Score);
    } else {
      this.team1Score = losserScore;
      this.team2Score = winnerScore;
      this.winner = this.team2;
      this.team1.addResult(false, this.team1Score, this.team2Score);
      this.team2.addResult(true, this.team2Score, this.team1Score);
    }
  }

  // Vraca rezultat
  getResult() {
    return `${this.team1} - ${this.team2} (${this.team1Score}:${this.team2Score})`;
  }
}

// Vraca random broj izmenju min i max
function getRandomScoreBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
