import { fetchWebCOOSCameraPageFiltered, type IWebCOOSCameraPageFiltered } from "@/services/assets/services"
import type {  IMapViewProps } from "@/services/assets/types"
import { useAPIContext } from "@/state/ApiContext"
import { ViewWithLoader } from "@axdspub/axiom-ui-utilities"
import { useQuery } from "@tanstack/react-query"
import {  type ReactElement } from "react"
import LoadedMap from "./LoadedMap"




const MapDataLoader = ({
    View = LoadedMap,
    ...props
}: Omit<IMapViewProps, 'data'> & {
    View?: React.FC<IMapViewProps>
}):ReactElement => {
    const apiContext = useAPIContext()

    const { data, isLoading, isFetching, error } = useQuery<IWebCOOSCameraPageFiltered>({
        queryKey: ['webcoos', 'assets', 'summary', 'unfiltered', 'unsorted'],
        queryFn: async ({signal}) => {
            const results = await fetchWebCOOSCameraPageFiltered({
                apiUrl: apiContext.apiUrl,
                apiVersion: 'v1',
                source: 'webcoos',
                token: apiContext.token,
                signal
            })
            return results
        },
        placeholderData: (previousData): IWebCOOSCameraPageFiltered | undefined => {
            return previousData ?? undefined
        }
    })


    return <ViewWithLoader isLoading={isLoading} isFetching={isFetching} error={error} data={data}>
        {data !== undefined && 
           <View data={data.assets} {...props} />

        }
    </ViewWithLoader>
}

export default MapDataLoader