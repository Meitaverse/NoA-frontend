import { post } from "./axios";

export interface signinParams {
  wallet_address: string;
  signed: string;
  timestamp: number;
  nonce: string;
}

export interface signinResponse {
  jwt: string;
}

export const signin = post<signinResponse, signinParams>("/signin");
