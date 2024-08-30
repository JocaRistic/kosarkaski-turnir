export class Match {
  constructor(team1, team2, round) {
    this.team1 = team1;
    this.team2 = team2;
    this.round = round;
    this.team1Score = 0;
    this.team2Score = 0;
    this.winner = null;
    this.losser = null;
  }

  // Simulacija utakmice
  playMatch() {
    // Pozivamo metodu koja proracunava verovatnocu pobede za prvi tim
    const team1WinProbability = this.calculateWinProbability(
      this.team1,
      this.team2
    );

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
      this.losser = this.team2;
      this.team1.addResult(true, this.team1Score, this.team2Score);
      this.team2.addResult(false, this.team2Score, this.team1Score);
      // pozivamo metodu koja azurira formu timovima
      this.team1.updateForm(this.team1Score - this.team2Score, this.team2.rank);
      this.team2.updateForm(this.team2Score - this.team1Score, this.team1.rank);
    } else {
      this.team1Score = losserScore;
      this.team2Score = winnerScore;
      this.winner = this.team2;
      this.losser = this.team1;
      this.team1.addResult(false, this.team1Score, this.team2Score);
      this.team2.addResult(true, this.team2Score, this.team1Score);
      // pozivamo metodu koja azurira formu timovima
      this.team2.updateForm(this.team2Score - this.team1Score, this.team1.rank);
      this.team1.updateForm(this.team1Score - this.team2Score, this.team2.rank);
    }
  }

  // Metoda prima dva tima i vraca verovatnocu za pobedu prvog tima
  calculateWinProbability(team1, team2) {
    // Bolje rangiran tim ima vece sanse za pobedom
    const rankDifference = this.team2.rank - this.team1.rank;
    const team1BaseWinProbability = 0.5 + rankDifference / 100;

    // Tim sa boljom formom ima vece sanse za pobedom
    const formImpact = (team1.form - team2.form) / 100;

    // Ogranicavamo verovatnocu pobede na 30% i 70%, kako ne bi imali ekipe sa veoma visokim ili niskim verovatnocama pobede
    return Math.min(Math.max(team1BaseWinProbability + formImpact, 0.3), 0.7);
  }

  // Vraca rezultat
  getResult() {
    return `${this.team1.name} - ${this.team2.name} (${this.team1Score}:${this.team2Score})`;
  }
}

// Vraca random broj izmenju min i max
function getRandomScoreBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
