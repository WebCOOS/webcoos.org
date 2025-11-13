import CameraCard from "@/Components/Cameras/CameraCard"
import { fetchWebCOOSCameraPageFiltered, type IWebCOOSCameraPageFiltered } from "@/services/assets/services"
import type { IWebCOOSAssetSummaryView } from "@/services/assets/types"
import ApiContext from "@/state/ApiContext"
import { Button, SelectInput, ViewWithLoader } from "@axdspub/axiom-ui-utilities"
import { useQuery } from "@tanstack/react-query"
import  {useContext, type ReactElement } from "react"
import { Link, useParams, useSearchParams } from "react-router"

const CameraPicker = ({data, View} : {data: IWebCOOSCameraPageFiltered, View: React.FC<{data: IWebCOOSCameraPageFiltered, camera: IWebCOOSAssetSummaryView}>}): ReactElement => {
    const [searchParams, setSearchParams] = useSearchParams()
    const selectedSlug = searchParams.get('camera_slug') ?? undefined
    const selectedCamera = data.assets.find(c => c.asset_slug === selectedSlug) ?? undefined

    return (
        <>
            <div className='flex flex-row gap-4 w-full'>
                <SelectInput
                    id='camera-select'
                    testId="camera-select"
                    value={selectedSlug}
                    onChange={e => {
                        setSearchParams({ camera_slug: String(e.value) })
                    }}
                    options={data.assets.map(c => ({
                        label: c.asset_label,
                        value: c.asset_slug
                    }))}
                    placeholder="Select a camera"
                />
                <Button
                    type='none'
                    className={`p-0 border-0 bg-none text-2xl cursor-pointer ${selectedCamera === undefined ? 'invisible' : 'visible'}`}
                    onClick={() => {
                        setSearchParams({})
                    }}
                >
                    &times;
                </Button>
            </div>
            {
                selectedCamera === undefined
                ? <p className="mt-4">Please select a camera to view its details.</p>
                : <View data={data} camera={selectedCamera} />
            }
        </>

    )
}



const groups = [
    {
        label: 'Camera lists',
        id: 'camera-lists',
        items: [
            {
                label: 'Table',
                id: 'table',
                content: ({data}: {data: IWebCOOSCameraPageFiltered}): ReactElement => <>TABLE</>,
            },
            {
                label: 'Map',
                id: 'map',
                content: ({data}: {data: IWebCOOSCameraPageFiltered}): ReactElement => <>MAP</>,
            },
            {
                label: 'Inventory',
                id: 'inventory',
                content: ({data}: {data: IWebCOOSCameraPageFiltered}): ReactElement => <>INVENTORY</>,
            }
        ]
    },
    {
        label: 'Camera detail',
        id: 'camera-detail',
        items: [
            {
                label: 'Card',
                id: 'card',
                content: ({data}: {data: IWebCOOSCameraPageFiltered}): ReactElement => <CameraPicker data={data} View={({data, camera}): ReactElement => <div className='w-[400px] rounded-md shadow-2xl overflow-hidden'>
                    <CameraCard slug={camera.asset_slug} />
                </div>} />,
            },
            {
                label: 'Map',
                id: 'map',
                content: ({data}: {data: IWebCOOSCameraPageFiltered}): ReactElement => <>MAP</>
            },
            {
                label: 'Details',
                id: 'details',
                content: ({data}: {data: IWebCOOSCameraPageFiltered}): ReactElement => <>DETAILS</>
            },
            {
                label: 'Latest',
                id: 'latest',
                content: ({data}: {data: IWebCOOSCameraPageFiltered}): ReactElement => <>LATEST IMAGE</>
            },
            {
                label: 'Thumb image',
                id: 'thumb-image',
                content: ({data}: {data: IWebCOOSCameraPageFiltered}): ReactElement => <>THUMB IMAGE</>
            }
        ]
    }
]

const mapped = Object.fromEntries(groups.map(g => [g.id, Object.fromEntries(g.items.map(i => [i.id, {...i, group: g}]))]))




const Demo = (): ReactElement => {
    const apiContext = useContext(ApiContext)

    const { data, isLoading, isFetching, error } = useQuery<IWebCOOSCameraPageFiltered>({
        queryKey: ['webcoos', 'assets', 'summary'],
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

    const { groupId, itemId } = useParams<{ groupId: string; itemId: string }>()
    const selected = mapped[groupId!]?.[itemId!]

    return (
        <ViewWithLoader isLoading={isLoading} isFetching={isFetching} error={error} data={data}>
            {
                data !== undefined && 
            
        <div className='absolute top-0 left-0 w-full h-full flex items-center flex-row'>
            <div className='h-full bg-slate-100 overflow-y-auto flex flex-col gap-4 w-[20%] min-w-[200px] shadow-2xl z-50'>
                {groups.map((group) => (
                    <div key={group.id} className='border-b border-slate-300'>
                        <h3 className='font-bold mb-2 p-2'>{group.label}</h3>
                        <ul className='flex flex-col'>
                            {group.items.map((item) => {
                                const selected = groupId === group.id && itemId === item.id
                                return (<li key={item.id}>
                                    <Link to={`/demo/${group.id}/${item.id}`} className={`block p-2 text-blue-500 ${selected ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}>{item.label}</Link>
                                </li>
                                )
                            })}
                        </ul>
                    </div>
                ))}
            </div>
            <div className='h-full w-1/2 overflow-y-auto flex-grow relative'>
            {
                selected 
                ? <>
                <h2 className='text-2xl font-bold bg-slate-200/80 sticky top-0 p-10 py-4 flex flex-row justify-between items-center gap-4'>
                    <span>
                    <span className='text-slate-400'>
                        {selected.group.label} &raquo;&nbsp;
                    </span> 
                    {selected.label}
                    </span>
                    <Link to="/demo" className="text-slate-600 hover:text-slate-900">&times;</Link>
                </h2>
                <div className='p-10 flex flex-col gap-4'>
                   {selected.content({data})}
                   
                </div>
                </>
                : <div className='flex items-center justify-center h-full'>
                    <h2 className='text-2xl font-bold'>Please select a demo from the left menu</h2>
                </div>
                
            }
                
            </div>

        </div>
        }
        </ViewWithLoader>
    )
}

export default Demo