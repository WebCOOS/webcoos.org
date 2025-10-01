import type { ComponentType, ReactElement } from "react";
import { useYAML } from "@/services/yaml/hooks/useYAML";
import { ViewWithLoader } from "@axdspub/axiom-ui-utilities";

function YAML<T>(
    {
        yamlFile,
        Component

    }: {
        yamlFile: string,
        Component: ComponentType<T>
    }
): ReactElement {

    const { data, isLoading, error } = useYAML<T>({ yamlFile })

    return (
        <ViewWithLoader isLoading={isLoading} error={error} data={data}>
            {data && <Component {...data} />}
        </ViewWithLoader>
    )

     
}

export default YAML