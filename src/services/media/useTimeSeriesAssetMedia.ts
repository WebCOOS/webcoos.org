import { fetchTimeseriesAssetMedia } from "@/services/assets/services"
import type { IWebCOOSElement } from "@/services/assets/types"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

export type WebCOOSAssetProps = {
    token: string
    apiUrl: string
    asset: string
}




export type WebCOOSLatestMediaProps = {
    token: string
    apiUrl: string
    apiVersion: string
    serviceIdentifier: string
    start: Date | string | number
    end: Date | string | number
    enabled?: boolean
}

export const useTimeSeriesAssetMedia = ({ serviceIdentifier, enabled = true, start, end, ...props }: WebCOOSLatestMediaProps): UseQueryResult<IWebCOOSElement[] | null> => {
    const queryResult = useQuery({
        queryKey: ['timeseries', serviceIdentifier, start, end, enabled],
        enabled,
        queryFn: async ({ signal }): Promise<IWebCOOSElement[] | null> => {
            const elements = await fetchTimeseriesAssetMedia({
                ...props,
                signal,
                serviceIdentifier,
                start,
                end
            })
            return elements

        }
    })

    return queryResult
}


