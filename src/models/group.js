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

  // Rangiranje timova u grupi
  rankTeamsInGroup() {
    this.teams.sort((team1, team2) => {
      if (team2.points !== team1.points) {
        return team2.points - team1.points;
      }

      // Ako dva tima imaju isti broj bodova, gledamo medjusobni susret
      const match = this.findMatch(team1, team2);

      if (match) {
        return match.winner.name === team1.name ? -1 : 1;
      }
    });

    // Proverava da li postoje tri tima sa istim brojem bodova, ukoliko postoje pozivamo metodu koja ih sortira
    const teamsWithSamePoints = {};

    this.teams.forEach((team) => {
      if (!teamsWithSamePoints[team.points]) {
        teamsWithSamePoints[team.points] = [];
      }
      teamsWithSamePoints[team.points].push(team);
    });

    Object.values(teamsWithSamePoints).forEach((teams) => {
      if (teams.length > 2) {
        this.resolve3TeamsEqualPoints(teams);
      }
    });
  }

  // Proverava da li postoje tri tima sa istim brojem bodova, ukoliko postoje rangira ih po razlici u poenima u medj. duelima
  resolve3TeamsEqualPoints(teams) {
    const pointDifferences = {};

    teams.forEach((team) => {
      pointDifferences[team.name] = 0;
    });

    this.matches.forEach((match) => {
      if (teams.includes(match.team1) && teams.includes(match.team2)) {
        // console.log(match);
        const diff1 = match.team1Score - match.team2Score;
        const diff2 = match.team2Score - match.team1Score;
        pointDifferences[match.team1.name] += diff1;
        pointDifferences[match.team2.name] += diff2;
      }
    });

    // console.log(pointDifferences);

    this.teams.sort(
      (team1, team2) =>
        pointDifferences[team2.name] - pointDifferences[team1.name]
    );
  }

  // Pronadji mec koji su odigrali prosledjeni timovi
  findMatch(team1, team2) {
    return this.matches.find(
      (match) =>
        (team1.name === match.team1.name && team2.name === match.team2.name) ||
        (team1.name === match.team2.name && team2.name === match.team1.name)
    );
  }
}
