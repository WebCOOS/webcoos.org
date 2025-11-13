import CameraDetail from "@/Pages/CameraDetail/CameraDetail"
import { utils } from "@axdspub/axiom-ui-utilities"
import type { ReactElement } from "react"
import { Link } from "react-router"
import LatestImage from "@/Components/Media/LatestImage"

const CameraCard = ({
    slug
}: { slug: string }) => {

    return <CameraDetail 
        slug={slug} 
        View={({
            detail,
            summary,
            stillImageService,
            liveStream,
            isLive
        }): ReactElement => {
        return (<>
            <div className='flex flex-col gap-4'>
                <div className='h-[225px]'>
                {
                    isLive && stillImageService !== null
                    ? <LatestImage 
                                service={stillImageService}
                                assetLabel={detail.label}
                                />
                    : <img src={detail.thumbnail} alt={detail.label} className="w-full h-auto" />
                }
                </div>
                <div className='p-4 flex flex-col gap-4'>
                <h2 className='text-xl font-bold'>{detail.label}</h2>
                <div>
                <Link to={`/cameras/${summary.asset_slug}`} className={
                    utils.createButtonClass({
                            size: 'md',
                            className:'bg-primary hover:bg-primary-dark text-white inline-block'
                        })
                    
                }>
                    View Full Details Page
                </Link>
                </div>
                </div>
            </div>

           </>
        )}} />

}




export default CameraCard