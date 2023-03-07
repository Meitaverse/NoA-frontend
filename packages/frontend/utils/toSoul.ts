import { formatBalance } from "./format";
import { strip } from "./strip";

export const toSoul = balance => {
  return formatBalance(strip((Number(balance) || 0) / 10 ** 18));
};
