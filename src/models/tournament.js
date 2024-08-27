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
    });
    this.displayGroupPhaseResults();
  }

  // Prikaz rezultata grupne faze turnira
  displayGroupPhaseResults() {
    this.groups.forEach((group) => {
      const resultsForGroup = {};
      resultsForGroup[group.groupName] = group.returnResultsByRound();
      this.groupPhaseResults.push(resultsForGroup);
    });

    console.log("=========== PRIKAZ REZULTATA GRUPNE FAZE ===========");

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
}
