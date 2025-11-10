import MarkdownContent from "@/Components/MarkdownContent"
import PageTitle from "@/Components/PageTitle"
import { parseWebCOOSAsset } from "@/services/assets/parsers"
import {  fetchAPIAsset, fetchWebCOOSCameraDetail } from "@/services/assets/services"
import type { IWebCOOSAssetSummaryView, IWebCOOSParsedAsset } from "@/services/assets/types"
import { useAPIContext } from "@/state/ApiContext"
import { Table, Tabs, ViewWithLoader } from "@axdspub/axiom-ui-utilities"
import { useQuery } from "@tanstack/react-query"
import type { ReactElement } from "react"
import { Link, useParams } from "react-router"
import LatestImage from "@/Components/Media/LatestImage"
import VideoPlayer from "@/Components/Media/VideoPlayer"
import StaticMap from "@/Components/Map/StaticMap"



const CameraDetail =  ():ReactElement =>{
    const apiContext =  useAPIContext()
    const { slug } = useParams()
    const { data, isLoading, error } = useQuery({
        queryKey: ['camera', slug],
        queryFn: async ({ signal }): Promise<{
            detail: IWebCOOSParsedAsset,
            summary: IWebCOOSAssetSummaryView
         } | undefined> => {
            const summary = await fetchWebCOOSCameraDetail({
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
    const mapWidth = 374
    const mapHeight = isLive
        ? 210
        : 337
    

    return (
        <>
        
        <div className='p-10'>
        <ViewWithLoader isLoading={isLoading} data={data} error={error}>
            {
                data !== undefined && <>
                    <PageTitle>{data.detail.label}</PageTitle>
                    <h1 className='text-2xl font-bold sticky top-10 bg-white py-2'><Link to='/cameras' className='text-primary hover:underline'>Cameras</Link> | {data.detail.label}</h1>
                    <div className='flex flex-row p-4 bg-primary-lighter my-10 gap-1 md:gap-4'>
                        {
                            data.detail.description && 
                                <MarkdownContent className="flex-grow text-sm">{data.detail.description}</MarkdownContent>
                                
                        }
                        <div className='flex-none w-[650px] justify-end'>
                        {
                            isLive 
                            ? liveStream !== null && liveStream !== undefined 
                            ? <>
                                VIDEO
                                <VideoPlayer options={{ sources: [liveStream.url] }} />
                            </>
                            : stillImageService && <LatestImage 
                                service={stillImageService}
                                assetLabel={data.detail.label}
                                />
                                : <img src={data.detail.thumbnail} alt={data.detail.label} className="w-full h-auto" />
                            
                        }
                        </div>
                        <div className='flex-none flex w-[374px] flex-col gap-2'>
                            <StaticMap
                                        longitude={data.detail.longitude}
                                        latitude={data.detail.latitude}
                                        width={mapWidth}
                                        height={mapHeight}
                                        zoom={10}
                                        style="mapbox/light-v10"
                                        mapboxAccessToken={import.meta.env.VITE_PUBLIC_MAPBOX_TOKEN}
                                        wedgePolygon={data.detail.wedge ?? undefined}
                                        extraClasses="max-w-full shadow-md"                          />
                        {
                            isLive
                                ?  <img src={data.detail.thumbnail} alt={data.detail.label} className="w-full h-auto shadow-md" />
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
                    {data.detail.galleryServices.length > 0 && <Table
                            data={data.detail.galleryServices}
                            columns={Object.keys(data.detail.galleryServices[0]).map(c => {
                                return {
                                    id: c,
                                    label: c
                                }
                            })}
                            />
                        } 
                </>
            }
            </ViewWithLoader>
        </div>
        </>
    )
}

export default CameraDetail