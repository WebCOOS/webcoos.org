import MarkdownContent from "@/Components/MarkdownContent"
import PageTitle from "@/Components/PageTitle"
import { parseWebCOOSAsset } from "@/services/assets/parsers"
import {  fetchAPIAsset } from "@/services/assets/services"
import type { IWebCOOSParsedAsset } from "@/services/assets/types"
import { useAPIContext } from "@/state/ApiContext"
import { Table, ViewWithLoader } from "@axdspub/axiom-ui-utilities"
import { useQuery } from "@tanstack/react-query"
import type { ReactElement } from "react"
import { Link, useParams } from "react-router"
import LatestImage from "@/Components/Media/LatestImage"
import VideoPlayer from "@/Components/Media/VideoPlayer"



const CameraDetail =  ():ReactElement =>{
    const apiContext =  useAPIContext()
    const { slug } = useParams()
    const { data, isLoading, error } = useQuery({
        queryKey: ['camera', slug],
        queryFn: async ({ signal }): Promise<IWebCOOSParsedAsset | undefined> => {
            /* const assetUuid = await fetchWebCOOSCameraDetail({
                ...apiContext,
                signal,
                slug: slug ?? 'na',
                params: {
                    select: [
                        {column: 'asset_uuid'}
                    ]
                }
            }) */
            const asset = await fetchAPIAsset({
                ...apiContext,
                slug: slug ?? 'na',
                signal
            })
            return asset !== undefined
                ? parseWebCOOSAsset(asset) : undefined
        }
    })

    /* const services = data !== undefined 
        ? data.asset_service_labels.map((label, i) => {
            const type = data.asset_service_types[i]
            const slug = data.asset_service_slugs[i]
            const uuid = data.asset_service_uuids[i]
            const galleryService = serviceToGalleryService({
                label,
                uuid,
                slug,
                type
            })
            return {
                ...{
                    label,
                    uuid,
                    slug,
                    type,
                    svcType: 'na',
                    sortOrder: 10000
                },
                ...galleryService
            }
        }).sort((a,b)=>a.sortOrder - b.sortOrder): [] */


    // has data within last 6 hours
    // const hasLiveData = data?.dateBounds[1] !== null && data?.dateBounds[1] !== undefined && (new Date(data.dateBounds[1])).getTime() > (Date.now() - 1000 * 60 * 60 * 6)
    // has data within last 24 hours
    const hasRecentData = data?.dateBounds[1] !== null && data?.dateBounds[1] !== undefined && (new Date(data.dateBounds[1])).getTime() > (Date.now() - 1000 * 60 * 60 * 24 * 60)

    const liveStream = data?.hls_stream ?? data?.dash_stream
    const stillImageService = hasRecentData && data.stillImageService ? data.stillImageService : null
    const wedgeFeature = data?.wedge
        ? JSON.stringify({"type": "Feature","properties": {},"geometry": data.wedge})
        : null

    return (
        <>
        
        <div className='p-10'>
        <ViewWithLoader isLoading={isLoading} data={data} error={error}>
            {
                data !== undefined && <>
                    <PageTitle>{data.label}</PageTitle>
                    <h1 className='text-2xl font-bold'><Link to='/cameras' className='text-primary hover:underline'>Cameras</Link> | {data.label}</h1>
                    <div className='flex flex-row p-10 bg-slate-200 my-10 gap-10'>
                        {
                            data.description && 
                                <MarkdownContent className="flex-grow text-sm">{data.description}</MarkdownContent>
                                
                        }
                        <div className='flex-none w-[650px] h-[365px] justify-end bg-white'>
                        {
                            liveStream !== null && liveStream !== undefined 
                            ? <VideoPlayer options={{ sources: [liveStream.url] }} />
                            : stillImageService && <LatestImage 
                                service={stillImageService}
                                assetLabel={data.label}
                                />
                            
                        }
                        </div>
                        <div className='flex-none w-[380px] h-full p-5 bg-slate-600'>
                            <img src={`https://api.mapbox.com/styles/v1/mapbox/light-v10/static/geojson({"type":"Feature","properties":{},"geometry":(${JSON.stringify(wedgeFeature)})/${data.latitude},${data.longitude},10,0,0/374x210?access_token=${import.meta.env.VITE_PUBLIC_MAPBOX_TOKEN}`} />


                        </div>
                        
                    </div>  
                    {data.galleryServices.length > 0 && <Table
                            data={data.galleryServices}
                            columns={Object.keys(data.galleryServices[0]).map(c => {
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