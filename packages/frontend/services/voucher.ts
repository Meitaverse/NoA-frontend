import { get } from "./axios";

export const getBgNow = get<{
  url: string;
}>("/voucher/background/now");
