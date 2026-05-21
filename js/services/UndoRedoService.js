export class UndoRedoService {

  constructor() {
    this.undoStack = [];
    this.redoStack = [];
  }

  execute(state) {
    this.undoStack.push(
      JSON.stringify(state)
    );

    this.redoStack = [];
  }

  undo(currentState) {

    if (!this.undoStack.length) {
      return currentState;
    }

    this.redoStack.push(
      JSON.stringify(currentState)
    );

    return JSON.parse(
      this.undoStack.pop()
    );
  }

  redo(currentState) {

    if (!this.redoStack.length) {
      return currentState;
    }

    this.undoStack.push(
      JSON.stringify(currentState)
    );

    return JSON.parse(
      this.redoStack.pop()
    );
  }
}