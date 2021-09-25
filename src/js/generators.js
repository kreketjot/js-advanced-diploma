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
export function* characterGenerator(allowedTypes, maxLevel, posX, mapSize) {
  const types = [...allowedTypes];
  const rand = (max, min = 0) => min + Math.floor(Math.random() * max);
  while (true) {
    // create character
    const randType = rand(types.length);
    const randLevel = rand(maxLevel + 1, 1);
    const char = new types[randType](randLevel);
    // calculate position
    const position = rand(mapSize) * mapSize + rand(posX.max + 1, posX.min);
    yield new PositionedCharacter(char, position);
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount, posX, mapSize) {
  const team = [];
  for (let i = 0; i < characterCount; i++) {
    const posChar = characterGenerator(allowedTypes, maxLevel, posX, mapSize).next();
    team.push(posChar);
  }
  return team;
}
