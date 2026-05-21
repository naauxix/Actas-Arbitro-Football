export class Event {
  constructor({
    id,
    type,
    minute,
    teamId,
    playerId,
    assistantId = null,
    reason = "",
    redType = "",
    relatedYellowIds = [],
    playerOutId = null,
    playerInId = null
  }) {
    this.id = id;
    this.type = type;
    this.minute = minute;
    this.teamId = teamId;
    this.playerId = playerId;
    this.assistantId = assistantId;
    this.reason = reason;
    this.redType = redType;
    this.relatedYellowIds = relatedYellowIds;
    this.playerOutId = playerOutId;
    this.playerInId = playerInId;
  }
}