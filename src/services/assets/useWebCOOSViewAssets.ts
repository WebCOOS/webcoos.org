import { fetchFromWebCOOSPostgrest } from "@/services/assets/services"
import type { IPostgrestParams, IWebCOOSApiRequestParams, IWebCOOSElementInventory } from "@/services/assets/types"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"

export type WebCOOSAssetProps = {
    token: string
    apiUrl: string
    asset?: string
}

export const useWebCOOSViewAssets = <T = IWebCOOSElementInventory,>(params: IWebCOOSApiRequestParams & {
    params: IPostgrestParams<T>
}): UseQueryResult<T[]> => {
    const queryResult = useQuery({
        queryKey: [JSON.stringify(params)],
        queryFn: async ({ signal }): Promise<T[]> => {
            const inventory = await fetchFromWebCOOSPostgrest({
                ...params,
                signal
            })
            return inventory
        }
    })

    return queryResult
}
