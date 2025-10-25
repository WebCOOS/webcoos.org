import type { IWebCOOSParsedAssetService } from "@/services/assets/types";
import { useLatestServiceMedia } from "@/services/media/useLatestServiceMedia";
import { useAPIContext } from "@/state/ApiContext";
import { ViewWithLoader } from "@axdspub/axiom-ui-utilities";

const LatestImage = ({service, assetLabel}: {service: IWebCOOSParsedAssetService; assetLabel?: string}) => {
    const apiContext =  useAPIContext()
    const { data, isLoading, error } = useLatestServiceMedia({
        ...apiContext,
        serviceIdentifier: service.uuid
    });

    return <ViewWithLoader isLoading={isLoading} error={error} data={data}>
        {data !== null && data !== undefined ? (
            <div className='relative w-full h-full'>
                <img 
                    alt={assetLabel ? `Latest image for ${assetLabel}` : 'Latest Image'}
                    className='object-contain w-full h-full'
                    src={data.data.properties.url}
                />
                <p className='absolute bottom-0 right-0 bg-slate-500/50 p-2 text-white'>
                    {data.data.extents.temporal.min}

                </p>
            </div>
        ) : null}
    </ViewWithLoader>


    
}

export default LatestImage