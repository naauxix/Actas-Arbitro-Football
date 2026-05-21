export class ValidationService {

  static validateMatch(match) {

    if (!match.localTeam.name.trim()) {
      throw new Error("El equipo local es obligatorio.");
    }

    if (!match.awayTeam.name.trim()) {
      throw new Error("El equipo visitante es obligatorio.");
    }

    if (!match.date) {
      throw new Error("La fecha es obligatoria.");
    }
  }

  static validateUniqueNumber(players, number) {

    const repeated = players.some(
      p => p.number === number
    );

    if (repeated) {
      throw new Error("El dorsal ya existe.");
    }
  }

  static validateMinute(minute) {

    if (
      isNaN(minute) ||
      minute < 0
    ) {
      throw new Error("Minuto inválido.");
    }
  }
}