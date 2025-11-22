import { type IWebCOOSCameraPageFiltered, fetchWebCOOSCameraPageFiltered } from "@/services/assets/services"
import ApiContext from "@/state/ApiContext"
import { ViewWithLoader } from "@axdspub/axiom-ui-utilities"
import { useQuery } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { type ReactElement, useContext, useEffect } from "react"
import filterAtom, { filterPrefix } from "./filterAtom"
import sortAtom, { sortPrefix } from "./sortAtom"
import CamerasView from "./CamerasView"

const CamerasLoader = ({
    View = CamerasView
}: {
    View?: React.FC<{data: IWebCOOSCameraPageFiltered}>
}): ReactElement => {

    const apiContext = useContext(ApiContext)
    const [filters] = useAtom(filterAtom)
    useEffect(() => {
        const url = new URL(window.location.href)
        const allKeys = Array.from(url.searchParams.keys()).map(k => {
            if (k.startsWith(filterPrefix)) {
                return k.replace(new RegExp(`^${filterPrefix}`), '')
            }
        }).filter(k => k !== undefined) as string[]
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


    const [sorts] = useAtom(sortAtom)
    useEffect(() => {
        const url = new URL(window.location.href)
        const allKeys = Array.from(url.searchParams.keys()).map(k => {
            if (k.startsWith(sortPrefix)) {
                return k.replace(new RegExp(`^${sortPrefix}`), '')
            }
        }).filter(k => k !== undefined) as string[]
        const sortsMap = Object.fromEntries(sorts.map(s => [s.column, s]))
        sorts.map(s => s.column).concat(allKeys).forEach(k => {
            const sk = `${sortPrefix}${k}`
            if (sortsMap[k]?.dir !== undefined) {
                url.searchParams.set(sk, sortsMap[k].dir)
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

        <ViewWithLoader 
            isLoading={isLoading} 
            isFetching={isFetching} 
            error={error} 
            keepExistingContentWhileLoading={true}
            data={data}
            /* LoaderComponent={({className}): ReactElement => {
                return <div className='absolute top-0 bottom-0 left-0 right-0 bg-white/60 z-30'>
                    <Loader className={`${className} mx-auto mt-40 absolute top-0 left-0 right-0`} />
                </div>
            }} */
            >
            {data && (
                <View data={data} />                  
            )}
        </ViewWithLoader>
    )
}

export default CamerasLoader