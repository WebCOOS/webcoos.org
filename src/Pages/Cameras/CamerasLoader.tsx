import { type IWebCOOSCameraPageFiltered, fetchWebCOOSCameraPageFiltered } from "@/services/assets/services"
import ApiContext from "@/state/ApiContext"
import { ViewWithLoader } from "@axdspub/axiom-ui-utilities"
import { useQuery } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { type ReactElement, useContext, useEffect } from "react"
import filterAtom, { filterPrefix } from "./filterAtom"
import CameraTable from "./CamerasTable"
import sortAtom, { sortPrefix } from "./sortAtom"

const CamerasLoader = ({
    View = CameraTable
}: {
    View?: React.FC<{data: IWebCOOSCameraPageFiltered}>
}): ReactElement => {

    const apiContext = useContext(ApiContext)
    const [filters] = useAtom(filterAtom)
    const [sorts] = useAtom(sortAtom)
    useEffect(() => {
        const url = new URL(window.location.href)
        const allKeys = Array.from(url.searchParams.keys())
        Object.keys(filters).concat(allKeys).forEach(k => {
            const fk = `${filterPrefix}${k}`
            if (filters[k as keyof typeof filters] !== null && filters[k as keyof typeof filters] !== '' && filters[k as keyof typeof filters] !== undefined) {
                url.searchParams.set(fk, filters[k as keyof typeof filters] as string)
            } else {
                url.searchParams.delete(fk)
            }
        })
        window.history.pushState({}, '', url.toString())
    }, [filters])

    useEffect(() => {
        const url = new URL(window.location.href)
        const allKeys = Array.from(url.searchParams.keys())
        const sortsMap = Object.fromEntries(sorts.map(s => [s.column, s]))
        sorts.map(s => s.column).concat(allKeys).forEach(k => {
            const sk = `${sortPrefix}${k}`
            if (sortsMap[k]?.dir !== undefined) {
                url.searchParams.set(sk, sortsMap[k].dir === 'asc' ? 'true' : 'false')
            } else {
                url.searchParams.delete(sk)
            }
        })
        window.history.pushState({}, '', url.toString())
    }, [sorts])


    const { data, isLoading, isFetching, error } = useQuery<IWebCOOSCameraPageFiltered>({
        queryKey: ['webcoos', 'assets', 'summary', JSON.stringify(filters), JSON.stringify(sorts)],
        queryFn: async ({signal}) => {
            const results = await fetchWebCOOSCameraPageFiltered({
                apiUrl: apiContext.apiUrl,
                apiVersion: 'v1',
                source: 'webcoos',
                token: apiContext.token,
                params: {
                  filters: Object.keys(filters)
                    .filter(k => filters[k as keyof typeof filters] !== null && filters[k as keyof typeof filters] !== undefined && filters[k as keyof typeof filters] !== '')
                    .map(k => {
                      return {
                        column: k,
                        value: filters[k as keyof typeof filters] as string,
                        operator: 'eq'
                      }
                    }),
                  order: sorts
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
                      <View data={data} />                  
              )}
          </ViewWithLoader>
          </div>
          </div>
    )
}

export default CamerasLoader