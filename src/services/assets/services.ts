import type { IWebCOOSRawAsset } from "@/services/assets/types";

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

