/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import themes from './themes';
import Team from './Team';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.positions = [];
    // binding
    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
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
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    const char = this.getCharacter(index);
    if (char === undefined) {
      return;
    }
    const {
      level, attack, defence, health,
    } = char.character;
    const msg = `\u{1F396}${level} \u{2694}${attack} \u{1F6E1}${defence} \u{2764}${health}`;
    this.gamePlay.showCellTooltip(msg, index);
  }

  onCellLeave(index) {
    this.gamePlay.hideCellTooltip(index);
  }

  getCharacter(index) {
    return this.positions.find((char) => char.position === index);
  }
}
