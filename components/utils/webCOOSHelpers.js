import { differenceInDays } from 'date-fns';

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
    const dash = streams.find((stream) => stream.protocol === 'dash')?.url;
    const hls = streams.find((stream) => stream.protocol === 'hls')?.url;
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
                  return {
                      uuid: service.uuid,
                      common: service.data.common,
                      elements: service.elements,
                      svcType: service.data.common.slug.indexOf('-stills') !== -1 ? 'img' : 'video'
                  };
              })
        : [];

    // add a status description to the results
    const status = getStatus(new Date(serviceDates[serviceDates.length - 1]), statusNow, !!(hls || dash));

    return {
        uuid: item.uuid,
        slug: item.data?.common?.slug,
        label: item.data?.common?.label,
        description: item.data?.common?.description,
        timezone: item.data?.properties?.timezone,
        source: item.data?.properties?.source,
        group: item.data?.properties?.group,
        longitude: longitude,
        latitude: latitude,
        thumbnail: thumbnails?.rect_large,
        thumbnails: thumbnails,
        hls_url: hls,
        dash_url: dash,
        services: services,
        dateBounds: dateBounds,
        galleryServices: galleryServices,
        wedge: wedge,
        status: status
    };
}

export { parseWebCOOSAsset };

/**
 * Returns a status object for a given date.
 * 
 * Status object contains a slug, bg color, fg color, text description. An 'age' field (in days) is added dynamically based on
 * difference between `now` (or time of call) and `mostRecentElement`.
 * 
 * Status slugs are 'active', 'archive', 'live', or 'unknown'.
 * 
 * You can specify a 'now', if not set, it will use the current timestamp at time of call.
 */
function getStatus(mostRecentElement, now = undefined, hasLive = false) {
    const sobjs = {
        'active': {
            slug: 'active',
            bg: 'bg-primary',
            fg: 'text-white',
            desc: 'Camera has data within the last 24 hours'
        },
        'archive': {
            slug: 'archive',
            bg: 'bg-primary-lighter',
            fg: 'text-gray-500',
            desc: 'Camera has data older than 24 hours'
        },
        'live': {
            slug: 'live',
            bg: 'bg-green-500',
            fg: 'text-green-100',
            desc: 'Camera has a live streaming feed'
        },
        'unknown': {
            slug: 'unknown',
            bg: 'bg-gray-400',
            fg: 'text-gray-800',
            desc: 'Camera has an unknown status'
        }
    }

    if (hasLive) {
        return {
            ...sobjs['live'],
            age: 0
        }
    }

    if (!now) {
        now = new Date();
    }

    const dayDiff = differenceInDays(now, mostRecentElement);
    if (isNaN(dayDiff)) {
        return {
            ...sobjs['unknown'],
            age: -1
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
