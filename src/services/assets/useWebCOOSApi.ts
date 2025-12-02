
/* export const useWebCOOSServiceInventory = ({ grouping, ...props }: IWebCOOSApiRequestParams & {
    params?: Omit<IPostgrestParams<IWebCOOSElementInventory>, 'table'>
    grouping: 'day' | 'hour' | 'month' | 'week'
}): UseQueryResult<IWebCOOSElementInventory[]> => {

    const queryResult = useQuery({
        queryKey: [JSON.stringify(props)],
        queryFn: async ({ signal }): Promise<IWebCOOSElementInventory[]> => {
            const inventory = await fetchWebCOOSServiceInventoryFromAPI({
                ...props,
                signal,
            })
            return inventory

        }

    })
    return queryResult
}
 */
