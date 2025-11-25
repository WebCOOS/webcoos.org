import { fetchPreviousTimeseriesAssetMedia, fetchNextTimeseriesAssetMedia, fetchNearestTimeseriesAssetMedia, fetchFirstAssetMedia, fetchLatestServiceMedia } from "@/services/assets/services"
import type { IWebCOOSElement } from "@/services/assets/types"
import { type UseQueryResult, useQuery } from "@tanstack/react-query"

export type WebCOOSBrowseMediaProps = {
    token: string
    apiUrl: string
    apiVersion: string
    serviceIdentifier: string
    date: Date | string | number
    direction?: 'next' | 'previous' | 'nearest' | 'first' | 'last'
    count?: number
    enabled?: boolean
}

export const useTimeSeriesAssetBrowse = ({ serviceIdentifier, count = 1, enabled = true, date, direction, ...props }: WebCOOSBrowseMediaProps): UseQueryResult<IWebCOOSElement[] | null> => {
    const queryResult = useQuery({
        queryKey: ['browse', serviceIdentifier, date, direction, enabled],
        enabled,
        queryFn: async ({ signal }): Promise<IWebCOOSElement[] | null> => {
            console.log(`getting ${direction} from ${date}`)
            const elements = direction === 'previous'
                ? await fetchPreviousTimeseriesAssetMedia({
                    ...props,
                    signal,
                    serviceIdentifier,
                    before: date,
                })
                : direction === 'next'
                    ? await fetchNextTimeseriesAssetMedia({
                        ...props,
                        signal,
                        serviceIdentifier,
                        after: date,
                    })
                    : direction === 'first'
                        ? await fetchFirstAssetMedia({
                            ...props,
                            signal,
                            serviceIdentifier
                        })
                        : direction === 'last'
                            ? await fetchLatestServiceMedia({
                                ...props,
                                signal,
                                serviceIdentifier
                            })
                    : await fetchNearestTimeseriesAssetMedia({
                        ...props,
                        signal,
                        serviceIdentifier,
                        date
                    })
            return Array.isArray(elements) ? elements : [elements];

        }
    })

    return queryResult
}
