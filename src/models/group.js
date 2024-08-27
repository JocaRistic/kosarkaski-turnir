import { Match } from "./match.js";

export class Group {
  constructor(name) {
    this.groupName = name;
    this.teams = [];
    this.matches = [];
  }

  // Dodavanje tima u grupu
  addTeam(team) {
    this.teams.push(team);
  }

  // Simulacija svih meceva u grupi
  simulateAllGroupMatches() {
    // Imamo 4 tima u grupi, znaci 3 kola
    const rounds = [
      // Svaki niz predstavlja kolo sa parovima timova
      [
        [0, 1],
        [2, 3],
      ], // 1. kolo: Tim1 vs Tim2, Tim3 vs Tim4
      [
        [0, 2],
        [1, 3],
      ], // 2. kolo: Tim1 vs Tim3, Tim2 vs Tim4
      [
        [0, 3],
        [1, 2],
      ], // 3. kolo: Tim1 vs Tim4, Tim2 vs Tim3
    ];

    rounds.forEach((round, index) => {
      round.forEach((matchup) => {
        const team1 = this.teams[matchup[0]];
        const team2 = this.teams[matchup[1]];
        const match = new Match(team1, team2, `${index + 1}`);
        match.playMatch();
        this.matches.push(match);
      });
    });
  }

  // Vraca objekat koji sadrzi rezultate meceva po rundama
  returnResultsByRound() {
    const rounds = {};

    this.matches.forEach((match) => {
      if (!rounds[match.round]) {
        rounds[match.round] = [];
      }
      rounds[match.round].push(match.getResult());
    });

    return rounds;
  }
}
