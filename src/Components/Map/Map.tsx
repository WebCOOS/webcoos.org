import { fetchFromWebCOOSPostgrest } from "@/services/assets/services"
import type {  IWebCOOSMapAsset } from "@/services/assets/types"
import ApiContext from "@/state/ApiContext"
import { Loader, ViewWithLoader } from "@axdspub/axiom-ui-utilities"
import { useQuery } from "@tanstack/react-query"
import { lazy, Suspense, useContext, type ReactElement } from "react"






const MapLoader = ({data}: {data: IWebCOOSMapAsset[]}): ReactElement => {
    const LoadedMap = lazy(async () => await import('./LoadedMap'))
    return <Suspense fallback={<Loader className="h-16 w-16 pt-20 mx-auto" />}>
        <div className="w-full h-full">
            <LoadedMap data={data} />
        </div>
    </Suspense>


}


const MapDataLoader = () => {
    const apiContext = useContext(ApiContext)
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
                    'asset_label',
                    'asset_location',
                    'asset_description',
                    'asset_operational_status',
                    'asset_disposition_slug',
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
           <MapLoader data={data} />

        }
    </ViewWithLoader>
}

export default MapDataLoader