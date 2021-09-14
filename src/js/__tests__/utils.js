import { calcTileType } from '../utils';

test.each([
  [0, 2, 'top-left'],
  [1, 2, 'top-right'],
  [2, 2, 'bottom-left'],
  [3, 2, 'bottom-right'],
])('2x2 map edges', (index, boardSize, expected) => {
  const recived = calcTileType(index, boardSize);
  expect(recived).toBe(expected);
});

test.each([
  [0, 3, 'top-left'],
  [1, 3, 'top'],
  [2, 3, 'top-right'],
  [3, 3, 'left'],
  [4, 3, 'center'],
  [5, 3, 'right'],
  [6, 3, 'bottom-left'],
  [7, 3, 'bottom'],
  [8, 3, 'bottom-right'],
])('3x3 map edges', (index, boardSize, expected) => {
  const recived = calcTileType(index, boardSize);
  expect(recived).toBe(expected);
});

test.each([
  [0, 4, 'top-left'],
  [1, 4, 'top'],
  [2, 4, 'top'],
  [3, 4, 'top-right'],
  [4, 4, 'left'],
  [5, 4, 'center'],
  [6, 4, 'center'],
  [7, 4, 'right'],
  [8, 4, 'left'],
  [9, 4, 'center'],
  [10, 4, 'center'],
  [11, 4, 'right'],
  [12, 4, 'bottom-left'],
  [13, 4, 'bottom'],
  [14, 4, 'bottom'],
  [15, 4, 'bottom-right'],
])('4x4 map edges', (index, boardSize, expected) => {
  const recived = calcTileType(index, boardSize);
  expect(recived).toBe(expected);
});
