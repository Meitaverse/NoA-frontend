import { get, post } from "./axios";

export interface signinParams {
  wallet_address: string;
  signed: string;
  timestamp: number;
  nonce: string;
}

export interface signinResponse {
  jwt: string;
}

export interface getUserDetailResponse {
  create_at: number;
  create_profile_whitelisted: boolean;
  updated_at: number;
  user_id: number;
  user_type: string;
  wallet_address: string;
  soul_bound_token_id?: number;
  email?: string;

  // 这些从graph里获取
  username: string;
  avatar: string;
  balance: string;
}

export interface sendValidateCodeParams {
  account: string;
  account_type: "email";
  scene: "bindAccount";
}

export interface bindAccountParams {
  account_type: "email";
  code: string;
}

export const signin = post<signinResponse, signinParams>("/signin");
export const getUserInfo = get<
  getUserDetailResponse,
  { walletAddress: string }
>("/api/getUserDetail");
export const sendValidateCode = post<any, sendValidateCodeParams>(
  "/sendValidateCode"
);
export const bindAccount = post<any, bindAccountParams>("/bindAccount");
export const linkSoulBoundTokenId = post("/linkSoulBoundTokenId");
