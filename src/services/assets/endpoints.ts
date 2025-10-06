import type { IPostgrestParams, IWebCOOSApiRequestParams } from "./types";

export const postgrestEndpoint = <T, >({
    apiUrl = import.meta.env.VITE_WEBCOOS_API_URL || 'https://api.webcoos.org',
    apiVersion = 'v1',
    source = 'webcoos',
    params
}: Omit<IWebCOOSApiRequestParams, 'token' | 'signal'> & {
    params: IPostgrestParams<T>
}): string => {
    const url = new URL(`${apiUrl}/${apiVersion}/${source}/postgrest/${params.table}`);
    (params.filters ?? []).forEach(f => url.searchParams.append(String(f.column), `${f.operator ?? 'eq'}.${f.value}`));
    if (params.limit !== undefined) {
        url.searchParams.append('limit', params.limit.toString());
    }
    if (params.offset !== undefined) {
        url.searchParams.append('offset', params.offset.toString());
    }
    if (params.order !== undefined) {
        url.searchParams.append('order', `${String(params.order.column)}.${params.order.dir ?? 'asc'}`);
    }
    if (params.select !== undefined) {
        const select = params.select.map(s => `${s.as ? `${s.as}:` : ''}${String(s.column)}${s.fn !== undefined ? `.${s.fn}()` : ''}`).join(',');
        url.searchParams.append('select', select);
    }
    return url.toString();
}