import { useTimeSeriesAssetMedia } from "@/services/media/useTimeSeriesAssetMedia"
import { useAPIContext } from "@/state/ApiContext"
import { ViewWithLoader } from "@axdspub/axiom-ui-utilities"
import type { ReactElement } from "react"

const TimeSeriesLoader = ({
    serviceIdentifier,
    start,
    end
} : {
    serviceIdentifier: string,
    start?: string,
    end?: string
}): ReactElement => {
    const apiContext = useAPIContext()
    const { data, isLoading, error } = useTimeSeriesAssetMedia({
        ...apiContext,
        serviceIdentifier,
        start: start !== undefined ? new Date(start) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: end !== undefined ? new Date(end) : new Date()
    })
    return <ViewWithLoader isLoading={isLoading} data={data} error={error}>
        {
            data !== undefined && (
                <div>
                    {/* Render your time series data here */}
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )
        }
    </ViewWithLoader>
}

export default TimeSeriesLoader