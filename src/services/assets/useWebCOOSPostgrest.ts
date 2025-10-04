import { fetchFromWebCOOSPostgrest } from "@/services/assets/services"
import type { IPostgrestParams, IWebCOOSApiRequestParams, IWebCOOSAssetElementView, IWebCOOSAssetSummaryView, IWebCOOSElementInventory } from "@/services/assets/types"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"


export const useWebCOOSPostgrest = <T,>(props: IWebCOOSApiRequestParams & {
    params: IPostgrestParams<T>
}): UseQueryResult<T[]> => {
    const queryResult = useQuery({
        queryKey: [JSON.stringify(props)],
        queryFn: async ({ signal }): Promise<T[]> => {
            const inventory = await fetchFromWebCOOSPostgrest({
                ...props,
                signal
            })
            return inventory
        }
    })

    return queryResult
}


export const useWebCOOSElementInventory = (props: IWebCOOSApiRequestParams & {
    params?: Omit<IPostgrestParams<IWebCOOSElementInventory>, 'table'>
}): UseQueryResult<IWebCOOSElementInventory[]> => {
    return useWebCOOSPostgrest<IWebCOOSElementInventory>({
        ...props,
        params: {
            ...props.params,
            table: 'webcoos_elementinventory'
        }
    })
}


export const useWEBCOOSAssetElementView = (props: IWebCOOSApiRequestParams & {
    params?: Omit<IPostgrestParams<IWebCOOSAssetElementView>, 'table'>
}): UseQueryResult<IWebCOOSAssetElementView[]> => {
    return useWebCOOSPostgrest<IWebCOOSAssetElementView>({
        ...props,
        params: {
            ...props.params,
            table: 'asset_element_vw'
        }
    })
}

export const useWEBCOOSAssetSummaryView = (props: IWebCOOSApiRequestParams & {
    params?: Omit<IPostgrestParams<IWebCOOSAssetSummaryView>, 'table'>
}): UseQueryResult<IWebCOOSAssetSummaryView[]> => {
    return useWebCOOSPostgrest<IWebCOOSAssetSummaryView>({
        ...props,
        params: {
            ...props.params,
            table: 'asset_summary_vw'
        }
    })
}
