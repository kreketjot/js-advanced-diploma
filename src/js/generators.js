import PositionedCharacter from './PositionedCharacter';

/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @param posX has min and max allowed X positions
 * @param mapSize size of map
 * @returns Positioned Character
 */
export function* characterGenerator(allowedTypes, maxLevel, { min, max }, mapSize) {
  const types = [...allowedTypes];
  const rand = (sup, start = 0) => {
    const r = start + Math.floor(Math.random() * (sup - start));
    return r;
  };
  while (true) {
    // create character
    const randType = rand(types.length);
    const randLevel = rand(maxLevel + 1, 1);
    const char = new types[randType](randLevel);
    // calculate position
    const y = rand(mapSize);
    const x = rand(max + 1, min);
    const position = y * mapSize + x;
    yield new PositionedCharacter(char, position);
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount, { min, max }, mapSize) {
  const team = [];
  for (let i = 0; i < characterCount; i++) {
    const posChar = characterGenerator(allowedTypes, maxLevel, { min, max }, mapSize).next();
    if (team.some(char => char.position === posChar.value.position)) {
      i--;
    } else {
      team.push(posChar.value);
    }
  }
  return team;
}
