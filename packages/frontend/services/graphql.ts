import { query } from './apollo'

export interface IGetEventList {
  eventItems: {
    eventDescription: string,
    eventId: string,
    eventName: string,
    id: string
  }[]
}

export interface IGetEventListParams {
  skip?: number
  limit?: number;
  eventName?: string;
  eventDescription?: string;
  orderBy?: string
}

export const getEventList = (params: IGetEventListParams = {}) => {
  const { limit = 10, skip = 0, eventName = '', eventDescription = '', orderBy = "id" } = params

  return query<IGetEventList>(`
    {
      eventItems(first: ${limit} skip: ${skip} orderBy: ${orderBy} where: { eventName_contains: "${eventName}" eventDescription_contains: "${eventDescription}"}) {
        id
        eventId
        eventName
        eventDescription
      }
    }`
  )
}