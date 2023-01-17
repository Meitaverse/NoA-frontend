import { query, queryDe } from "./apollo";

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

export interface IGetProjects {
  projects: {
    id: string;
    projectId: string;
    soulBoundTokenId: string;
    derivativeNFT: string;
    timestamp: string;
  }[];
}

export const getProjects = params => {
  return query<IGetProjects>(`query{
    projects(first:100){
      id,
      projectId,
      soulBoundTokenId,
      derivativeNFT,
      timestamp
    }
  }`);
};

export interface IGetPublishHistory {
  publishRecords: {
    id: string;
    publishId: string;
    soulBoundTokenId: string;
    hubId: string;
    projectId: string;
    newTokenId: string;
    amount: string;
    collectModuleInitData: string;
    timestamp: string;
  }[];
}

export const getPublishHistory = params => {
  return query<IGetPublishHistory>(`query{
    publishRecords(first:100){
      id,
      publishId,
      soulBoundTokenId,
      hubId,
      projectId,
      newTokenId,
      amount,
      collectModuleInitData,
      timestamp
    }
  }`);
};

export interface IGetPreparePublish {
  publications: {
    id: string;
    soulBoundTokenId: string;
    hubId: string;
    projectId: string;
    salePrice: string;
    royaltyBasisPoints: string;
    amount: string;
    name: string;
    description: string;
    materialURIs: string;
    fromTokenIds: string[];
    collectModule: string;
    collectModuleInitData: string;
    publishModule: string;
    publishModuleInitData: string;
    publishId: string;
    previousPublishId: string;
    publishTaxAmount: string;
    timestamp: string;
  }[];
}

export const getPreparePublish = params => {
  return query<IGetPreparePublish>(`query {
    publications(first: 100) {
      id
      soulBoundTokenId
      hubId
      projectId
      salePrice
      royaltyBasisPoints
      amount
      name
      description
      materialURIs
      fromTokenIds
      collectModule
      collectModuleInitData
      publishModule
      publishModuleInitData
      publishId
      previousPublishId
      publishTaxAmount
      timestamp
    }
  }`);
};

export interface IGetMintSBTValueHistories {
  mintSBTValueHistories: {
    id: string;
    soulBoundTokenId: string;
    value: string;
    timestamp: string;
  }[];
}

export const getMintSBTValueHistories = params => {
  return query<IGetMintSBTValueHistories>(`query {
    mintSBTValueHistories(first: 100) {
      id
      soulBoundTokenId
      value
      timestamp
    }
  }`);
};

export interface IGetCollectHistory {
  feesForCollectHistories: {
    id: string;
    collectorSoulBoundTokenId: string;
    publishId: string;
    treasuryAmount: string;
    genesisAmount: string;
    adjustedAmount: string;
    timestamp: string;
  }[];
}

export const getCollectHistory = params => {
  return query<IGetCollectHistory>(`query {
    feesForCollectHistories(first: 100) {
      id
      collectorSoulBoundTokenId
      publishId
      treasuryAmount
      genesisAmount
      adjustedAmount
      timestamp
    }
  }`);
};

export interface IGetDerivativeNFTAssets {
  derivativeNFTAssets: {
    id: string;
    wallet: string;
    tokenId: string;
    value: string;
    timestamp: string;
    publishId: string;
  }[];
}

export const getDerivativeNFTAssets = params => {
  return queryDe<IGetDerivativeNFTAssets>(`query{
    derivativeNFTAssets(first: 100) {
      id
      wallet
      tokenId
      value
      timestamp
      publishId
    }
  }`);
};
