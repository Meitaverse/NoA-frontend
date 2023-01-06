import { query } from "./apollo";

export interface IGetEventList {
  eventItems: {
    eventDescription: string;
    eventId: string;
    eventName: string;
    id: string;
  }[];
}

export interface IGetEventListParams {
  skip?: number;
  limit?: number;
  eventName?: string;
  eventDescription?: string;
  orderBy?: string;
}

export const getEventList = (params: IGetEventListParams = {}) => {
  const {
    limit = 10,
    skip = 0,
    eventName = "",
    eventDescription = "",
    orderBy = "id",
  } = params;

  return query<IGetEventList>(`
    {
      eventItems(first: ${limit} skip: ${skip} orderBy: ${orderBy} where: { eventName_contains: "${eventName}" eventDescription_contains: "${eventDescription}"}) {
        id
        eventId
        eventName
        eventDescription
      }
    }`);
};

export interface IGetProfile {
  profiles: {
    id: string;
    soulBoundTokenId: string;
    creator: string;
    wallet: string;
    nickName: string;
    imageURI: string;
    timestamp: string;
  }[];
}

export const getProfile = params => {
  return query<IGetProfile>(`query {
    profiles(first:100){
      id,
      soulBoundTokenId,
      creator,
      wallet,
      nickName,
      imageURI,
      timestamp
    }
  }	`);
};

export interface IGetHubs {
  hubs: {
    id: string;
    soulBoundTokenId: string;
    creator: string;
    hubId: string;
    name: string;
    description: string;
    imageURI: string;
    timestamp: string;
  }[];
}

export const getHubs = params => {
  return query<IGetHubs>(`query{
    hubs(first:100){
      id,
      soulBoundTokenId,
      creator,
      hubId,
      name,
      description,
      imageURI,
      timestamp
    }
  }	`);
};
