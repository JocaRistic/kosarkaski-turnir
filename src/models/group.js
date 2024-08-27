export class Group {
  constructor(name) {
    this.groupName = name;
    this.teams = [];
    this.matches = [];
  }

  addTeam(team) {
    this.teams.push(team);
  }
}
