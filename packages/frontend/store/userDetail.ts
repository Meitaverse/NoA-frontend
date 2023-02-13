import { atom } from "jotai";

const isLogin = atom(false);
const userDetail = atom<Record<any, any>>({});

export { isLogin, userDetail };
