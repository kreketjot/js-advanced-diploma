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
    this.freeze = false;

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
    if (this.freeze) {
      GamePlay.showMessage('Дождись окончания действия!');
      return;
    }

    this.gamePlay.setCursor(cursors.auto);

    // computer's turn
    if (this.state.turn) {
      GamePlay.showError('Дождись своего хода');
      return;
    }

    // player's turn
    // clicked selected character
    if (this.selected === index) {
      return;
    }

    // get clicked character
    const positionedCharacter = this.getCharacter(index);

    // not character clicked
    if (positionedCharacter === undefined) {
      // no selected character
      if (this.selected === null) {
        GamePlay.showError('Выбери персонажа');
        // move
      } else if (this.canMove(index)) {
        this.gamePlay.deselectCell(this.selected);
        this.gamePlay.deselectCell(index);
        this.move(index);
      }
      return;
    }

    // clicked character
    // ally
    if (GameController.isAlly(positionedCharacter)) {
      // reselect
      if (this.selected !== null) {
        this.gamePlay.deselectCell(this.selected);
      }
      // new select
      this.gamePlay.selectCell(index);
      this.selected = index;
      return;
    }

    // enemy
    if (!this.selected) {
      GamePlay.showError('Выбери своего персонажа');
      return;
    }

    // attack enemy
    if (this.canAttack(index)) {
      this.attack(positionedCharacter);
      this.gamePlay.deselectCell(index);
      this.gamePlay.deselectCell(this.selected);
    } else {
      GamePlay.showError('Подойди ближе, чтобы атаковать');
    }
  }

  onCellEnter(index) {
    if (index === this.selected) {
      return;
    }
    const char = this.getCharacter(index);

    // empty cell
    if (char === undefined) {
      if (this.selected !== null) {
        this.setMoveCursor(index);
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
    if (GameController.isAlly(char)) { // ally
      this.gamePlay.setCursor(cursors.pointer);
    } else { // enemy
      this.setAttackCursor(index);
    }
  }

  static isAlly(positionedCharacter) {
    if (types.generic.some(type => positionedCharacter.character instanceof type)) { // ally
      return true;
    }
    return false;
  }

  setMoveCursor(index) {
    if (this.canMove(index)) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, 'green');
    } else {
      this.gamePlay.setCursor(cursors.notallowed);
    }
  }

  canMove(index) {
    // no character to move
    if (this.selected === null) {
      return false;
    }

    // same sell
    if (this.selected === index) {
      return false;
    }

    // check distance
    const char = this.getCharacter(this.selected);
    const distance = this.gamePlay.getDistance(index, this.selected);
    if (distance > char.character.speed) {
      return false;
    }
    return true;
  }

  move(index) {
    const char = this.getCharacter(this.selected);

    char.position = index;

    this.update();
    this.nextTurn();
  }

  setAttackCursor(index) {
    if (this.canAttack(index)) {
      this.gamePlay.setCursor(cursors.crosshair);
      this.gamePlay.selectCell(index, 'red');
    } else {
      this.gamePlay.setCursor(cursors.notallowed);
    }
  }

  canAttack(index) {
    // no character to attack
    if (this.selected === null) {
      return false;
    }

    // check range
    const char = this.getCharacter(this.selected);
    const distance = this.gamePlay.getDistance(index, this.selected);
    if (distance > char.character.attackRange) {
      return false;
    }
    return true;
  }

  async attack(defender) {
    const target = defender.character;
    const attacker = this.getCharacter(this.selected).character;
    const damage = Math.max(attacker.attack - target.defence, attacker.attack * 0.1);

    // damage
    target.health -= damage;
    this.freeze = true;
    await this.gamePlay.showDamage(defender.position, damage);
    this.freeze = false;

    // killed
    if (!target.health) {
      this.state.positions = this.state.positions.filter(
        posChar => posChar.position !== defender.position,
      );
    }

    this.update();
    this.nextTurn();
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

  nextTurn() {
    this.selected = null;
    // this.state.next();
  }
}
