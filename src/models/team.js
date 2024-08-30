export class Team {
  constructor(name, isoCode, rank) {
    this.name = name;
    this.isoCode = isoCode;
    this.rank = rank;
    this.form = 0;
    this.points = 0;
    this.wins = 0;
    this.losses = 0;
    this.scoredPoints = 0;
    this.receivedPoints = 0;
    this.afterGroupRank;
  }

  // Racunamo polaznu formu tima na osnovu prijateljskih utakmica, kao faktor forme uzimamu razliku u poenima i jacinu protivnika
  calculateInitialForm(exibitionMatches) {
    let totalForm = 0;

    exibitionMatches.forEach((match) => {
      // razlika postignutih i primljenih poena
      const pointsDifference = match.scoredPoints - match.opponentPoints;
      // ukoliko tim ima bolji rank, snaga je veca
      let opponentStrength;
      if (match.opponentFibaRank) {
        opponentStrength = (100 - match.opponentFibaRank) / 100;
      } else {
        opponentStrength = (100 - 50) / 100;
      }

      totalForm += pointsDifference * opponentStrength;
    });

    this.form = totalForm / exibitionMatches.length;
  }

  // Metoda sluzi za azuriranje forme tima tokom turnira
  updateForm(pointsDifference, opponentFibaRank) {
    const opponentStrength = (100 - opponentFibaRank) / 100;
    this.form += pointsDifference * opponentStrength;
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
