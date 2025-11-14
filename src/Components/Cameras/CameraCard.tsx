import CameraDetail from "@/Pages/CameraDetail/CameraDetail"
import { utils } from "@axdspub/axiom-ui-utilities"
import type { ReactElement } from "react"
import { Link } from "react-router"
import LatestImage from "@/Components/Media/LatestImage"
import MarkdownContent from "../MarkdownContent"

const CameraCard = ({
    slug,
    showDescription = false,
    showLabel = true,
    showImage = true
}: { 
    slug: string,
    showDescription?: boolean,
    showLabel?: boolean,
    showImage?: boolean
}) => {

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
                {
                    showImage &&
                
                    <div className='h-[225px]'>
                        {
                            isLive && stillImageService !== null
                            ? <LatestImage 
                                        service={stillImageService}
                                        assetLabel={detail.label}
                                        imageClassName="object-cover"
                                        />
                            : <img src={detail.thumbnail} alt={detail.label} className="w-full h-auto" />
                        }
                    </div>
                }
                <div className='p-4 flex flex-col gap-4'>
                    {showLabel && <h2 className='text-xl font-bold'>{detail.label}</h2>}
                    {showDescription && detail.description && <p className='text-sm'><MarkdownContent>{detail.description}</MarkdownContent></p>}
                <div>
                <Link to={`/cameras/${summary.asset_slug}`} className={
                    utils.createButtonClass({
                            size: 'med',
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