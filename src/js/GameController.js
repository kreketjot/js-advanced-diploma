import Team from './Team';
import GameState from './GameState';
import GamePlay from './GamePlay';
import types from './Characters/types';
import cursors from './cursors';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.state = new GameState();
    this.selected = null;

    // binding
    this.onCellEnter = this.onCellEnter.bind(this);
    this.onCellLeave = this.onCellLeave.bind(this);
    this.onCellClick = this.onCellClick.bind(this);
    this.newGame = this.newGame.bind(this);
    this.update = this.update.bind(this);
  }

  init() {
    this.team1 = [];
    this.team2 = [];

    this.gamePlay.drawUi(this.state.getTheme());

    // new game
    this.gamePlay.addNewGameListener(this.newGame);
    this.gamePlay.addNewGameListener(this.update);

    // cells
    this.gamePlay.addCellEnterListener(this.onCellEnter);
    this.gamePlay.addCellLeaveListener(this.onCellLeave);
    this.gamePlay.addCellClickListener(this.onCellClick);

    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    this.gamePlay.setCursor(cursors.auto);

    if (this.state.turn) {
      GamePlay.showError('Дождитесь своего хода');
      return;
    }

    const char = this.getCharacter(index);
    if (char === undefined) {
      GamePlay.showError('Необходимо выбрать персонажа');
      return;
    }
    if (!types.generic.some(type => char.character instanceof type)) {
      GamePlay.showError('Необходимо выбрать своего персонажа');
      return;
    }

    if (this.selected !== null) {
      this.gamePlay.deselectCell(this.selected);
    }
    this.selected = index;
    this.gamePlay.selectCell(index);
  }

  onCellEnter(index) {
    if (index === this.selected) {
      return;
    }
    const char = this.getCharacter(index);
    // empty cell
    if (char === undefined) {
      if (this.selected !== null) {
        this.setCursor(index, 'speed', 'green', cursors.pointer, cursors.notallowed);
      }
      return;
    }
    // character
    const {
      level, attack, defence, health,
    } = char.character;
    const msg = `\u{1F396}${level} \u{2694}${attack} \u{1F6E1}${defence} \u{2764}${health}`;
    this.gamePlay.showCellTooltip(msg, index);
    if (this.selected === null) {
      return;
    }
    if (types.generic.some(type => char.character instanceof type)) { // ally
      this.gamePlay.setCursor(cursors.pointer);
    } else { // enemy
      this.setCursor(index, 'attackRange', 'red', cursors.crosshair, cursors.notallowed);
    }
  }

  setCursor(index, action, color, actionCursor, defaultCursor) {
    const char = this.getCharacter(this.selected);
    const distance = this.gamePlay.getDistance(index, this.selected);
    if (distance > char.character[action]) {
      this.gamePlay.setCursor(defaultCursor);
    } else {
      this.gamePlay.setCursor(actionCursor);
      this.gamePlay.selectCell(index, color);
    }
  }

  onCellLeave(index) {
    this.gamePlay.setCursor(cursors.auto);
    this.gamePlay.hideCellTooltip(index);
    if (this.selected !== index) {
      this.gamePlay.deselectCell(index);
    }
  }

  getCharacter(index) {
    return this.state.positions.find((char) => char.position === index);
  }

  newGame() {
    const level = 1;
    const count = level + 1;
    const mapSize = this.gamePlay.boardSize;
    const team1 = new Team('generic', level, count, mapSize);
    const team2 = new Team('undead', level, count, mapSize);
    this.state = new GameState([...team1, ...team2]);
    if (this.selected !== null) {
      this.gamePlay.deselectCell(this.selected);
      this.selected = null;
    }
  }

  update() {
    this.gamePlay.redrawPositions(this.state.positions);
  }
}
