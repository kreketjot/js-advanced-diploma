import types from './Characters/types';
import Magician from './Characters/generic/Magician';
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
          allowedTypes = allowedTypes.filter(typeChar => typeChar !== Magician);
        }
        max = 1;
        break;
      case 'undead':
        max = mapSize - 1;
        break;
      default:
        max = 1;
    }
    const min = max - 1;

    this.characters = generateTeam(allowedTypes, level, count, { min, max }, mapSize);
  }

  [Symbol.iterator]() {
    let i = 0;
    const characters = [...this.characters];
    const len = characters.length;
    return {
      next() {
        if (i < len) {
          return {
            done: false,
            value: characters[i++],
          };
        }
        return { done: true };
      },
    };
  }
}
