export function calcTileType(index, boardSize) {
  const leftRight = (dash = false) => {
    const x = dash ? '-' : '';
    const remainder = index % boardSize;
    if (remainder === 0) {
      return `${x}left`;
    }
    if (remainder === boardSize - 1) {
      return `${x}right`;
    }
    return '';
  };

  /* top */
  if (index < boardSize) {
    return `top${leftRight(true)}`;
  }
  /* bottom */
  if (index >= boardSize * (boardSize - 1)) {
    return `bottom${leftRight(true)}`;
  }
  /* center */
  return leftRight(false) || 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function calcDistance(a, b, size) {
  const ax = a % size;
  const ay = Math.trunc(a / size);
  const bx = b % size;
  const by = Math.trunc(b / size);

  const dx = Math.abs(ax - bx);
  const dy = Math.abs(ay - by);

  return Math.max(dx, dy);
}
