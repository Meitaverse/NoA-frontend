import { BigNumber } from "bignumber.js";
export function strip(num, precision = 12) {
  return new BigNumber(num).toFixed();
}
