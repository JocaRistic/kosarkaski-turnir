import { Group } from "./models/group.js";
import { Team } from "./models/Team.js";
import { Tournament } from "./models/tournament.js";
import { loadGroups } from "./utils/dataLoad.js";

// Global variables

const groupsLoaded = loadGroups();
const tournament = new Tournament();

// Ucitavanje grupa i kreiranje objekata
for (const group in groupsLoaded) {
  const newGroup = new Group(group);

  groupsLoaded[group].forEach((team) => {
    newGroup.addTeam(new Team(team.Team, team.ISOCode, team.FIBARanking));
  });

  tournament.addGroup(newGroup);
}

tournament.simulateGroupPhase();
tournament.drawQuarterfinalPairs();
tournament.simulateEliminationPhase();
