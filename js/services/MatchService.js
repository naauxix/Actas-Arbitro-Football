export class MatchService {

  static calculateScore(match) {

    const localGoals = match.events.filter(
      e => e.type === "goal" &&
      e.teamId === match.localTeam.id
    ).length;

    const awayGoals = match.events.filter(
      e => e.type === "goal" &&
      e.teamId === match.awayTeam.id
    ).length;

    return {
      localGoals,
      awayGoals
    };
  }

  static getTimeline(match) {
    return [...match.events]
      .sort((a, b) => a.minute - b.minute);
  }
}