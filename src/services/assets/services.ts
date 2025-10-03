import type { IPostgrestParams, IWebCOOSApiRequestParams, IWebCOOSElementInventory, IWebCOOSRawAsset } from "@/services/assets/types";



export class ResponseNotOkError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ResponseNotOkError';
    }
}

export class MissingTokenError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'MissingTokenError';
    }
}


export async function fetchAPIAssets({
    apiUrl,
    apiVersion = 'v1',
    source = 'webcoos',
    token,
    allow_cached = true,
    slug,
    signal
}: {
    apiUrl?: string,
    apiVersion?: string,
    source?: string,
    token?: string,
    allow_cached?: boolean,
    slug?: string,
    signal?: AbortSignal
} = {}): Promise<IWebCOOSRawAsset[]> {
    if (!token) {
        throw new MissingTokenError("API Token not provided, pass to fetchAPIAssets or set env var NEXT_PUBLIC_WEBCOOS_API_TOKEN");
    }

    const parts = [
        apiUrl,
        apiVersion,
        'assets',
        ...(slug ? [slug] : []),
        `?source=${source}${(allow_cached ? '' : '&_nocache=true')}`
    ],
        url = parts.join('/');

     const cameraMetadataResponse = await fetch(url, {
         headers: {
             Authorization: `Token ${token}`,
             Accept: 'application/json',
         },
         signal
     });

     if (!cameraMetadataResponse.ok) {
        throw new ResponseNotOkError(`API response (${url}) not ok: ${cameraMetadataResponse.toString()}`);
     }

     const r = await cameraMetadataResponse.json();
    return r.results as IWebCOOSRawAsset[];
}


export async function fetchFromWebCOOSPostgrest<T>(
    {
        apiUrl,
        apiVersion = 'v1',
        source = 'webcoos',
        token,
        signal,
        params
    }: IWebCOOSApiRequestParams & {
        params: IPostgrestParams<T>
    }
): Promise<T[]> {
    if (!token) {
        throw new MissingTokenError("API Token not provided, pass to fetchFromWebCOOSPostgrest or set env var NEXT_PUBLIC_WEBCOOS_API_TOKEN");
    }

    const url = new URL(`${apiUrl}/${apiVersion}/${source}/postgrest/${params.table}`);
    (params.filters ?? []).forEach(f => url.searchParams.append(String(f.column), `eq.${f.value}`));
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
        const select = params.select.map(s => `${String(s.fn ? `${s.fn}(${String(s.column)})` : s.column)}${s.as ? `:${s.as}` : ''}`).join(',');
        url.searchParams.append('select', select);
    }

    const response = await fetch(url, {
        headers: {
            Authorization: `Token ${token}`,
            Accept: 'application/json',
        },
        signal
    });

    if (!response.ok) {
        throw new ResponseNotOkError(`API response (${url}) not ok: ${response.toString()}`);
    }

    const r = await response.json();
    return r.results as T[];
}




export async function fetchWebCOOSElementInventory({
    apiUrl,
    apiVersion,
    source,
    token,
    signal,
    params
}: IWebCOOSApiRequestParams & {
    params: IPostgrestParams<IWebCOOSElementInventory>
}): Promise<IWebCOOSElementInventory[]> {

    const results =  await fetchFromWebCOOSPostgrest<IWebCOOSElementInventory>({
        apiUrl,
        apiVersion,
        source,
        token,
        signal,
        params
    });
    return results
}
