export class Tournament {
  constructor() {
    this.groups = [];
    this.groupPhaseResults = [];
    this.eliminationPhaseQualifiers = [];
  }

  addGroup(group) {
    this.groups.push(group);
  }

  // Simulacija grupne faze turnira
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

    this.eliminationPhaseQualifiers = finalRanking.slice(0, 8);
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
