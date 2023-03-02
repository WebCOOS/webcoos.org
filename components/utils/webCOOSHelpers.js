import { differenceInDays } from 'date-fns';
import * as duration from 'duration-fns';


function findStream( streams, stream_protocol, match_preference_url_regex ) {

    if( !streams ) {
        return undefined;
    }

    if( !stream_protocol ) {
        console.warn(
            "Need to provide stream_protocol in order to find stream (findStream)"
        );
        return undefined;
    }

    if( typeof match_preference_url_regex === 'undefined' ) {
        match_preference_url_regex = RegExp( "." );
    }

    if( typeof match_preference_url_regex === 'string' ) {
        match_preference_url_regex = RegExp( match_preference_url_regex );
    }

    if( !match_preference_url_regex instanceof RegExp ) {
        console.warn(
            `Passed match_preference_url_regex value is not of type RegExp: ${typeof match_preference_url_regex}`
        );
        return undefined;
    }

    let found = streams.find(
        (stream) => (
            stream.protocol === stream_protocol &&
            match_preference_url_regex.test( stream.url )
        )
    );

    if( typeof found === 'undefined' ) {
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

/**
 * Parses a WebCOOS asset single entry from the API into something multiple
 * components can use.
 */
function parseWebCOOSAsset(item, statusNow=undefined) {
    /* This feels so hacky, the API should have an endpoint
        that returns all streaming URLs for a camera... and
        a much more simplified return object.
    */
    const products = item.feeds.flatMap((feed) => feed.products);
    const services = products.flatMap((product) => product.services);
    const streamingService = services.find((service) => service.data.type === 'StreamingService');
    const streams = streamingService?.data.properties.connections || [];

    const dashStream = findStream( streams, 'dash', /.*axds.co.*/ );
    const hlsStream = findStream( streams, 'hls', /.*axds.co.*/ );
    const embedStream = findStream( streams, 'embed', /.*axds.co.*/ );

    const dashlUrl = dashStream?.url;
    const hlsUrl = hlsStream?.url;
    const embedUrl = embedStream?.url;

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
              .flatMap((service) => {
                  // parse the frequency if it exists
                  const freqType = service.data?.properties?.frequency?.type;
                  let freqPeriod = service.data?.properties?.frequency?.value;

                  if (freqType === 'periodic' && !!freqPeriod) {
                      freqPeriod = duration.parse(freqPeriod); // from str like 'P1Y6H' -> { years: 1, hours:  6}
                  }

                  return {
                      uuid: service.uuid,
                      common: service.data.common,
                      elements: service.elements,
                      svcType: service.data.common.slug.indexOf('-stills') !== -1 ? 'img' : 'video',
                      frequency: {
                          type: freqType,
                          period: freqPeriod,
                      },
                  };
              })
        : [];

    // add a status description to the results
    const status = getStatus(new Date(serviceDates[serviceDates.length - 1]), statusNow, !!(hlsUrl || dashlUrl || embedUrl));

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
        services: services,
        dateBounds: dateBounds,
        galleryServices: galleryServices,
        wedge: wedge,
        status: status,
    };
}

export { parseWebCOOSAsset };

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
function getStatus(mostRecentElement, now = undefined, hasLive = false) {
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

export { getStatus };


export class ResponseNotOkError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ResponseNotOkError';
    }
}

export class MissingTokenError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MissingTokenError';
    }
}

/**
 * Helper method to make an API request for assets.
 */
async function getAPIAssets({
    apiUrl = process.env.NEXT_PUBLIC_WEBCOOS_API_URL || 'https://app.stage.webcoos.org/webcoos/api',
    apiVersion = 'v1',
    source = 'webcoos',
    token = process.env.NEXT_PUBLIC_WEBCOOS_API_TOKEN,
    slug
} = {}) {
    if (!token) {
        throw new MissingTokenError("API Token not provided, pass to getAPIAassets or set env var NEXT_PUBLIC_WEBCOOS_API_TOKEN");
    }

    const parts = [
        apiUrl,
        apiVersion,
        'assets',
        ...(!!slug ? [slug] : []),
        `?source=${source}&_nocache=true`
    ],
        url = parts.join('/');

     const cameraMetadataResponse = await fetch(url, {
         headers: {
             Authorization: `Token ${token}`,
             Accept: 'application/json',
         },
     });

     if (!cameraMetadataResponse.ok) {
        throw new ResponseNotOkError(`API response (${url}) not ok: ${cameraMetadataResponse.toString()}`);
     }

     return await cameraMetadataResponse.json();
}

export { getAPIAssets }
