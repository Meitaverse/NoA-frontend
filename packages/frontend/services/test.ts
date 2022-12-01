import { get } from "./axios";

export interface CinemaDetail {
  name: '123'
}

export const getCinemaDetail = get<CinemaDetail>("/api/hello");
