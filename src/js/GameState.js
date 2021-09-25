import themes from './themes';

export default class GameState {
  constructor(positions = []) {
    this.turn = 0;
    this.positions = positions;
    this.level = 1;
  }

  next() {
    this.turn = (this.turn + 1) % 2;
  }

  restore(state) {
    this.turn = state.turn;
    this.positions = state.positions;
    this.level = state.level;
  }

  getTheme() {
    return themes[`lvl${this.level}`];
  }
}
