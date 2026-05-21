export class Player {
  constructor({
    id,
    name,
    number,
    starter = false,
    onField = false
  }) {
    this.id = id;
    this.name = name;
    this.number = number;
    this.starter = starter;
    this.onField = onField;
  }
}