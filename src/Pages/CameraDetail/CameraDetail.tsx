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
import StreamingPlayerOld from "./StreamingPlayerOld"



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


    const stream = data?.hls_stream ?? data?.dash_stream
    return (
        <>
        
        <div className='p-10'>
        <ViewWithLoader isLoading={isLoading} data={data} error={error}>
            {
                data !== undefined && <>
                    <PageTitle>{data.label}</PageTitle>
                    <h1 className='text-2xl font-bold'><Link to='/cameras' className='text-primary hover:underline'>Cameras</Link> | {data.label}</h1>
                    <div className='flex flex-row p-10 bg-slate-200 my-10'>
                        {
                            data.description && 
                                <MarkdownContent className="flex-grow">{data.description}</MarkdownContent>
                                
                        }  
                        {
                            stream !== null && stream !== undefined && 
                            <div className='flex-none w-[650px] h-[365px] justify-end'>
                                <StreamingPlayerOld src={stream.url}  />
                            </div>
                        } 
                        
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