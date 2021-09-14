import './roundNumber';

export default class Character {
  constructor(level, type = 'generic', maxHealth = 100) {
    this.level = level;
    this.health = 50;
    this.maxHealth = maxHealth;
    this.type = type;
    if (new.target === Character) {
      throw new Error('class Character can\'t be instantiated');
    }
  }

  levelUp() {
    /* increase level */
    this.level++;
    /* upgrade attack and defence */
    const atkDef = (before) => {
      const newAtkDef = before * (1.8 - this.health / this.maxHealth);
      const after = newAtkDef[Symbol.for('round')]();
      return Math.max(before, after);
    };
    this.attack = atkDef(this.attack);
    this.defence = atkDef(this.defence);
    /* heal character */
    this.health += 80;
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }
  }
}
