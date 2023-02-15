import { getUserDetailResponse } from "@/services/sign";
import { atom } from "jotai";

const isLogin = atom(false);
const userDetail = atom<getUserDetailResponse | null>(null);

export { isLogin, userDetail };
