import CameraCard from "@/Components/Cameras/CameraCard"
import StaticMap from "@/Components/Map/StaticMap"
import LatestImage from "@/Components/Media/LatestImage"
import CameraDetail, { CameraSummaryLoader } from "@/Pages/CameraDetail/CameraDetail"
import CamerasLoader from "@/Pages/Cameras/CamerasLoader"
import { CamerasTable } from "@/Pages/Cameras/CamerasView"
import { makeUTCDate } from "@/services/assets/parsers"
import { fetchWebCOOSCameraPageFiltered, type IWebCOOSCameraPageFiltered } from "@/services/assets/services"
import type { IWebCOOSAssetSummaryView, IWebCOOSParsedGalleryService } from "@/services/assets/types"
import { useWebCOOSElementInventory } from "@/services/assets/useWebCOOSPostgrest"
import { useTimeSeriesAssetBrowse } from "@/services/media/useTimeSeriesAssetBrowse"
import { useTimeSeriesAssetMedia } from "@/services/media/useTimeSeriesAssetMedia"
import ApiContext, { useAPIContext } from "@/state/ApiContext"
import { Button, SelectInput, Table, Tabs, ViewWithLoader } from "@axdspub/axiom-ui-utilities"
import { useQuery } from "@tanstack/react-query"
import { atom, useAtom } from "jotai"
import { Fragment, useContext, useState, type ReactElement } from "react"
import Markdown from "react-markdown"
import { Link, useParams } from "react-router"
// import { Chart, EPlotTypes } from '@axdspub/axiom-charts'

const urlParams = new URLSearchParams(window.location.search)
const initialCameraSlug = urlParams.get('camera_slug') ?? undefined
const selectedCameraSlugAtom = atom<string | undefined>(initialCameraSlug)

const CameraPicker = ({ data, View }: { data: IWebCOOSCameraPageFiltered, View: React.FC<{ data: IWebCOOSCameraPageFiltered, camera: IWebCOOSAssetSummaryView }> }): ReactElement => {

    const [selectedSlug, setSelectedSlug] = useAtom(selectedCameraSlugAtom)
    const selectedCamera = data.assets.find(c => c.asset_slug === selectedSlug) ?? undefined
    const updateUrl = (slug: string | undefined) => {
        const newSearchParams = new URLSearchParams(window.location.search);
        if (slug !== undefined) {
            newSearchParams.set('camera_slug', slug);
        } else {
            newSearchParams.delete('camera_slug');
        }
        window.history.replaceState({}, '', `${window.location.pathname}?${newSearchParams.toString()}`);
    }
    if (selectedSlug !== undefined) {
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


const ServiceSelector = ({
    data,
    View
}: {
    data: IWebCOOSCameraPageFiltered,
    View?: React.FC<{ service: IWebCOOSParsedGalleryService | undefined }>
}): ReactElement => <CameraPicker data={data} View={({ camera }): ReactElement => {
    return <CameraDetail slug={camera.asset_slug} View={({ detail }): ReactElement => {
        const serviceByUUID: Record<string, typeof detail.galleryServices[0]> = Object.fromEntries(detail.galleryServices.map(s => [s.uuid, s]))
        return (
            <>{
                detail.galleryServices.length > 0
                    ? <>
                        <Tabs

                            tabs={detail.galleryServices.map(service => ({
                                id: service.uuid,
                                label: service.common.label,
                                content: View !== undefined
                                    ? <View service={serviceByUUID[service.uuid]} />
                                    : <>No service view provided</>
                            }))}
                        />
                    </>

                    : 'N/A'
            }</>
        )
    }} />
}}
    />

const GalleryGrid = ({ service }: { service?: IWebCOOSParsedGalleryService }): ReactElement => {

    const apiContext = useAPIContext()
    const end = makeUTCDate(service?.elements.last_ending ?? service?.elements.last_starting ?? makeUTCDate())
    const start = makeUTCDate(+end - 24 * 60 * 60 * 1000)
    const { data, isLoading, isFetching, error } = useTimeSeriesAssetMedia({
        serviceIdentifier: service?.uuid ?? '',
        ...apiContext,
        start: start,
        end: end,
        enabled: service !== undefined
    })



    return (
        <div className='flex flex-col gap-4 h-full'>

            <div className='relative h-full overflow-auto min-h-[400px]'>{
                service !== undefined
                    ? <ViewWithLoader data={data} isLoading={isLoading} isFetching={isFetching} error={error}>
                        {
                            data && data.length > 0
                                ? <div className='grid grid-cols-4 gap-4'>
                                    {data.map(element => {
                                        const image = element.data.properties.thumbnails?.base?.rect_small
                                            ?? element.data.properties.thumbnails?.base?.lqip
                                            ?? element.data.properties.thumbnails?.base?.rect_medium
                                        return <div key={element.uuid} className=''>
                                            <p className='mb-2 font-bold'>Element starting: {makeUTCDate(element.data.extents.temporal.min).toLocaleString()}</p>
                                            <img src={image} alt={`Element ${element.uuid} thumbnail`} className="shadow-md border border-gray-400 max-w-full h-auto" />
                                        </div>
                                    })}
                                </div>
                                : data && <p>No elements found for the selected time range.</p>
                        }
                    </ViewWithLoader>
                    : <>Pick one</>
            }</div>
        </div>

    )
}


const GalleryBrowse = ({ service }: { service?: IWebCOOSParsedGalleryService }): ReactElement => {
    const apiContext = useAPIContext()
    const startString = service?.elements.first_starting ?? service?.elements.first_ending ?? null
    const endString = service?.elements.last_ending ?? service?.elements.last_starting ?? null
    const start = startString !== null ? makeUTCDate(startString) : undefined
    const end = endString !== null ? makeUTCDate(endString) : undefined
    const [currentDate, setCurrentDate] = useState<Date | undefined>(undefined)
    const [direction, setDirection] = useState<'previous' | 'next' | 'nearest' | 'first' | 'last'>('first')
    const { data, isLoading, isFetching, error } = useTimeSeriesAssetBrowse({
        serviceIdentifier: service?.uuid ?? '',
        ...apiContext,
        date: currentDate ?? start ?? makeUTCDate(),
        direction,
        enabled: service !== undefined && (currentDate !== undefined || start !== undefined)
    })

    return (
        <>
            {
                start !== undefined && end !== undefined && <div className='flex flex-col gap-4'>
                    <p>{startString} to {endString}</p>
                    <div className='h-[300px] p-4 bg-slate-100 shadow-md relative'>
                        <ViewWithLoader data={data} isLoading={isLoading} isFetching={isFetching} error={error}>
                            {
                                data &&
                                <div className='flex flex-col gap-4'>

                                    <p>{data[0]?.data.extents.temporal.min ?? 'NAN'}</p>
                                </div>
                            }
                        </ViewWithLoader>
                    </div>
                    {
                        <div className='flex flex-row gap-4 items-center'>
                            <Button
                                type='create'
                                disabled={data === undefined || data === null || new Date(data[0]?.data.extents.temporal.min).getTime() === +start}
                                onClick={() => {
                                    setDirection('first')
                                    if (data !== undefined && data !== null && data.length > 0) {
                                        if (data[0] !== undefined) {
                                            setCurrentDate(makeUTCDate(data[0].data.extents.temporal.min))
                                        }
                                    }
                                }}
                            >First</Button>
                            <Button
                                type='create'
                                disabled={data === undefined || data === null || new Date(data[0]?.data.extents.temporal.min).getTime() === +start}
                                onClick={() => {
                                    if (data !== undefined && data !== null && data.length > 0) {
                                        setDirection('previous')
                                        if (data[0] !== undefined) {
                                            setCurrentDate(makeUTCDate(data[0].data.extents.temporal.min))
                                        }
                                    }
                                }}
                            >Previous</Button>
                            <Button
                                type='create'
                                disabled={data === undefined || data === null || new Date(data[0]?.data.extents.temporal.min).getTime() === +end}
                                onClick={() => {
                                    if (data !== undefined && data !== null && data.length > 0) {
                                        setDirection('next')
                                        if (data[0] !== undefined) {
                                            setCurrentDate(makeUTCDate(data[0].data.extents.temporal.min))
                                        }

                                    }
                                }}
                            >Next</Button>
                            <Button
                                type='create'
                                disabled={data === undefined || data === null || new Date(data[0]?.data.extents.temporal.min).getTime() === +end}
                                onClick={() => {
                                    setDirection('last')
                                    if (data !== undefined && data !== null && data.length > 0) {
                                        if (data[0] !== undefined) {
                                            setCurrentDate(makeUTCDate(data[0].data.extents.temporal.min))
                                        }
                                    }
                                }}
                            >Last</Button>
                        </div>
                    }
                </div>
            }
        </>
    )
}


const ServiceInventory = ({ service }: { service: IWebCOOSParsedGalleryService }): ReactElement => {
    const apiContext = useAPIContext()
    const { data, isLoading, isFetching, error } = useWebCOOSElementInventory({
        ...apiContext,
        params: {
            filters: [
                {
                    column: 'service_slug',
                    operator: 'eq',
                    value: service.common.slug
                }
            ],
            order: [
                {
                    column: 'time_bucket',
                    dir: 'desc'
                }
            ]
        },
        grouping: 'day'

    })

    return (
        <ViewWithLoader data={data} isLoading={isLoading} isFetching={isFetching} error={error}>
            {
                data && data.length > 0 &&
                <>
                    {/* <Chart
                        settings={{
                            margin: { top: 20, right: 20, bottom: 40, left: 60 },
                            width: 'auto',
                            height: 200,
                            axes: {
                                y: {
                                    domain: [
                                        0,
                                        Math.max(...data.map(d => d.bucket_count)),
                                    ]
                                }
                            }

                        }}
                        plots={[
                            {
                                id: `${service.uuid}-bucket-count`,
                                type: EPlotTypes.bar,
                                data: data,
                                dimensions: {
                                    x: {
                                        property: 'time_bucket',
                                        parameter: 'time_bucket'
                                    },
                                    y: {
                                        property: 'bucket_count',
                                        parameter: 'bucket_count'
                                    }
                                }

                            }
                        ]}

                    /> */}
                    <Table
                        columns={[
                            {
                                id: 'time_bucket',
                                label: 'Date'
                            },
                            {
                                id: 'bucket_count',
                                label: 'Bucket Count'
                            }
                        ]}
                        data={data}
                    />
                </>
            }
        </ViewWithLoader >
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
                content: ({ }: { data: IWebCOOSCameraPageFiltered }): ReactElement => {



                    /* return <CamerasTable data={data} theadClassName="top-16" className='-mt-10' /> */
                    return <CamerasLoader View={({ data }): ReactElement => <CamerasTable data={data} theadClassName="top-16" className='-mt-10' />} />

                },
            },
            {
                label: 'Map',
                id: 'map',
                content: ({ }: { data: IWebCOOSCameraPageFiltered }): ReactElement => <>MAP</>,
            },
            {
                label: 'Inventory',
                id: 'inventory',
                content: ({ }: { data: IWebCOOSCameraPageFiltered }): ReactElement => <>INVENTORY</>,
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
                content: ({ data }: { data: IWebCOOSCameraPageFiltered }): ReactElement => <CameraPicker data={data} View={({ camera }): ReactElement => <div className='w-[400px] rounded-md shadow-2xl overflow-hidden min-h-[300px] relative'>
                    <CameraCard slug={camera.asset_slug} />
                </div>} />,
            },
            {
                label: 'Map',
                id: 'map',
                content: ({ data }: { data: IWebCOOSCameraPageFiltered }): ReactElement => <CameraPicker data={data} View={({ camera }): ReactElement => {


                    return <div className='relative w-[600px] h-[400px] shadow-md'><CameraDetail slug={camera.asset_slug} View={({ summary }): ReactElement => {
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
                        }</>)
                    }} />
                    </div>
                }} />

            },
            {
                label: 'Details',
                id: 'details',
                content: ({ data }: { data: IWebCOOSCameraPageFiltered }): ReactElement => <CameraPicker data={data} View={({ camera }): ReactElement => {
                    return <CameraSummaryLoader slug={camera.asset_slug} View={({ summary }): ReactElement => {
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
                                            ? `${makeUTCDate(summary.asset_first_starting).toLocaleDateString()} to ${makeUTCDate(summary.asset_last_ending).toLocaleDateString()}`
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
                content: ({ data }: { data: IWebCOOSCameraPageFiltered }): ReactElement => <CameraPicker data={data} View={({ camera }): ReactElement => <div className='relative'>
                    <CameraDetail slug={camera.asset_slug} View={({ detail }): ReactElement => <>{
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
                content: ({ data }: { data: IWebCOOSCameraPageFiltered }): ReactElement => <CameraPicker data={data} View={({ camera }): ReactElement => {
                    return <CameraSummaryLoader slug={camera.asset_slug} View={({ summary }): ReactElement => {
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
                label: 'Gallery grid',
                id: 'gallery-grid',
                content: ({ data }: { data: IWebCOOSCameraPageFiltered }): ReactElement => {
                    return <ServiceSelector data={data} View={GalleryGrid} />
                },
            },
            {
                label: 'Gallery browse',
                id: 'gallery-browse',
                content: ({ data }: { data: IWebCOOSCameraPageFiltered }): ReactElement => {
                    return <ServiceSelector data={data} View={GalleryBrowse} />
                }
            },
            {
                label: 'Inventory',
                id: 'inventory',
                content: ({ data }: { data: IWebCOOSCameraPageFiltered }): ReactElement => {
                    return <CameraPicker data={data}
                        View={
                            ({ camera }): ReactElement => {
                                return <CameraDetail slug={camera.asset_slug} View={({ detail }): ReactElement => {
                                    return (
                                        <div className='flex flex-col gap-4'>
                                            <p className="text-xl font-bold">{
                                                detail.dateBounds.map(d => d?.toString() ?? 'N/A').join(' to ')
                                            }</p>
                                            {
                                                detail.galleryServices.length > 0
                                                    ? detail.galleryServices.map(service => (
                                                        <div key={service.uuid} className='border-t border-slate-300 pt-4'>
                                                            <p>{service.common.label} ({service.uuid})</p>
                                                            <ServiceInventory key={service.uuid} service={service} />
                                                        </div>
                                                    ))
                                                    : 'N/A'
                                            }
                                        </div>
                                    )
                                }} />
                            }
                        }
                    />
                }
            }
        ]
    }
]

const mapped = Object.fromEntries(groups.map(g => [g.id, Object.fromEntries(g.items.map(i => [i.id, { ...i, group: g }]))]))




const Demo = (): ReactElement => {
    const apiContext = useContext(ApiContext)

    const { data, isLoading, isFetching, error } = useQuery<IWebCOOSCameraPageFiltered>({
        queryKey: ['webcoos', 'assets', 'summary'],
        queryFn: async ({ signal }) => {
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
                                        {selected.content({ data })}

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