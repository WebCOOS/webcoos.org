import type { IWebCOOSParsedAsset, IWebCOOSParsedAssetService, IWebCOOSRawAsset, IWebCOOSRawAssetServiceStream } from "@/services/assets/types";
import { differenceInDays } from "date-fns";
import * as duration from 'duration-fns';

const state_abbrevs = [
    'AL',
    'AK',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'FL',
    'GA',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'OH',
    'OK',
    'OR',
    'PA',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
];

function getStateFromCameraLabel(label?: string): string | null {
    if (!label) {
        return null;
    }

    for (const state of state_abbrevs) {
        if (label.includes(`, ${state}`)) {
            return state;
        }
    }
    return null;
}

function findStream(streams: IWebCOOSRawAssetServiceStream[], stream_protocol: string, match_preference_url_regex?: RegExp | string): IWebCOOSRawAssetServiceStream | undefined {

    if (!streams) {
        return undefined;
    }

    if (!stream_protocol) {
        console.warn(
            "Need to provide stream_protocol in order to find stream (findStream)"
        );
        return undefined;
    }

    if (typeof match_preference_url_regex === 'undefined') {
        match_preference_url_regex = RegExp(".");
    }

    if (typeof match_preference_url_regex === 'string') {
        match_preference_url_regex = RegExp(match_preference_url_regex);
    }

    if (typeof match_preference_url_regex.exec !== 'function') {
        console.warn(
            `Passed match_preference_url_regex value is not of type RegExp: ${typeof match_preference_url_regex}`
        );
        return undefined;
    }

    let found = streams.find(
        (stream) => (
            stream.protocol === stream_protocol &&
            match_preference_url_regex.test(stream.url)
        )
    );

    if (typeof found === 'undefined') {
        // Fall back to original searching behavior without regex match against
        // URL
        found = streams.find(
            (stream) => (
                stream.protocol === stream_protocol
            )
        );
    }

    return found;
}


export const serviceToGalleryService = (
    {
        label,
        uuid,
        slug,
        type
    }: {
        label: string,
        uuid: string,
        slug: string,
        type: string
    }
): false | {
    label: string,
    type: string,
    uuid: string,
    sortOrder: number,
    svcType: 'img' | 'video'
} => {
    if (type.match(/streamingservice$/i)) {
        return false
    }
    if (slug.indexOf('-results') === -1) {
        return false
    }

    let sortOrder = 0
    const isStillImageGallery = slug.indexOf('-stills') !== -1;
    const isAnnotatedImageGallery = slug.indexOf('annotated-image') !== -1;
    const isImageIshGallery = (isStillImageGallery || isAnnotatedImageGallery);
    if (isImageIshGallery) {

        if (isStillImageGallery) {
            sortOrder = 1;
        } else if (isAnnotatedImageGallery) {
            sortOrder = 2;
        }

    } else {
        sortOrder = 3;
    }


    return {
        label,
        type,
        uuid,
        svcType: isImageIshGallery ? 'img' : 'video',
        sortOrder
    }


}

const isStillImageService = (service: IWebCOOSParsedAssetService): boolean => {
    return service.data.common.slug.indexOf('-stills') !== -1;
}


/**
 * Parses a WebCOOS asset single entry from the API into something multiple
 * components can use.
 */
export function parseWebCOOSAsset(item: IWebCOOSRawAsset, statusNow = undefined): IWebCOOSParsedAsset {
    /* This feels so hacky, the API should have an endpoint
        that returns all streaming URLs for a camera... and
        a much more simplified return object.
    */
    const products = item.feeds.flatMap((feed) => feed.products);
    const services = products.flatMap((product) => product.services);
    const streamingService = services.find((service) => service.data.type === 'StreamingService');
    const streams = streamingService?.data.properties.connections || [];

    const dashStream = findStream(streams, 'dash', /.*axds.co.*/);
    const hlsStream = findStream(streams, 'hls', /.*axds.co.*/);
    const embedStream = findStream(streams, 'embed', /.*axds.co.*/);

    const dashUrl = dashStream?.url;
    const hlsUrl = hlsStream?.url;
    const embedUrl = embedStream?.url;

    const has_live_stream = !!(hlsUrl || dashUrl || embedUrl);

    const thumbnails = item.data.properties?.thumbnails?.base;

    // Extracted from GeoJSON
    const longitude = item.data.properties.location?.coordinates[0];
    const latitude = item.data.properties.location?.coordinates[1];
    const wedge = item.data.properties.wedge;

    const serviceDates = services.flatMap((svc) => [svc.elements.first_starting, svc.elements.last_starting]).filter(d => d !== null);
    serviceDates.sort();

    const dateBounds = [
        serviceDates.length > 0 ? serviceDates[0] : null,
        serviceDates.length > 1 ? serviceDates[serviceDates.length - 1] : null
    ]

    const galleryServices = services
        ? services
            .filter((service) => service.data.type !== 'StreamingService')
            // Filtering out any 'results' services/products for now
            .filter((service) => service.data.common.slug.indexOf('-results') === -1)
            .flatMap((service) => {
                // parse the frequency if it exists
                const freqType = service.data?.properties?.frequency?.type;
                const freqPeriod = service.data?.properties?.frequency?.value === 'periodic'
                    ? duration.parse(service.data?.properties?.frequency?.value)
                    : service.data?.properties?.frequency?.value;

                let sortOrder = 0;

                // a service of un-modified still images
                const isStillImageGallery = isStillImageService(service);
                // a service of modifified (annotated) still images
                const isAnnotatedImageGallery = service.data.common.slug.indexOf('annotated-image') !== -1;

                const isImageIshGallery = (isStillImageGallery || isAnnotatedImageGallery);

                if (isImageIshGallery) {

                    if (isStillImageGallery) {
                        sortOrder = 1;
                    } else if (isAnnotatedImageGallery) {
                        sortOrder = 2;
                    }

                } else {
                    sortOrder = 3;
                }

                return {
                    uuid: service.uuid,
                    common: service.data.common,
                    slug: service.data.common.slug,
                    elements: service.elements,
                    sortOrder: sortOrder,
                    svcType: (isImageIshGallery ? 'img' : 'video'),
                    frequency: {
                        type: freqType,
                        period: freqPeriod,
                    },
                };
            }).sort((a, b) => a.sortOrder - b.sortOrder)
        : [];

    const times = galleryServices.map(g => {
        const ending = g.elements.last_ending ?? g.elements.last_starting;
        const starting = g.elements.first_starting ?? g.elements.first_ending;
        return [
            starting !== null ? new Date(starting) : null,
            ending !== null ? new Date(ending) : null
        ]
    }).flat().filter(d => d !== null) as Date[];

    const timeDomain = times.length > 1
        ? [
            new Date(Math.min(...times.map(d => d.getTime()))),
            new Date(Math.max(...times.map(d => d.getTime())))
        ] as [Date, Date]
        : undefined;

    const has_archived_video = galleryServices.some(s => s.svcType === 'video');
    const has_archived_images = galleryServices.some(s => s.svcType === 'img');

    const stillImageService = services.find((service) => isStillImageService(service)) ?? null;


    let cameraProducts: Array<string | null> = [];
    if (services) {
        const productsFromSystem = services
            .map((service) => {
                const system = service.data.system;
                if (!system) return null;

                if (system.includes('rip_current_detect')) return 'rips';
                if (system.includes('shoreline')) return 'shoreline';
                if (system.includes('object_detection')) return 'beach';
                if (system.includes('flood')) return 'flood';
                return null;
            })
            .filter((p) => p);

        const productsFromSlug = services
            .map((service) => {
                const slug = service.data.common?.slug;
                if (!slug) return null;

                if (slug.includes('rip') || slug.includes('current')) return 'rips';
                if (slug.includes('shoreline') || slug.includes('shore')) return 'shoreline';
                if (slug.includes('beach') || slug.includes('usage') || slug.includes('object')) return 'beach';
                if (slug.includes('flood') || slug.includes('water')) return 'flood';
                return null;
            })
            .filter((p) => p);

        cameraProducts = [...new Set([...productsFromSystem, ...productsFromSlug])];
    }

    // add a status description to the results
    const status = getStatus(
        makeUTCDate(serviceDates[serviceDates.length - 1]),
        statusNow,
        has_live_stream
    );
    const state = getStateFromCameraLabel(item.data?.common?.label);

    return {
        uuid: item.uuid,
        slug: item.data?.common?.slug,
        label: item.data?.common?.label,
        description: item.data?.common?.description,
        access: item.data?.common?.access_level,
        statisticsLevel: item.data?.common?.statistics_level,
        timezone: item.data?.properties?.timezone,
        source: item.data?.properties?.source,
        group: item.data?.properties?.group,
        longitude: longitude,
        latitude: latitude,
        thumbnail: thumbnails?.rect_large,
        thumbnails: thumbnails,
        hls_stream: hlsStream,
        dash_stream: dashStream,
        embed_stream: embedStream,
        services,
        dateBounds,
        galleryServices,
        timeDomain,
        stillImageService,
        wedge: wedge,
        status: status,
        products: cameraProducts,
        geography: {
            region: item.data?.properties?.group,
            state,
        },
        has_live_stream,
        has_archived_video,
        has_archived_images,
    };
}


export
    /**
     * Returns a status object for a given date.
     *
     * Status object contains a slug, bg color, fg color, border color, text description.
     * An 'age' field (in days) is added dynamically based on difference between `now` (or time of call)
     * and `mostRecentElement`.
     *
     * Status slugs are 'active', 'archive', 'live', or 'unknown'.
     *
     * You can specify a 'now', if not set, it will use the current timestamp at time of call.
     */
    function getStatus(mostRecentElement: Date, now: Date | undefined = undefined, hasLive = false) {
    const sobjs = {
        active: {
            slug: 'active',
            bg: 'bg-primary',
            fg: 'text-white',
            colorHex: '#32899e',
            border: 'border-primary-darker',
            desc: 'Camera has data within the last 24 hours',
            sortorder: 1,
        },
        archive: {
            slug: 'archive',
            bg: 'bg-primary-lighter',
            fg: 'text-gray-500',
            colorHex: '#9ca3af',        // gray-400 so it can be seen easier
            border: 'border-gray-500',
            desc: 'Camera has data older than 24 hours',
            sortorder: 2,
        },
        live: {
            slug: 'live',
            bg: 'bg-green-500',
            fg: 'text-green-100',
            colorHex: '#10b981',
            border: 'border-green-700',
            desc: 'Camera has a live streaming feed',
            sortorder: 0,
        },
        unknown: {
            slug: 'unknown',
            bg: 'bg-gray-400',
            fg: 'text-gray-800',
            colorHex: '#f3f4f6',    // gray-100
            border: 'border-gray-800',
            desc: 'Camera has an unknown status',
            sortorder: 3,
        },
    };

    if (hasLive) {
        return {
            ...sobjs['live'],
            age: -1
        }
    }

    if (!now) {
        now = new Date();
    }

    const dayDiff = differenceInDays(now, mostRecentElement);
    if (isNaN(dayDiff)) {
        return {
            ...sobjs['unknown'],
            age: 999999
        }
    }

    if (Math.abs(dayDiff) > 1) {
        return {
            ...sobjs['archive'],
            age: dayDiff
        }
    }

    return {
        ...sobjs['active'],
        age: 0
    }
}


export const makeUTCDate = (dateInput?: Date | string | number): Date => {
    if (typeof dateInput === 'undefined') {
        return new Date();
    }
    const dateInputUpdated = typeof dateInput === 'string'
        ? dateInput.endsWith('Z') || dateInput.includes('+')
            ? dateInput
            : `${dateInput}Z`
        : dateInput;
    const date = new Date(dateInputUpdated);
    return date;
}
