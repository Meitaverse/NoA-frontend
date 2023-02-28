import { isNumber } from "lodash-es";

export const formatBalance = balance => {
  if (!isNumber(Number(balance))) return;

  const [left, right] = `${balance}`.split(".");

  const formatted = `${left}`
    .split("")
    .reverse()
    .map((d, i) => (i % 3 ? d : `${d},`))
    .reverse()
    .join("")
    .replace(/,$/g, "");

  return right ? `${formatted}.${right}` : formatted;
};
