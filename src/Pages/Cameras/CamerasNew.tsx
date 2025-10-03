import { useWebCOOSViewAssets } from "@/services/assets/useWebCOOSViewAssets"
import ApiContext from "@/state/ApiContext"
import { ViewWithLoader } from "@axdspub/axiom-ui-utilities"
import { useContext, type ReactElement } from "react"

const CamerasNew = (): ReactElement => {

const apiContext = useContext(ApiContext)
    const { data, isLoading, error } = useWebCOOSViewAssets({
        token: apiContext.token,
        apiUrl: apiContext.apiUrl,
        params: {
            table: 'webcoos_elementinventory',
            limit: 10
        }
    })


    return (
        <ViewWithLoader isLoading={isLoading} error={error} data={data} >
            {data && (
                <div>
                    <h1>Cameras New</h1>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </ViewWithLoader>
    )
}

export default CamerasNew