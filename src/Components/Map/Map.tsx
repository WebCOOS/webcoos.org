import { fetchFromWebCOOSPostgrest } from "@/services/assets/services"
import type {  IWebCOOSMapAsset } from "@/services/assets/types"
import { useAPIContext } from "@/state/ApiContext"
import { ViewWithLoader } from "@axdspub/axiom-ui-utilities"
import { useQuery } from "@tanstack/react-query"
import {  type ReactElement } from "react"
import LoadedMap from "./LoadedMap"




const MapDataLoader = ():ReactElement => {
    const apiContext = useAPIContext()
    const { data, isLoading, isFetching, error } = useQuery<IWebCOOSMapAsset[]>({
        queryKey: ['webcoos', 'assets', 'map'],
        queryFn: async ({signal}) => {
            const results = await fetchFromWebCOOSPostgrest<IWebCOOSMapAsset>({
                apiUrl: apiContext.apiUrl,
                apiVersion: 'v1',
                source: 'webcoos',
                token: apiContext.token,
                params: {
                  table: 'asset_summary_vw',
                  select: [
                    'asset_slug',
                    'asset_label',
                    'asset_location',
                    'asset_description',
                    'asset_operational_status_slug',
                    'asset_disposition_slug',
                    'asset_disposition_label',
                    'asset_operational_status_label',
                    'asset_uuid',
                    'asset_slug',
                    {
                        column: 'asset_data->properties->thumbnails->base',
                        as: 'asset_thumbnails'

                    }
                  ]
                },
                signal
            })
            return results
        }
    })


    return <ViewWithLoader isLoading={isLoading} isFetching={isFetching} error={error} data={data}>
        {data !== undefined && 
           <LoadedMap data={data} />

        }
    </ViewWithLoader>
}

export default MapDataLoader