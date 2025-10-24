import {  fetchLatestServiceMedia } from "@/services/assets/services"
import type { IWebCOOSElement } from "@/services/assets/types"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

export type WebCOOSAssetProps = {
    token: string
    apiUrl: string
    asset: string
}

function roundDateToNearest5Minutes(date:Date): Date {
  const fiveMinutesInMilliseconds = 5 * 60 * 1000; // 5 minutes * 60 seconds/minute * 1000 milliseconds/second

  // Get the current date's time in milliseconds
  const timeInMilliseconds = date.getTime();

  // Round the time to the nearest multiple of fiveMinutesInMilliseconds
  const roundedTime = Math.round(timeInMilliseconds / fiveMinutesInMilliseconds) * fiveMinutesInMilliseconds;

  // Create a new Date object with the rounded time
  return new Date(roundedTime);
}


export type WebCOOSLatestServiceMediaProps = {
    token: string
    apiUrl: string
    serviceIdentifier: string
}

export const useLatestServiceMedia = (props: WebCOOSLatestServiceMediaProps): UseQueryResult<IWebCOOSElement | null> => {
    const queryResult = useQuery({
        queryKey: ['latest', props.serviceIdentifier, roundDateToNearest5Minutes(new Date()).toISOString()],
        queryFn: async ({ signal }): Promise<IWebCOOSElement | null> => {
            const element = await fetchLatestServiceMedia({
                ...props,
                signal
            })
            return element
            
        }
    })

    return queryResult
}
