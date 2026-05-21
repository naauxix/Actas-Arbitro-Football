export class Match {
  constructor({
    id,
    localTeam,
    awayTeam,
    date,
    referee = "",
    location = "",
    events = [],
    status = "pendiente"
  }) {
    this.id = id;
    this.localTeam = localTeam;
    this.awayTeam = awayTeam;
    this.date = date;
    this.referee = referee;
    this.location = location;
    this.events = events;
    this.status = status;
  }
}