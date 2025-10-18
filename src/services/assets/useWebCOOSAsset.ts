import { parseWebCOOSAsset } from "@/services/assets/parsers"
import { fetchAPIAssets } from "@/services/assets/services"
import type { IWebCOOSParsedAsset } from "@/services/assets/types"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

export type WebCOOSAssetProps = {
    token: string
    apiUrl: string
    asset: string
}

export const useWebCOOSAsset = (params: WebCOOSAssetProps): UseQueryResult<IWebCOOSParsedAsset[]> => {
    const queryResult = useQuery({
        queryKey: ['asset', params.asset],
        queryFn: async ({ signal }): Promise<IWebCOOSParsedAsset[]> => {
            const rawAssets = await fetchAPIAssets({
                ...params,
                signal
            })
            const parsedAssets = rawAssets.map(asset => parseWebCOOSAsset(asset))
            return parsedAssets
        }
    })

    return queryResult
}
