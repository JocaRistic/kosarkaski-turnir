import { Match } from "./match.js";

export class Tournament {
  constructor() {
    this.groups = [];
    this.groupPhaseResults = [];
    this.eliminationPhaseQualifiers = [];
    this.quarterfinalsMatches = [];
  }

  addGroup(group) {
    this.groups.push(group);
  }

  // Metoda poziva sve metode potrebne za simulaciju grupne faze
  simulateGroupPhase() {
    this.groups.forEach((group) => {
      group.simulateAllGroupMatches();
      group.rankTeamsInGroup();
    });
    this.displayGroupPhaseResults();
    this.displayGroupPhaseTables();
    this.rankTeamsAfterGroupPhase();
    this.displayElimPhaseQualifiers();
  }

  // Rangiranje timova nakon grupne faze, prvoplasirani, drugoplasirani i trećeplasirani timovi iz svih grupa dobijaju rang od 1 do 9
  rankTeamsAfterGroupPhase() {
    const rankedTeams = {
      first: [],
      second: [],
      third: [],
    };

    this.groups.forEach((group) => {
      rankedTeams.first.push(group.teams[0]);
      rankedTeams.second.push(group.teams[1]);
      rankedTeams.third.push(group.teams[2]);
    });

    rankedTeams.first.sort(compareTeams);
    rankedTeams.second.sort(compareTeams);
    rankedTeams.third.sort(compareTeams);

    const finalRanking = [
      ...rankedTeams.first,
      ...rankedTeams.second,
      ...rankedTeams.third,
    ];

    finalRanking.forEach((team, index) => {
      team.addGroupRank(index + 1);
    });

    // Cuvamo prva 8 najbolje plasirana tima
    this.eliminationPhaseQualifiers = finalRanking.slice(0, 8);
  }

  // Metoda rasporedjuje kvalifikovane timove po sesirima, i pravi parove za cetvrtfinala tako sto ukrsta timove
  drawQuarterfinalPairs() {
    const hats = {
      D: [],
      E: [],
      F: [],
      G: [],
    };

    this.eliminationPhaseQualifiers.forEach((team) => {
      if (team.afterGroupRank === 1 || team.afterGroupRank === 2) {
        hats.D.push(team);
      } else if (team.afterGroupRank === 3 || team.afterGroupRank === 4) {
        hats.E.push(team);
      } else if (team.afterGroupRank === 5 || team.afterGroupRank === 6) {
        hats.F.push(team);
      } else if (team.afterGroupRank === 7 || team.afterGroupRank === 8) {
        hats.G.push(team);
      }
    });

    this.quarterfinalsMatches.push(
      this.generateQuarterfinalPairs(hats.D, hats.G)
    );
    this.quarterfinalsMatches.push(
      this.generateQuarterfinalPairs(hats.E, hats.F)
    );

    this.displayHatsAndQuarterPairs(hats);
  }

  // Formiraju se parovi nasumicnim ukrstanjem prosledjenih sesira, par ne mogu ciniti timovi koji su vec igrali medjusobno u grupnoj fazi
  generateQuarterfinalPairs(hat1, hat2) {
    let match1team1, match1team2, match2team1, match2team2;
    do {
      match1team1 = hat1[Math.floor(Math.random() * hat1.length)];
      match1team2 = hat2[Math.floor(Math.random() * hat2.length)];
      match2team1 = hat1.find((team) => team.name !== match1team1.name);
      match2team2 = hat2.find((team) => team.name !== match1team2.name);
    } while (
      this.checkIfTeamsPlayedInGroup(match1team1, match1team2) ||
      this.checkIfTeamsPlayedInGroup(match2team1, match2team2)
    );

    return [
      new Match(match1team1, match1team2, 4),
      new Match(match2team1, match2team2, 4),
    ];
  }

  // Provera da li su timovi igrali medjusobno u grupnoj fazi, vraca true ako jesu, false ako nisu
  checkIfTeamsPlayedInGroup(team1, team2) {
    let played = false;
    this.groups.forEach((group) => {
      played = group.matches.some(
        (match) =>
          (team1.name === match.team1.name &&
            team2.name === match.team2.name) ||
          (team1.name === match.team2.name && team2.name === match.team1.name)
      );
    });
    return played;
  }

  // Prikaz rezultata grupne faze turnira
  displayGroupPhaseResults() {
    this.groups.forEach((group) => {
      const resultsForGroup = {};
      resultsForGroup[group.groupName] = group.returnResultsByRound();
      this.groupPhaseResults.push(resultsForGroup);
    });

    console.log("=========== PRIKAZ REZULTATA GRUPNE FAZE ===========");
    console.log("");

    for (let round = 1; round <= 3; round++) {
      console.log(`Grupna faza - ${round}. kolo:`);
      this.groupPhaseResults.forEach((groupRes) => {
        for (const groupName in groupRes) {
          console.log(`   Grupa ${groupName}:`);

          const results = groupRes[groupName][round];
          results.forEach((result) => {
            console.log(`       ${result}`);
          });
        }
      });
    }
  }

  // Prikaz tablica grupne faze
  displayGroupPhaseTables() {
    console.log("");
    console.log("=========== KONACAN PLASMAN U GRUPAMA ===========");
    console.log("");
    this.groups.forEach((group) => {
      console.log(
        `Grupa ${group.groupName} (Ime  -   pobede/porazi/bodovi/postignuti koševi/primljeni koševi/koš razlika)`
      );
      group.teams.forEach((team, index) => {
        console.log(
          `   ${index + 1}. ${team.name.padEnd(17, " ")} ${team.wins} / ${
            team.losses
          } / ${team.points} / ${team.scoredPoints} / ${
            team.receivedPoints
          } / ${team.scoredPoints - team.receivedPoints >= 0 ? "+" : ""}${
            team.scoredPoints - team.receivedPoints
          }`
        );
      });
    });
  }

  // Prikaz timova koji su prosli u eliminacionu fazu
  displayElimPhaseQualifiers() {
    console.log("");
    console.log(
      "=========== TIMOVI KOJI SU PROSLI U ELIMINACIONU FAZU ==========="
    );
    console.log("");
    this.eliminationPhaseQualifiers.forEach((team) => {
      console.log(`${team.afterGroupRank}. ${team.name}`);
    });
  }

  // Prikaz sesira
  displayHatsAndQuarterPairs(hats) {
    console.log("");
    console.log("=========== ELIMINACIONA FAZA ===========");
    console.log("");
    console.log("Sesiri:");
    for (const hat in hats) {
      console.log(`   Sesir ${hat}`);
      hats[hat].forEach((team) => {
        console.log(`       ${team.name}`);
      });
    }
    console.log("");
    console.log(`Parovi eliminacione faze: `);
    this.quarterfinalsMatches.forEach((matches) => {
      matches.forEach((match) => {
        console.log(`   ${match.team1.name} - ${match.team2.name}`);
      });
      console.log("");
    });
  }
}

// Timovi se medjusobno rangiraju primarno po broju bodova, zatim koš razlici (u slučaju jednakog broja bodova) i zatim broja postignutih koševa (u slučaju jednakog broja bodova i koš razlike)
function compareTeams(team1, team2) {
  if (team1.points !== team2.points) {
    return team2.points - team1.points;
  }

  const team1PointDiff = team1.scoredPoints - team1.receivedPoints;
  const team2PointDiff = team2.scoredPoints - team2.receivedPoints;

  if (team1PointDiff !== team2PointDiff) {
    return team2PointDiff - team1PointDiff;
  }

  return team2.scoredPoints - team1.scoredPoints;
}
