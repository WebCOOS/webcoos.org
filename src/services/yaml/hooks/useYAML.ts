import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { parse } from "yaml"


export type YAMLParams = {
    yamlFile: string,
    signal?: AbortSignal
}

export const useYAML = <T>(params: YAMLParams): UseQueryResult<T> => {
    const queryResult = useQuery({
        queryKey: [JSON.stringify(params)],
        queryFn: async ({ signal }): Promise<T> => {
            const yaml = await(await fetch(params.yamlFile, { signal })).text()
            const json = parse(yaml) as T
            return json
        }
    })

    return queryResult
}
