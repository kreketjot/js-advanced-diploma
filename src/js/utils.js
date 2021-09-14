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
