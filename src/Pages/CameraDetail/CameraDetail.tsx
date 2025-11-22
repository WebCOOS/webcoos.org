import MarkdownContent from "@/Components/MarkdownContent"
import PageTitle from "@/Components/PageTitle"
import { parseWebCOOSAsset } from "@/services/assets/parsers"
import {  fetchAPIAsset, fetchWebCOOSCameraSummary } from "@/services/assets/services"
import type { IWebCOOSAssetSummaryView, IWebCOOSParsedAsset, IWebCOOSParsedAssetService, IWebCOOSRawAssetServiceStream } from "@/services/assets/types"
import { useAPIContext } from "@/state/ApiContext"
import { Table, Tabs, ViewWithLoader } from "@axdspub/axiom-ui-utilities"
import { useQuery } from "@tanstack/react-query"
import type { ReactElement } from "react"
import { Link, useNavigate } from "react-router"
import LatestImage from "@/Components/Media/LatestImage"
import VideoPlayer from "@/Components/Media/VideoPlayer"
import { useWebCOOSCameraSummary } from "@/services/assets/useWebCOOSCameraSummary"
import MapDataLoader from "@/Components/Map/Map"



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
                    <h1 className='text-2xl font-bold sticky top-10 bg-white py-2'><Link to='/cameras' className='text-primary hover:underline'>Cameras</Link> | {detail.label}</h1>
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
                                SelectView = {(): ReactElement => <></>}
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
                                                'point-radius':12,
                                                'fill-opacity': .4,
                                                opacity: .8

                                            } : {
                                                'point-radius': 3,
                                                opacity: .4

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
                                ?  <div><img src={detail.thumbnail} alt={detail.label} className="shadow-md" /></div>
                                : null
                        }
                           


                        </div>
                        
                    </div>  

                    <Tabs
                        tabs={[
                            {
                                id:'media',
                                label: 'Media',
                                content: <>IMAGES n VIDEOS</>
                            },
                            {
                                id: 'inventory',
                                label: 'Inventory',
                                content: <>INVENTORY</>
                            }
                        ]}
                    />
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

export const CameraSummaryLoader =  ({
    slug,
    View
}: {
    slug: string,
    View: React.FC<{
        summary: IWebCOOSAssetSummaryView
    }>
}):ReactElement =>{
    const { data, isLoading, error } = useWebCOOSCameraSummary(slug)

    return <ViewWithLoader isLoading={isLoading} data={data} error={error}>
        {
            data !== undefined && (
                <View summary={data} />
            )
        }
        </ViewWithLoader>


}


const CameraDetail =  ({
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
}):ReactElement =>{
    const apiContext =  useAPIContext()
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