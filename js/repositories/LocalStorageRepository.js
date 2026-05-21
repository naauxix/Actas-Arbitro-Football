const STORAGE_KEY = "acta_futbol_matches";

export class LocalStorageRepository {
  getAll() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  }

  save(match) {
    const matches = this.getAll();

    const index = matches.findIndex(m => m.id === match.id);

    if (index >= 0) {
      matches[index] = match;
    } else {
      matches.push(match);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
  }

  delete(id) {
    const matches = this.getAll()
      .filter(m => m.id !== id);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
  }
}