import { fetchWebCOOSCameraSummary } from "@/services/assets/services"
import type { IWebCOOSAssetSummaryView } from "@/services/assets/types"
import ApiContext from "@/state/ApiContext"
import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { useContext } from "react"

export type WebCOOSAssetProps = {
    token: string
    apiUrl: string
}

export const useWebCOOSCameraSummary = (slug: string): UseQueryResult<IWebCOOSAssetSummaryView> => {
    const apiContext = useContext(ApiContext)
    const queryResult = useQuery({
        queryKey: ['asset', slug],
        queryFn: async ({ signal }): Promise<IWebCOOSAssetSummaryView> => {
            const camera = await fetchWebCOOSCameraSummary({
                ...apiContext,
                signal,
                slug
            })
            return camera
        }
    })

    return queryResult
}
