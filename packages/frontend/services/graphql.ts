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

export const getProfile = (params = "first:100") => {
  return query<IGetProfile>(`query {
    profiles(${params}){
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

export const getSingleProfile = (walletAddress = "") => {
  return query<
    IGetProfile["profiles"][number]
  >(`query { profile (id: "${walletAddress}") {
    id,
    soulBoundTokenId,
    creator,
    wallet,
    nickName,
    imageURI,
    timestamp
  } }`);
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

export const getExchangePrices = () => {
  return query<{
    exchangePrices: {
      currency: string;
      currencyName: string;
      currencySymbol: string;
      currencyDecimals: number;
      currencyAmount: string;
      sbtAmount: string;
    }[];
  }>(`query{
    exchangePrices{
      currency
      currencyName
      currencySymbol
      currencyDecimals
      currencyAmount
      sbtAmount
    }
  }	`);
};

export const getTransactionHistory = hash => {
  return query<{
    transactionHashHistories: { id: string }[];
  }>(`query {
    transactionHashHistories(first: 1 where: { id: "${hash}" }) {
      id
    }
  }`);
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

export const profileCreatorWhitelistedRecord = id => {
  return query<{ profileCreatorWhitelistedRecord?: { id: string } }>(`query{
    profileCreatorWhitelistedRecord(id: "${id}") {
      id
    }
  }`);
};

export const sbtasset = id => {
  return query<{ sbtasset?: { balance: string } }>(`query{
    sbtasset(id: "${id}") {
      balance
    }
  }`);
};

export interface VoucherAssets {
  voucherAssets: {
    id: string;
    tokenId: string;
    value: string;
    uri: {
      uri: string;
    };
  }[];
}

export interface VoucherAssetsParams {
  first: number;
  skip: number;
  wallet: string;
}

export const voucherAssets = (params: VoucherAssetsParams) => {
  return query<VoucherAssets>(`query{
    voucherAssets(first: ${params.first}, skip: ${params.skip}, orderby: tokenId, where: { wallet: "${params.wallet}" }) {
      id,
      tokenId,
      value,
      uri {
        uri
      }
    }
  }`);
};
