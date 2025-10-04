import type { IPostgrestParams, IWebCOOSApiRequestParams, IWebCOOSAssetElementView, IWebCOOSAssetSummaryView, IWebCOOSElementInventory, IWebCOOSRawAsset } from "@/services/assets/types";
import { postgrestEndpoint } from "./endpoints";



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
        apiVersion,
        source,
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
    const url = postgrestEndpoint<T>({
        apiUrl,
        apiVersion,
        source,
        params
    });


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
    return r as T[];
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
        params: {
            ...params,
            table: 'webcoos_elementinventory'
        }
    });
    return results
}

export async function fetchWebCOOSAssetElementView({
    apiUrl,
    apiVersion,
    source,
    token,
    signal,
    params
}: IWebCOOSApiRequestParams & {
    params: IPostgrestParams<IWebCOOSAssetElementView>
}): Promise<IWebCOOSAssetElementView[]> {

    const results =  await fetchFromWebCOOSPostgrest<IWebCOOSAssetElementView>({
        apiUrl,
        apiVersion,
        source,
        token,
        signal,
        params: {
            ...params,
            table: 'asset_element_vw'
        }
    });
    return results.map(r => ({
        ...r,
        product_uuid: r.product_uuid ?? r.produt_uuid
    }))
}


export async function fetchWebCOOSAssetSummaryView({
    apiUrl,
    apiVersion,
    source,
    token,
    signal,
    params
}: IWebCOOSApiRequestParams & {
    params: Omit<IPostgrestParams<IWebCOOSAssetSummaryView>, 'table'>
}): Promise<IWebCOOSAssetSummaryView[]> {


    const results =  await fetchFromWebCOOSPostgrest<IWebCOOSAssetSummaryView>({
        apiUrl,
        apiVersion,
        source,
        token,
        signal,
        params: {
            ...params,
            table: 'asset_summary_vw'
        }
    });
    return results
}