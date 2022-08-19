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
        services: services
    };
}

export { parseWebCOOSAsset };
