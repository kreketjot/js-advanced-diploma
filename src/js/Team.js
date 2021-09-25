import types from './Characters/types';
import { generateTeam } from './generators';

export default class Team {
  constructor(type, level, count, mapSize) {
    if (types[type] === undefined) {
      throw new Error('unsupported type');
    }

    // get allowed types
    let allowedTypes = types[type];

    // calculate position
    let max;
    switch (type) {
      case 'generic':
        if (level === 1) {
          allowedTypes = allowedTypes.filter(typeChar => typeChar !== 'magician');
        }
        max = 1;
        break;
      case 'undead':
        max = mapSize;
        break;
      default:
        max = 1;
    }
    const min = max - 1;

    this.characters = generateTeam(allowedTypes, level, count, { min, max }, mapSize);
  }
}
