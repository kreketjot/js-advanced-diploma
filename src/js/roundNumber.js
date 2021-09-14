/* eslint-disable no-extend-native */
Number.prototype[Symbol.for('round')] = function f(precision = 2) {
  return +this.toFixed(precision);
};
