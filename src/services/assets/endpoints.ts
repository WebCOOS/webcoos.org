import type { IPostgrestParams, IWebCOOSApiRequestParams } from "./types";

export const postgrestEndpoint = <T, >({
    apiUrl = import.meta.env.VITE_WEBCOOS_API_URL,
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
        const select = params.select.map(s => {
            const o = typeof s === 'string' ? { column: s } : s;
            return `${o.as ? `${o.as}:` : ''}${String(o.column)}${o.fn !== undefined ? `.${o.fn}()` : ''}`
        }).join(',');
        url.searchParams.append('select', select);
    }
    return url.toString();
}

export const latestAssetMediaEndpoint = ({
    apiUrl = import.meta.env.VITE_WEBCOOS_API_URL,
    apiVersion = 'v1',
    assetIdentifier,
    type
}: Omit<IWebCOOSApiRequestParams, 'token' | 'signal'> & {
    assetIdentifier: string
    type?: 'image' | 'video'
}): string => {
    const url = new URL(`${apiUrl}/${apiVersion}/assets/${assetIdentifier}/elements/latest/${type ?? 'image'}`);
    return url.toString();
}

export const latestServiceMediaEndpoint = ({
    apiUrl = import.meta.env.VITE_WEBCOOS_API_URL,
    apiVersion = 'v1',
    serviceIdentifier
}: Omit<IWebCOOSApiRequestParams, 'token' | 'signal'> & {
    serviceIdentifier: string
}): string => {
    const url = new URL(`${apiUrl}/${apiVersion}/services/${serviceIdentifier}/elements/latest`);
    return url.toString();
}



export const latestMediaRedirectEndpoint = ({
    apiUrl = import.meta.env.VITE_WEBCOOS_API_URL,
    apiVersion = 'v1',
    assetIdentifier
}: Omit<IWebCOOSApiRequestParams, 'token' | 'signal'> & {
    assetIdentifier: string
}): string => {
    const url = new URL(`${apiUrl}/${apiVersion}/elements/${assetIdentifier}/redirect`);
    return url.toString();
}