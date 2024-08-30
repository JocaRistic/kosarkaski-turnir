import { Group } from "./models/group.js";
import { Team } from "./models/Team.js";
import { Tournament } from "./models/tournament.js";
import { loadExibitionMatches, loadGroups } from "./utils/dataLoad.js";

/** ========== GLOBALNE VARIJABLE ========== */

const groupsLoaded = loadGroups();
const exibitionsLoaded = loadExibitionMatches();
const tournament = new Tournament();

/** ========== UCITAVANJE I OBRADA PODATAKA O GRUPAMA I PRIJATELJSKIM MECEVIMA ========== */

// Ucitavanje grupa i kreiranje objekata
for (const group in groupsLoaded) {
  const newGroup = new Group(group);

  groupsLoaded[group].forEach((team) => {
    newGroup.addTeam(new Team(team.Team, team.ISOCode, team.FIBARanking));
  });

  tournament.addGroup(newGroup);
}

// Pravimo objekat exibitions i popunjavamo ga sa svim prijateljskim mecevima
const exibitions = {};

for (const teamCode in exibitionsLoaded) {
  exibitions[teamCode] = [];

  exibitionsLoaded[teamCode].forEach((match) => {
    const result = match.Result.split("-");
    exibitions[teamCode].push({
      opponent: match.Opponent,
      opponentFibaRank: findFibaRank(match.Opponent),
      scoredPoints: result[0],
      opponentPoints: result[1],
    });
  });
}

// Prolazi kroz sve timove i za svaki poziva metodu za inicijalizaciju pocetne forme tima, prosledjuje joj prijateljske meceve tog tima
tournament.groups.forEach((group) => {
  group.teams.forEach((team) => {
    team.calculateInitialForm(exibitions[team.isoCode]);
  });
});

/** ========== POMOCNE FUNKCIJE ========== */

// Funkcija vraca fiba rank za prosledjeni tim
function findFibaRank(teamCode) {
  let teamRank;

  tournament.groups.forEach((group) => {
    group.teams.forEach((team) => {
      if (teamCode === team.isoCode) {
        teamRank = team.rank;
      }
    });
  });

  return teamRank;
}

/** ========== POZIVANJE METODA ZA SIMULACIJU TURNIRA ========== */
tournament.simulateGroupPhase();
tournament.drawQuarterfinalPairs();
tournament.simulateEliminationPhase();
