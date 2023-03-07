import BigNumber from "bignumber.js";
import { formatBalance } from "./format";

export const toSoul = (balance, withFormat = true) => {
  const bigNumber = new BigNumber(balance);

  if (withFormat) {
    return formatBalance(bigNumber.dividedBy(10 ** 18).toFixed());
  }

  return bigNumber.dividedBy(10 ** 18).toFixed();
};
