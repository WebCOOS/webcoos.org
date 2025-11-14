import type { IWebCOOSParsedAssetService } from "@/services/assets/types";
import { useLatestServiceMedia } from "@/services/media/useLatestServiceMedia";
import { useAPIContext } from "@/state/ApiContext";
import { utils, ViewWithLoader } from "@axdspub/axiom-ui-utilities";

const LatestImage = ({
    service, 
    assetLabel,
    className,
    defaultClassName = 'relative w-full h-full',
    imageClassName,
    defaultImageClassName = 'object-contain w-full h-full'
}: {
    service: IWebCOOSParsedAssetService; 
    assetLabel?: string,
    className?: string,
    defaultClassName?: string,
    imageClassName?: string,
    defaultImageClassName?: string
}) => {
    const apiContext =  useAPIContext()
    const { data, isLoading, error } = useLatestServiceMedia({
        ...apiContext,
        serviceIdentifier: service.uuid
    });

    return <ViewWithLoader isLoading={isLoading} error={error} data={data}>
        {data !== null && data !== undefined ? (
            <div className={
                utils.makeClassName({
                    className,
                    defaultClassName
                })
            }>
                <img 
                    alt={assetLabel ? `Latest image for ${assetLabel}` : 'Latest Image'}
                    className={utils.makeClassName({
                        className: imageClassName,
                        defaultClassName: defaultImageClassName
                    })}
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