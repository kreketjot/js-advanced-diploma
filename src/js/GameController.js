/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import themes from './themes';
import Team from './Team';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.team1 = [];
    this.team2 = [];
    const newGame = () => {
      const level = 1;
      const count = level + 1;
      const mapSize = this.gamePlay.boardSize;
      this.team1 = new Team('generic', level, count, mapSize);
      this.team2 = new Team('undead', level, count, mapSize);
    };
    const update = () => {
      this.positions = [...this.team1, ...this.team2];
      this.gamePlay.redrawPositions(this.positions);
    };
    this.gamePlay.drawUi(themes.lvl1);
    this.gamePlay.addNewGameListener(newGame);
    this.gamePlay.addNewGameListener(update);
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
