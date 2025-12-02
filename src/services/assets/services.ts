import type { IPostgrestParams, IWebCOOSApiRequestParams, IWebCOOSAssetElementView, IWebCOOSAssetSummaryView, IWebCOOSElement, IWebCOOSElementInventory, IWebCOOSRawAsset } from "@/services/assets/types";
import { assetNextElementEndpoint, assetPreviousElementEndpoint, assetTimeSeriesEndpoint, latestAssetMediaEndpoint, latestServiceMediaEndpoint, postgrestEndpoint } from "./endpoints";
import { makeUTCDate } from "@/services/assets/parsers";



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

export async function fetchAPIAsset({
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
    slug: string,
    signal?: AbortSignal
}): Promise<IWebCOOSRawAsset> {
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
    return r as IWebCOOSRawAsset;
}


export async function fetchAPIAssets({
    apiUrl,
    apiVersion = 'v1',
    source = 'webcoos',
    token,
    allow_cached = true,
    signal
}: {
    apiUrl?: string,
    apiVersion?: string,
    source?: string,
    token?: string,
    allow_cached?: boolean,
    signal?: AbortSignal
} = {}): Promise<IWebCOOSRawAsset[]> {
    if (!token) {
        throw new MissingTokenError("API Token not provided, pass to fetchAPIAssets or set env var NEXT_PUBLIC_WEBCOOS_API_TOKEN");
    }

    const parts = [
        apiUrl,
        apiVersion,
        'assets',
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


export async function fetchTimeseriesAssetMedia({
    apiUrl,
    apiVersion,
    token,
    signal,
    serviceIdentifier,
    start,
    end
}: {
    apiUrl: string,
    apiVersion: string,
    token: string,
    signal?: AbortSignal,
    serviceIdentifier: string,
    start: Date | string | number,
    end: Date | string | number
}): Promise<IWebCOOSElement[]> {

    const url = assetTimeSeriesEndpoint({
        apiUrl,
        apiVersion,
        serviceIdentifier,
        start,
        end
    })

    const response = await fetch(url.toString(), {
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
    return r.results as IWebCOOSElement[];
}


export async function fetchPreviousTimeseriesAssetMedia({
    apiUrl,
    apiVersion,
    token,
    signal,
    serviceIdentifier,
    before,
    count
}: {
    apiUrl: string,
    apiVersion: string,
    token: string,
    signal?: AbortSignal,
    serviceIdentifier: string,
    before: Date | string | number,
    count?: number
}): Promise<IWebCOOSElement[]> {

    const paddedBefore = new Date(makeUTCDate(before).getTime() - 1000).toISOString();
    const url = assetPreviousElementEndpoint({
        apiUrl,
        apiVersion,
        serviceIdentifier,
        count,
        before: paddedBefore
    })

    const response = await fetch(url.toString(), {
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
    return r.results as IWebCOOSElement[];
}

export async function fetchNextTimeseriesAssetMedia({
    apiUrl,
    apiVersion,
    token,
    signal,
    serviceIdentifier,
    after,
    count
}: {
    apiUrl: string,
    apiVersion: string,
    token: string,
    signal?: AbortSignal,
    serviceIdentifier: string,
    after: Date | string | number,
    count?: number
}): Promise<IWebCOOSElement[]> {

    const paddedAfter = new Date(makeUTCDate(after).getTime() + 1000).toISOString();

    const url = assetNextElementEndpoint({
        apiUrl,
        apiVersion,
        serviceIdentifier,
        count,
        after: paddedAfter
    })

    const response = await fetch(url.toString(), {
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
    return r.results as IWebCOOSElement[];
}


export async function fetchNearestTimeseriesAssetMedia({
    apiUrl,
    apiVersion,
    token,
    signal,
    serviceIdentifier,
    date
}: {
    apiUrl: string,
    apiVersion: string,
    token: string,
    signal?: AbortSignal,
    serviceIdentifier: string,
    date: Date | string | number
}): Promise<IWebCOOSElement> {

    const prev = await fetchPreviousTimeseriesAssetMedia({
        apiUrl,
        apiVersion,
        token,
        signal,
        serviceIdentifier,
        before: date,
        count: 1
    });
    const next = await fetchNextTimeseriesAssetMedia({
        apiUrl,
        apiVersion,
        token,
        signal,
        serviceIdentifier,
        after: date,
        count: 1
    });

    const dateOb = makeUTCDate(date);
    if (prev.length && prev[0].data.extents.temporal.min && next.length && next[0].data.extents.temporal.min) {
        const prevDate = makeUTCDate(prev[0].data.extents.temporal.min)
        const prevDiff = Math.abs(+prevDate - dateOb.getTime());
        const nextDate = makeUTCDate(next[0].data.extents.temporal.min)
        const nextDiff = Math.abs(+nextDate - dateOb.getTime());
        return prevDiff <= nextDiff ? prev[0] : next[0];
    } else if (prev.length) {
        return prev[0];
    } else if (next.length) {
        return next[0];
    } else {
        throw new Error('No media elements found for the given date');
    }
}

export async function fetchFirstAssetMedia({
    apiUrl,
    apiVersion,
    token,
    signal,
    serviceIdentifier,
}: {
    apiUrl: string,
    apiVersion: string,
    token: string,
    signal?: AbortSignal,
    serviceIdentifier: string

}): Promise<IWebCOOSElement> {

    const url = assetTimeSeriesEndpoint({
        apiUrl,
        apiVersion,
        serviceIdentifier,
        orderBy: 'starting',
        orderDir: 'asc',
        count: 1,
        page: 1
    })

    const response = await fetch(url.toString(), {
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
    return r.results[0] as IWebCOOSElement;

}




export async function fetchLatestAssetMedia({
    apiUrl,
    apiVersion,
    token,
    signal,
    assetIdentifier,
    type
}: IWebCOOSApiRequestParams & {
    assetIdentifier: string
    type?: 'image' | 'video'
}): Promise<IWebCOOSElement> {

    const url = latestAssetMediaEndpoint({
        apiUrl,
        apiVersion,
        assetIdentifier,
        type
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
    return r as IWebCOOSElement;

}

export async function fetchLatestServiceMedia({
    apiUrl,
    apiVersion,
    token,
    signal,
    serviceIdentifier
}: IWebCOOSApiRequestParams & {
    serviceIdentifier: string
}): Promise<IWebCOOSElement> {

    const url = latestServiceMediaEndpoint({
        apiUrl,
        apiVersion,
        serviceIdentifier
    });

    const response = await fetch(url, {
        headers: {
            Authorization: `Token ${token}`,
            Accept: 'application/json',
        },
        signal
    });
    if (!response.ok) {
        if (response.status === 404) {
            throw new ResponseNotOkError(`API response (${url}) not ok: ${response.toString()}`);
        }
    }
    const r = await response.json();
    return r as IWebCOOSElement;

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




export async function fetchWebCOOSElementInventoryFromPostgrest({
    apiUrl,
    apiVersion,
    source,
    token,
    signal,
    params,
    grouping = 'day'
}: IWebCOOSApiRequestParams & {
    params: Omit<IPostgrestParams<IWebCOOSElementInventory>, 'table'>,
    grouping?: 'day' | 'hour' | 'month' | 'week'
}): Promise<IWebCOOSElementInventory[]> {

    params.filters = params.filters ?? []
    if (!params.filters.find(f => f.column === 'bucket_grouping')) {
        params.filters.push({
            column: 'bucket_grouping',
            operator: 'eq',
            value: grouping
        })
    }


    const results = await fetchFromWebCOOSPostgrest<IWebCOOSElementInventory>({
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

    const results = await fetchFromWebCOOSPostgrest<IWebCOOSAssetElementView>({
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


    const results = await fetchFromWebCOOSPostgrest<IWebCOOSAssetSummaryView>({
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


type ISelectItem = { label: string, value: string, count?: number }
export type IWebCOOSCameraPageFiltered = {
    assets: IWebCOOSAssetSummaryView[],
    regions: Array<ISelectItem>,
    states: Array<ISelectItem>,
    products: Array<ISelectItem>,
    dispositions: Array<ISelectItem>,
    statuses: Array<ISelectItem>
}

export async function fetchWebCOOSSelectItems({
    apiUrl,
    apiVersion,
    source,
    token,
    signal,
    params,
    valueColumn,
    labelColumn
}: IWebCOOSApiRequestParams & {
    params: IPostgrestParams<ISelectItem>,
    valueColumn: string
    labelColumn?: string

}): Promise<ISelectItem[]> {

    const filters = params.filters?.filter(f => f.column !== valueColumn && f.column !== labelColumn) ?? [];
    filters.push({
        column: valueColumn,
        operator: 'is',
        value: 'not_null'
    })

    const results = await fetchFromWebCOOSPostgrest<ISelectItem>({
        apiUrl,
        apiVersion,
        source,
        token,
        signal,
        params: {
            ...params,
            filters,
            select: [
                { column: valueColumn, fn: 'count', as: 'count' },
                { column: labelColumn ?? valueColumn, as: 'label' },
                { column: valueColumn, as: 'value' }
            ],
            table: params.table,
            order: [{ column: labelColumn ?? valueColumn, dir: 'asc' }]
        }
    });
    return results


}

export async function fetchWebCOOSCameraSummary<T = IWebCOOSAssetSummaryView>({
    apiUrl,
    apiVersion,
    source,
    token,
    signal,
    params,
    slug
}: IWebCOOSApiRequestParams & {
    params?: Omit<IPostgrestParams<T>, 'table'>,
    slug: string
}): Promise<T> {

    const result = await fetchFromWebCOOSPostgrest<T>({
        apiUrl,
        apiVersion,
        source,
        token,
        signal,
        params: {
            ...params,
            table: 'asset_summary_vw',
            filters: (params?.filters ?? []).concat({
                column: 'asset_slug',
                operator: 'eq',
                value: slug
            })
        }

    });
    return result[0]


}

export async function fetchWebCOOSCameraPageFiltered({
    apiUrl,
    apiVersion,
    source,
    token,
    signal,
    params
}: IWebCOOSApiRequestParams & {
    params?: Omit<IPostgrestParams<IWebCOOSAssetSummaryView>, 'table'>
}): Promise<IWebCOOSCameraPageFiltered> {

    const out: IWebCOOSCameraPageFiltered = {
        assets: [],
        regions: [],
        states: [],
        products: [],
        dispositions: [],
        statuses: []
    }

    const props = {
        apiUrl,
        apiVersion,
        source,
        token,
        signal
    }

    params = params ?? {};
    params.select = params.select ?? [
        'asset_label',
        'asset_region',
        'asset_location',
        'asset_state_or_territory',
        'asset_slug',
        'asset_service_slugs',
        'asset_disposition_slug',
        'asset_disposition_label',
        'asset_operational_status_slug',
        'asset_operational_status_label',
        'asset_first_starting',
        'asset_last_ending',
        {
            column: 'asset_data->properties->wedge',
            as: 'asset_wedge'
        },
        {
            column: 'asset_data->properties->thumbnails->base',
            as: 'asset_thumbnails'
        }
    ]

    await Promise.all([
        (async () => {
            const results = await fetchFromWebCOOSPostgrest<IWebCOOSAssetSummaryView>({
                ...props,
                params: {
                    ...params,
                    table: 'asset_summary_vw'
                }
            });
            out.assets = results;
        })(),
        (async () => {
            const results = await fetchWebCOOSSelectItems({
                ...props,
                valueColumn: 'asset_region',
                params: {
                    ...params,
                    order: [{ column: 'asset_region', dir: 'asc' }],
                    table: 'asset_summary_vw'
                }
            });
            out.regions = results;
        })(),
        (async () => {
            const results = await fetchWebCOOSSelectItems({
                ...props,
                valueColumn: 'asset_state_or_territory',
                params: {
                    ...params,
                    order: [{ column: 'asset_state_or_territory', dir: 'asc' }],
                    table: 'asset_summary_vw'
                }
            });
            out.states = results;
        })(),
        (async () => {
            const results = await fetchWebCOOSSelectItems({
                ...props,
                valueColumn: 'asset_disposition_slug',
                params: {
                    ...params,
                    order: [{ column: 'asset_disposition_label', dir: 'asc' }],
                    table: 'asset_summary_vw'
                }
            });
            out.dispositions = results;
        })(),
        (async () => {
            const results = await fetchWebCOOSSelectItems({
                ...props,
                valueColumn: 'asset_operational_status_slug',
                params: {
                    ...params,
                    order: [{ column: 'asset_operational_status_label', dir: 'asc' }],
                    table: 'asset_summary_vw'
                }
            });
            out.statuses = results;
        })(),
        (async () => {
            const results = await fetchFromWebCOOSPostgrest<{
                asset_service_slugs: string[]
            }>({
                apiUrl,
                apiVersion,
                source,
                token,
                signal,
                params: {
                    ...params,
                    select: [
                        { column: 'asset_service_slugs' },
                        { column: 'asset_service_slugs', as: 'label' },
                        { column: 'asset_service_slugs', as: 'value' }
                    ],
                    table: 'asset_summary_vw'
                }
            });
            const products = results
                .map(r => r.asset_service_slugs)
                .flat()
                .map(slug => {
                    if (slug.includes('rip') || slug.includes('current')) return 'rips';
                    if (slug.includes('shoreline') || slug.includes('shore')) return 'shoreline';
                    if (slug.includes('beach') || slug.includes('usage') || slug.includes('object')) return 'beach';
                    if (slug.includes('flood') || slug.includes('water')) return 'flood';
                    return null;
                })
                .filter(d => d !== null)

            const uniqueProducts = Object.keys(Object.fromEntries(products.map(p => [p, p]))).map(p => p!);
            out.products = uniqueProducts.map(p => ({ label: p, value: p }))
        })()
    ])


    return out



}