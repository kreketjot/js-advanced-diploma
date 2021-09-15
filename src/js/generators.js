/* eslint-disable no-unused-vars */
/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  const types = [...allowedTypes];
  const rand = (max) => Math.floor(Math.random() * max);
  while (true) {
    const randType = rand(types.length);
    const randLevel = rand(types.maxLevel) + 1;
    yield new types[randType](randLevel);
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const types = [];
  for (let i = 0; i < characterCount; i++) {
    const type = characterGenerator(allowedTypes, maxLevel).next();
    types.push(type);
  }
  return types;
}
