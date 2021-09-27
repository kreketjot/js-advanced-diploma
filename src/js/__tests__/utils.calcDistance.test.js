import { calcDistance } from '../utils';

test.each([
  [9, 0, 8, 1], // diagonal
  [0, 8, 8, 1], // vertical
  [1, 2, 2, 1], // diagonal
  [1, 1, 2, 0], // same cell
  [0, 8, 3, 2], // diagonal
  [0, 7, 3, 2], // edge
])('calc distance', (a, b, size, expected) => {
  const recived = calcDistance(a, b, size);
  expect(recived).toBe(expected);
});
