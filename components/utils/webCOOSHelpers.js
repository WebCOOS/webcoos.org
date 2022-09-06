import { differenceInDays } from 'date-fns';

/**
 * Parses a WebCOOS asset single entry from the API into something multiple
 * components can use.
 */
function parseWebCOOSAsset(item) {
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
        wedge: wedge
    };
}

export { parseWebCOOSAsset };

/**
 * Returns a status for a given date.
 * Statuses are 'active' or 'archive'. (for 'live', see if there is an hls_url/dash_url in parseWebCOOSAsset's output)
 * 
 * You can specify a 'now', if not set, it will use the current timestamp at time of call.
 */
function getStatus({mostRecentElement, now = undefined}) {
    if (!now) {
        now = new Date();
    }

    const dayDiff = differenceInDays(mostRecentElement, now);
    if (dayDiff > 1) {
        return 'archive';
    }

    return 'active';
}

export { getStatus };