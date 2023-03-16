import { get, post } from "./axios";

export const createHub = post<
  any,
  {
    logo: string;
    background: string;
    name: string;
    description: string;
    website: string;
    twitter: string;
    discord: string;
    email: string;
  }
>("/hub/create");

export const updateHub = post("/hub/update");

export interface IGetMyHubDetail {
  hub_id: number;
  blockchain_hub_id: string;
  user_id: string;
  log: string;
  background: string;
  name: string;
  description: string;
  website: string;
  twitter: string;
  discord: string;
  email: string;
  approval_status: "wait";
  create_hub_whitelisted: boolean;
}

export const getMyHubDetail = get<IGetMyHubDetail | null>("/hub/myHubDetail");
