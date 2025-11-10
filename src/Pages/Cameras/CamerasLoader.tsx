import { type IWebCOOSCameraPageFiltered, fetchWebCOOSCameraPageFiltered } from "@/services/assets/services"
import ApiContext from "@/state/ApiContext"
import { ViewWithLoader } from "@axdspub/axiom-ui-utilities"
import { useQuery } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { type ReactElement, useContext, useEffect } from "react"
import filterAtom from "./filterAtom"
import CameraTable from "./CamerasTable"

const CamerasLoader = (): ReactElement => {

    const apiContext = useContext(ApiContext)
    const [filters] = useAtom(filterAtom)
    useEffect(() => {
        const url = new URL(window.location.href)
        const allKeys = Array.from(url.searchParams.keys())
        Object.keys(filters).concat(allKeys).forEach(k => {
            if (filters[k as keyof typeof filters] !== null && filters[k as keyof typeof filters] !== '' && filters[k as keyof typeof filters] !== undefined) {
                url.searchParams.set(k, filters[k as keyof typeof filters] as string)
            } else {
                url.searchParams.delete(k)
            }
        })
        window.history.pushState({}, '', url.toString())
    }, [filters])


    const { data, isLoading, isFetching, error } = useQuery<IWebCOOSCameraPageFiltered>({
        queryKey: ['webcoos', 'assets', 'summary', JSON.stringify(filters)],
        queryFn: async ({signal}) => {
            const results = await fetchWebCOOSCameraPageFiltered({
                apiUrl: apiContext.apiUrl,
                apiVersion: 'v1',
                source: 'webcoos',
                token: apiContext.token,
                params: {
                  select: [
                    'asset_label',
                    'asset_region',
                    'asset_state_or_territory',
                    'asset_slug',
                    'asset_service_slugs',
                    'asset_disposition_slug',
                    'asset_operational_status',
                    'asset_first_starting',
                    'asset_last_ending',
                    {
                        column: 'asset_data->properties->thumbnails->base',
                        as: 'asset_thumbnails'
                    }
                  ],
                  filters: Object.keys(filters)
                    .filter(k => filters[k as keyof typeof filters] !== null && filters[k as keyof typeof filters] !== undefined && filters[k as keyof typeof filters] !== '')
                    .map(k => {
                      return {
                        column: k,
                        value: filters[k as keyof typeof filters] as string,
                        operator: 'eq'
                      }
                    })
                },
                signal
            })
            return results
        },
        placeholderData: (previousData): IWebCOOSCameraPageFiltered | undefined => {
            return previousData ?? undefined
        }
    })

    return (
        <div className='p-10 flex flex-col h-full'>
            <h1 className='text-2xl font-bold'>Cameras New</h1>
            <div className='relative h-full'>
          <ViewWithLoader 
            isLoading={isLoading} 
            isFetching={isFetching} 
            error={error} 
            data={data}
            /* LoaderComponent={({className}): ReactElement => {
                return <div className='absolute top-0 left-0 w-full h-full bg-white bg-opacity-40 z-30 -mx-10'>
                    <Loader className={`${className} pt-30 pb-30`} />
                </div>
            }} */
            >
              {data !== undefined && data !== null && (

                      <CameraTable data={data} />
                  
              )}
          </ViewWithLoader>
          </div>
          </div>
    )
}

export default CamerasLoader