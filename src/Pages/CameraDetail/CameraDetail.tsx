import MarkdownContent from "@/Components/MarkdownContent"
import PageTitle from "@/Components/PageTitle"
import { makeUTCDate, parseWebCOOSAsset } from "@/services/assets/parsers"
import { fetchAPIAsset, fetchWebCOOSCameraSummary } from "@/services/assets/services"
import type { IWebCOOSAssetSummaryView, IWebCOOSParsedAsset, IWebCOOSParsedAssetService, IWebCOOSParsedGalleryService, IWebCOOSRawAssetServiceStream } from "@/services/assets/types"
import { useAPIContext } from "@/state/ApiContext"
import { SelectInput, Table, Tabs, ViewWithLoader } from "@axdspub/axiom-ui-utilities"
import { useQuery } from "@tanstack/react-query"
import { useState, type ReactElement } from "react"
import { Link, useNavigate } from "react-router"
import LatestImage from "@/Components/Media/LatestImage"
import VideoPlayer from "@/Components/Media/VideoPlayer"
import { useWebCOOSCameraSummary } from "@/services/assets/useWebCOOSCameraSummary"
import MapDataLoader from "@/Components/Map/Map"
import { useTimeSeriesAssetMedia } from "@/services/media/useTimeSeriesAssetMedia"



const MediaGalleries = ({
    detail
}: {
    detail: IWebCOOSParsedAsset
}): ReactElement | null => {
    const galleryServices = detail.galleryServices
    const [service, setService] = useState<IWebCOOSParsedGalleryService | null>(galleryServices.length > 0 ? galleryServices[0] : null)

    return (
        <div className='relative'>
            <div className='float-right z-24 flex flex-row items-center gap-4 text-xs sticky top-22 '>
                <p className='mt-2'>Gallery</p>
                <SelectInput
                    label=""
                    size="xs"
                    includePrompt={false}
                    id="camera-detail-view-select"
                    testId="camera-detail-view-select"
                    value={service?.uuid ?? ''}
                    onChange={(e): void => {
                        const selectedService = galleryServices.find(g => g.uuid === e?.value) ?? null
                        setService(selectedService)
                    }}

                    options={
                        detail.galleryServices.map(g => {
                            return {
                                value: g.uuid,
                                label: g.common.label
                            }
                        })
                    }

                />
            </div>

            <Tabs
                navClassName="sticky top-22 bg-white -mx-12 px-12 shadow-md z-20"
                tabs={[
                    {
                        id: 'media',
                        label: 'Media',
                        content: <div className='relative'><Gallery service={service} assetSlug={detail.slug} /></div>
                    },
                    {
                        id: 'inventory',
                        label: 'Inventory',
                        content: <>INVENTORY</>
                    }
                ]}
            />
        </div>
    )
}

const Gallery = ({
    service,
    assetSlug
}: {
    service: IWebCOOSParsedGalleryService | null,
    assetSlug: string
}): ReactElement | null => {
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

    return <ViewWithLoader isLoading={isLoading} isFetching={isFetching} error={error} data={data}>
        {
            data !== undefined && data !== null &&
            <div className='grid grid-cols-3 gap-2'>
                {data.map(element => {
                    const image = element.data.properties.thumbnails?.base?.rect_medium
                        ?? element.data.properties.thumbnails?.base?.lqip
                        ?? element.data.properties.thumbnails?.base?.rect_small
                    return <div key={element.uuid} className=''>
                        <p className='mb-2 font-bold'>Element starting: {makeUTCDate(element.data.extents.temporal.min).toLocaleString()}</p>
                        <img src={image} alt={`Element ${element.uuid} thumbnail`} className="shadow-md border border-gray-400 max-w-full h-auto" />
                    </div>
                })}
            </div>
        }
    </ViewWithLoader>

}




const CameraDetailView = ({
    detail,
    stillImageService,
    liveStream,
    isLive

}: {
    detail: IWebCOOSParsedAsset,
    summary: IWebCOOSAssetSummaryView,
    stillImageService: IWebCOOSParsedAssetService | null,
    liveStream: IWebCOOSRawAssetServiceStream | null,
    isLive: boolean

}): ReactElement => {

    const navigate = useNavigate();

    const mapHeight = isLive
        ? 250
        : 305

    return (
        <div className='p-10'>
            <PageTitle>{detail.label}</PageTitle>
            <h1 className='text-2xl font-bold sticky top-11 bg-white py-2 z-20'><Link to='/cameras' className='text-primary hover:underline'>Cameras</Link> | {detail.label}</h1>
            <div className='max-w-screen-2xl grid grid-cols-1 gap-1 p-2 lg:grid-cols-[2.5fr_4.5fr_2.5fr] md:gap-4 md:p-4 bg-primary-lighter'>
                {
                    detail.description &&
                    <MarkdownContent className="flex-grow text-sm">{detail.description}</MarkdownContent>

                }
                <div>
                    {
                        isLive
                            ? liveStream !== null && liveStream !== undefined
                                ? <div className='h-full w-full bg-pink-200'>
                                    VIDEO
                                    <VideoPlayer options={{ sources: [liveStream.url] }} />
                                </div>
                                : stillImageService && <LatestImage
                                    service={stillImageService}
                                    assetLabel={detail.label}
                                />
                            : <img src={detail.thumbnail} alt={detail.label} className="w-full h-auto" />

                    }
                </div>
                <div className={`hidden lg:flex flex-col gap-4 h-full`}>
                    <div style={{ height: `${mapHeight}px` }} className="flex flex-col gap-2 items-center relative">
                        <MapDataLoader
                            center={detail.longitude && detail.latitude ? { lon: detail.longitude, lat: detail.latitude } : undefined}
                            zoom={detail.longitude && detail.latitude ? 10 : 2}
                            LegendView={(): ReactElement => <></>}
                            onItemSelect={(item): void => {
                                navigate(`/cameras/${item?.asset_slug ?? ''}`)
                            }}
                            SelectView={(): ReactElement => <></>}
                            selectedItemSlug={detail.slug}
                            featureSort={(a, b) => {
                                const aIsSelected = a.asset_slug === detail.slug ? 1 : 0
                                const bIsSelected = b.asset_slug === detail.slug ? 1 : 0
                                return aIsSelected - bIsSelected
                            }}
                            styleWedgeFn={(item, defaultProps): Record<string, unknown> => {
                                return {
                                    ...defaultProps,
                                    ...(
                                        item.asset_slug === detail.slug
                                            ? {
                                                opacity: .6
                                            } : {
                                                opacity: .2,
                                                'stroke-width': 1
                                            }
                                    )
                                }
                            }}
                            stylePointFn={(item, defaultProps): Record<string, unknown> => {
                                return {
                                    ...defaultProps,
                                    ...(
                                        item.asset_slug === detail.slug
                                            ? {
                                                'point-radius': 12,
                                                'fill-opacity': 1,
                                                //opacity: .8

                                            } : {
                                                'point-radius': 4,
                                                opacity: 1

                                            }
                                    )
                                }
                            }}
                        />
                    </div>
                    {/* <StaticMap
                                        longitude={detail.longitude}
                                        latitude={detail.latitude}
                                        width={mapWidth}
                                        height={mapHeight}
                                        mapboxAccessToken={import.meta.env.VITE_PUBLIC_MAPBOX_TOKEN}
                                        wedgePolygon={detail.wedge ?? undefined}
                                        extraClasses="max-w-full shadow-md max-w-full"                          /> */}
                    {
                        isLive
                            ? <div><img src={detail.thumbnail} alt={detail.label} className="shadow-md" /></div>
                            : null
                    }



                </div>

            </div>


            <MediaGalleries detail={detail} />
            {detail.galleryServices.length > 0 && <Table
                data={detail.galleryServices}
                columns={Object.keys(detail.galleryServices[0]).map(c => {
                    return {
                        id: c,
                        label: c
                    }
                })}
            />
            }
        </div>
    )

}

export const CameraSummaryLoader = ({
    slug,
    View
}: {
    slug: string,
    View: React.FC<{
        summary: IWebCOOSAssetSummaryView
    }>
}): ReactElement => {
    const { data, isLoading, error } = useWebCOOSCameraSummary(slug)

    return <ViewWithLoader isLoading={isLoading} data={data} error={error}>
        {
            data !== undefined && (
                <View summary={data} />
            )
        }
    </ViewWithLoader>


}


const CameraDetail = ({
    slug,
    View = CameraDetailView
}: {
    slug: string
    View?: React.FC<{
        detail: IWebCOOSParsedAsset,
        summary: IWebCOOSAssetSummaryView,
        stillImageService: IWebCOOSParsedAssetService | null,
        liveStream: IWebCOOSRawAssetServiceStream | null,
        isLive: boolean
    }>
}): ReactElement => {
    const apiContext = useAPIContext()
    const { data, isLoading, error } = useQuery({
        queryKey: ['camera', slug],
        queryFn: async ({ signal }): Promise<{
            detail: IWebCOOSParsedAsset,
            summary: IWebCOOSAssetSummaryView
        } | undefined> => {
            const summary = await fetchWebCOOSCameraSummary({
                ...apiContext,
                signal,
                slug: slug ?? 'na'
            })
            const detail = await fetchAPIAsset({
                ...apiContext,
                slug: slug ?? 'na',
                signal
            })
            return summary !== undefined && detail !== undefined
                ? {
                    detail: parseWebCOOSAsset(detail),
                    summary
                }
                : undefined
        }
    })

    const { detail, summary } = data ?? {}
    const hasRecentData = detail?.dateBounds[1] !== null && detail?.dateBounds[1] !== undefined && (new Date(detail.dateBounds[1])).getTime() > (Date.now() - 1000 * 60 * 60 * 24 * 60)
    const liveStream = detail?.hls_stream ?? detail?.dash_stream
    const stillImageService = hasRecentData && detail.stillImageService ? detail.stillImageService : null
    const isLive = summary?.asset_disposition_slug === 'up'


    return (
        <>

            <ViewWithLoader isLoading={isLoading} data={data} error={error}>
                {
                    data !== undefined && (
                        <View detail={detail!} summary={summary!} stillImageService={stillImageService} liveStream={liveStream ?? null} isLive={isLive} />
                    )
                }
            </ViewWithLoader>
        </>
    )
}

export default CameraDetail