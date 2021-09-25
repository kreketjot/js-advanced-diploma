import Team from './Team';
import GameState from './GameState';
import GamePlay from './GamePlay';
import types from './Characters/types';

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
