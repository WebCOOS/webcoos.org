import CameraCard from "@/Components/Cameras/CameraCard"
import StaticMap from "@/Components/Map/StaticMap"
import LatestImage from "@/Components/Media/LatestImage"
import CameraDetail, { CameraSummaryLoader } from "@/Pages/CameraDetail/CameraDetail"
import { fetchWebCOOSCameraPageFiltered, type IWebCOOSCameraPageFiltered } from "@/services/assets/services"
import type { IWebCOOSAssetSummaryView } from "@/services/assets/types"
import { useTimeSeriesAssetMedia } from "@/services/media/useTimeSeriesAssetMedia"
import ApiContext, { useAPIContext } from "@/state/ApiContext"
import { Button, SelectInput, Table, ViewWithLoader } from "@axdspub/axiom-ui-utilities"
import { useQuery } from "@tanstack/react-query"
import { atom, useAtom } from "jotai"
import  {Fragment, useContext, useState, type ReactElement } from "react"
import Markdown from "react-markdown"
import { Link, useParams } from "react-router"

const urlParams = new URLSearchParams(window.location.search)
const initialCameraSlug = urlParams.get('camera_slug') ?? undefined
const selectedCameraSlugAtom = atom<string | undefined>(initialCameraSlug)

const CameraPicker = ({data, View} : {data: IWebCOOSCameraPageFiltered, View: React.FC<{data: IWebCOOSCameraPageFiltered, camera: IWebCOOSAssetSummaryView}>}): ReactElement => {

    const [selectedSlug, setSelectedSlug] = useAtom(selectedCameraSlugAtom)
    const selectedCamera = data.assets.find(c => c.asset_slug === selectedSlug) ?? undefined
    const updateUrl = (slug: string | undefined) => {
        const newSearchParams = new URLSearchParams(window.location.search);
        if(slug !== undefined){
            newSearchParams.set('camera_slug', slug);    
        } else {
            newSearchParams.delete('camera_slug');
        }
        window.history.replaceState({}, '', `${window.location.pathname}?${newSearchParams.toString()}`);
    }
    if(selectedSlug !== undefined){
        updateUrl(selectedSlug)
    }

    return (
        <>
            <div className='flex flex-row gap-4 w-full relative'>
                <SelectInput
                    id='camera-select'
                    testId="camera-select"
                    value={selectedSlug}
                    onChange={e => {
                        const slug = e?.value !== undefined ? String(e.value) : undefined
                        updateUrl(slug)
                        setSelectedSlug(slug)
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
                        updateUrl(undefined)
                        setSelectedSlug(undefined)
                    }}
                >
                    &times;
                </Button>
            </div>
            <div className='relative h-full'>
            {
                selectedCamera === undefined
                ? <p className="mt-4">Please select a camera to view its details.</p>
                : <View data={data} camera={selectedCamera} />
            }
            </div>
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
                content: ({}: {data: IWebCOOSCameraPageFiltered}): ReactElement => <>TABLE</>,
            },
            {
                label: 'Map',
                id: 'map',
                content: ({}: {data: IWebCOOSCameraPageFiltered}): ReactElement => <>MAP</>,
            },
            {
                label: 'Inventory',
                id: 'inventory',
                content: ({}: {data: IWebCOOSCameraPageFiltered}): ReactElement => <>INVENTORY</>,
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
                content: ({data}: {data: IWebCOOSCameraPageFiltered}): ReactElement => <CameraPicker data={data} View={({camera}): ReactElement => <div className='w-[400px] rounded-md shadow-2xl overflow-hidden min-h-[300px] relative'>
                    <CameraCard slug={camera.asset_slug} />
                </div>} />,
            },
            {
                label: 'Map',
                id: 'map',
                content: ({data}: {data: IWebCOOSCameraPageFiltered}): ReactElement => <CameraPicker data={data} View={({camera}): ReactElement => {


                return <div className='relative w-[600px] h-[400px] shadow-md'><CameraDetail slug={camera.asset_slug} View={({summary}): ReactElement => {
                    const point = summary.asset_data.properties.location as GeoJSON.Point | null
                    return (<>{
                        point !== null 
                        ? <StaticMap 
                            latitude={point.coordinates[1]}
                            longitude={point.coordinates[0]}
                            wedgePolygon={summary.asset_data.properties.wedge ?? undefined}
                            width={600}
                            height={400}
                            zoom={10}                
                        /> 
                        : <p>No location data available</p>
                        }</>)}} />
                    </div>
                }} />
                
            },
            {
                label: 'Details',
                id: 'details',
                content: ({data}: {data: IWebCOOSCameraPageFiltered}): ReactElement => <CameraPicker data={data} View={({camera}): ReactElement => {
                    return <CameraSummaryLoader slug={camera.asset_slug} View={({summary}): ReactElement => {
                        return (
                            <Table
                                rowClassName="even:bg-slate-50 odd:bg-slate-200"
                                columns={[
                                    {
                                        id: 'label', 
                                        label: 'Label',
                                        cellClassName: 'font-bold align-top border-r-2 border-slate-300 border-b-0',
                                    },
                                    {
                                        id: 'value', 
                                        label: 'Value', accessor: (row) => <div className="break-words">{row.value}</div>
                                    }
                                ]}
                                data={[
                                    {
                                        label: 'label',
                                        value: summary.asset_label
                                    },
                                    {
                                        label: 'slug',
                                        value: summary.asset_slug
                                    },
                                    {
                                        label: 'description',
                                        value: <Markdown>{summary.asset_description}</Markdown>
                                    },
                                    {
                                        label: 'lat/lon',
                                        value: summary.asset_data.properties.location !== null
                                            ? `${(summary.asset_data.properties.location as GeoJSON.Point).coordinates[1]}, ${(summary.asset_data.properties.location as GeoJSON.Point).coordinates[0]}`
                                            : 'N/A'
                                    },
                                    {
                                        label: 'start/end date',
                                        value: summary.asset_first_starting && summary.asset_last_ending
                                            ? `${new Date(summary.asset_first_starting).toLocaleDateString()} to ${new Date(summary.asset_last_ending).toLocaleDateString()}`
                                            : 'N/A'
                                    },
                                    {
                                        label: 'element size',
                                        value: summary.asset_element_size
                                    },
                                    {
                                        label: 'element count',
                                        value: summary.asset_element_count
                                    },
                                    {
                                        label: 'package',
                                        value: summary.package_label
                                    },
                                    {
                                        label: 'package group',
                                        value: summary.package_group
                                    },
                                    {
                                        label: 'package timezone',
                                        value: summary.package_timezone
                                    },
                                    {
                                        label: 'country',
                                        value: summary.asset_country
                                    },
                                    {
                                        label: 'state',
                                        value: summary.asset_state_or_territory
                                    },
                                    {
                                        label: 'operational status',
                                        value: summary.asset_operational_status_label
                                    },
                                    {
                                        label: 'disposition',
                                        value: summary.asset_disposition_label
                                    },
                                    {
                                        label: 'kind',
                                        value: summary.asset_data.kind
                                    },
                                    {
                                        
                                    }
                                ]}    
                            />
                        )
                    }} />
                }} />
            },
            {
                label: 'Latest',
                id: 'latest',
                content: ({data}: {data: IWebCOOSCameraPageFiltered}): ReactElement => <CameraPicker data={data} View={({camera}): ReactElement => <div className='relative'>
                    <CameraDetail slug={camera.asset_slug} View={({detail}): ReactElement => <>{
                    detail.stillImageService !== null
                    ? <LatestImage
                        service={detail.stillImageService}
                        assetLabel={detail.label}
                        className='shadow-md border-gray-400 min-h-[400px]'
                    />
                    : 'N/A'
                }</>} />
                
                
                </div>} />,
            },
            {
                label: 'Thumb image',
                id: 'thumb-image',
                content:  ({data}: {data: IWebCOOSCameraPageFiltered}): ReactElement => <CameraPicker data={data} View={({camera}): ReactElement => {
                    return <CameraSummaryLoader slug={camera.asset_slug} View={({summary}): ReactElement => {
                        return (
                            <>{
                                summary.asset_data.properties.thumbnails?.base !== null && summary.asset_data.properties.thumbnails?.base !== undefined
                                        ? <div className='flex flex-col gap-4'>
                                            {
                                                ['rect_large', 'rect_medium', 'rect_small', 'square_large', 'square_medium', 'square_small'].map(sizeKey => {
                                                    const imgUrl = (summary.asset_data.properties.thumbnails!.base as Record<string, string>)[sizeKey]
                                                    const image = imgUrl !== undefined ? <div className=''><img key={sizeKey} src={imgUrl} alt={`${summary.asset_label} - ${sizeKey.replace('_', ' ')}`} className="shadow-md border border-gray-400" /><p>{sizeKey}</p></div> : null
                                                    return <Fragment key={sizeKey}>{image}</Fragment>
                                                })
                                            }
                                        </div>
                                        : 'N/A'
                            }</>
                        )
                    }} />
                }} />,
            },
            {
                label: 'Service time series',
                id: 'service-time-series',
                content:  ({data}: {data: IWebCOOSCameraPageFiltered}): ReactElement => <CameraPicker data={data} View={({camera}): ReactElement => {
                    return <CameraDetail slug={camera.asset_slug} View={({detail}): ReactElement => {
                        const serviceByUUID: Record<string, typeof detail.galleryServices[0]> = Object.fromEntries(detail.galleryServices.map(s => [s.uuid, s]))
                        const apiContext = useAPIContext()
                        const [serviceUUID, setServiceUUID] = useState<string | undefined>(undefined)
                        const selectedService  = serviceUUID !== undefined ? serviceByUUID[serviceUUID] : undefined
                        const end = new Date(selectedService?.elements.last_ending ?? selectedService?.elements.last_starting ?? new Date())
                        const start = new Date(+end - 24*60*60*1000)
                        const { data, isLoading, isFetching, error } = useTimeSeriesAssetMedia({
                            serviceIdentifier: serviceUUID ?? '',
                            ...apiContext,
                            start: start,
                            end: end,
                            enabled: selectedService !== undefined
                        })
                        return (
                            <>{
                                detail.galleryServices.length > 0
                                    ? <div className='flex flex-col gap-4 h-full'>
                                        <div className='flex flex-row gap-4'>
                                        {
                                            detail.galleryServices.map(service => (
                                                <div key={service.uuid} className={`p-4 border border-gray-400 shadow-md cursor-pointer  ${service.uuid === serviceUUID ? 'bg-slate-800 text-white' : 'hover:bg-slate-100'}`} onClick={() => {
                                                    setServiceUUID(service.uuid)
                                                }}>
                                                    <h3 className='font-bold mb-2'>Service: {service.common.label}</h3>
                                                    <div className='text-xs'>
                                                        <p><strong>Type:</strong> {service.svcType}</p>
                                                        <p><strong>Slug:</strong> {service.common.slug}</p>
                                                        <p><strong>Time:</strong> {service.elements.first_starting} - {service.elements.last_ending ?? service.elements.last_starting}</p>
                                                        <p><strong>Frequency:</strong> {service.frequency.type}</p>
                                                        <p><strong>Count:</strong> {service.elements.count?.toLocaleString()}</p>
                                                        <p><strong>Size:</strong> {service.elements.size?.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        </div>
                                        <div className='relative h-full overflow-auto'>{
                                                
                                                    selectedService !== undefined 
                                                    ? <ViewWithLoader data={data} isLoading={isLoading} isFetching={isFetching} error={error}>
                                                        {
                                                            data && data.length > 0
                                                            ? <div className='grid grid-cols-4 gap-4'>
                                                                {data.map(element => (
                                                                    <div key={element.uuid} className=''>
                                                                        <p className='mb-2 font-bold'>Element starting: {new Date(element.data.extents.temporal.min).toLocaleString()}</p>
                                                                        <img src={element.data.properties.thumbnails.base.rect_small} alt={`Element ${element.uuid} thumbnail`} className="shadow-md border border-gray-400 max-w-full h-auto" />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            : <p>No elements found for the selected time range.</p>
                                                        }
                                                    </ViewWithLoader>
                                                    : <>Pick one</>
                                                }</div>
                                    </div>
                                    
                                    : 'N/A'
                            }</>
                        )
                    }} />
                }} />,
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
                <h2 className='text-2xl font-bold bg-white sticky z-10 shadow-2xl top-0 p-10 py-4 flex flex-row justify-between items-center gap-4'>
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