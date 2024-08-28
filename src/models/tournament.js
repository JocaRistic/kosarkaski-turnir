export class Tournament {
  constructor() {
    this.groups = [];
    this.groupPhaseResults = [];
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
}
