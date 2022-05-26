import React, { useState, useEffect, useRef } from 'react';
import ReactMapGL, {
    Source,
    Layer,
    Popup,
    Marker,
    // LinearInterpolator,
    // WebMercatorViewport,
    NavigationControl,
    ScaleControl,
} from 'react-map-gl/dist/es5';

const scaleControlStyle = {
    left: 70,
    bottom: 5,
};

const scaleUnits = ['metric', 'imperial', 'nautical'];

export default function GLMap({
    interactiveLayerIds = [],
    layerData = {},
    mapWidth = '100%',
    mapHeight = 667,
    latitude = 30.97,
    longitude = -80.42,
    zoom = 4.25,
    mapStyle = 'mapbox://styles/mapbox/light-v10',
    mapboxAccessToken = process.env.REACT_APP_MAPBOX_TOKEN || process.env.STORYBOOK_MAPBOX_TOKEN,
    zoomToPadding = { top: 40, left: 40, right: 40, bottom: 40 },
    maxZoom = 10,
    onHover = (lon, lat, layers) => {},
    onClick = (lon, lat, layers) => {},
    overlayComponents,
    ...props
}) {
    const [viewport, setViewport] = useState({
        width: mapWidth,
        height: mapHeight,
        latitude: latitude,
        longitude: longitude,
        zoom: zoom,
        /*
    pitch: 60.5,
    bearing: -47.3985
    */
    });

    const [allBBox, setAllBBox] = useState(null);
    const [noData, setNoData] = useState(false);
    const [noDataReason, setNoDataReason] = useState(null);
    const [scaleUnit, setScaleUnits] = useState(scaleUnits[1]);

    const onAutoResize = (e) => {
        return;
        setViewport({
            ...viewport,
            ...e,
        });
    };

    /**
     * Calculates a pixel number from the value if the value looks like a percentage (0 - 1).
     * Uses viewportProp ('width' or 'height') to pull correct value from viewport.
     *
     * @param {Number} val
     * @param {String} viewportProp
     */
    const _calcPadding = (val, viewportProp) => {
        if (val < 1 && !Number.isInteger(val)) {
            return val * viewport[viewportProp];
        }
        return val;
    };

    // const _viewportForExtents = (minLon, minLat, maxLon, maxLat, padding = 40) => {
    //     // fixup padding object if any member contains a percentage
    //     if (typeof padding === 'object') {
    //         padding = {
    //             left: _calcPadding(padding.left || 40, 'width'),
    //             right: _calcPadding(padding.right || 40, 'width'),
    //             top: _calcPadding(padding.top || 40, 'height'),
    //             bottom: _calcPadding(padding.bottom || 40, 'height'),
    //         };
    //     }

    //     let newViewport = new WebMercatorViewport(viewport),
    //         { longitude, latitude, zoom } = newViewport.fitBounds(
    //             [
    //                 [minLon, minLat],
    //                 [maxLon, maxLat],
    //             ],
    //             { padding: padding }
    //         );

    //     return {
    //         latitude: latitude,
    //         longitude: longitude,
    //         zoom: zoom,
    //     };
    // };

    // const zoomToExtents = (extents, padding = zoomToPadding) => {
    //     if (!extents) {
    //         extents = allBBox;
    //     }
    //     if (!extents) {
    //         return;
    //     }

    //     // if autorisize hasn't happened yet,

    //     let [minLon, minLat, maxLon, maxLat] = extents,
    //         { latitude, longitude, zoom } = _viewportForExtents(minLon, minLat, maxLon, maxLat, padding);

    //     setViewport({
    //         ...viewport,
    //         latitude: latitude,
    //         longitude: longitude,
    //         zoom: Math.min(zoom, maxZoom),
    //         transitionInterpolator: new LinearInterpolator(),
    //         transitionDuration: 500,
    //     });
    // };

    const onMapHover = (e) => {
        if (!onHover) {
            return;
        }

        if (e.features.length > 0) {
            let feats = [...e.features];

            for (let i = 0; i < feats.length; i++) {
                // take first feature, strip out any matching that source key
                feats = [...feats.slice(0, i + 1), ...feats.slice(i).filter((f) => f.source != feats[i].source)];
            }

            // console.info(feats, e);
            const [lon, lat] = e.lngLat;
            onHover({
                lon: lon,
                lat: lat,
                layers: feats.map((f) => {
                    return {
                        id: f.layer.id,
                        ...f.properties,
                    };
                }),
            });
        } else {
            onHover({});
        }
    };

    const onMapClick = (e) => {
        if (!onClick) {
            return;
        }
        if (e.features && e.features.length > 0) {
            let feats = [...e.features];

            for (let i = 0; i < feats.length; i++) {
                // take first feature, strip out any matching that source key
                feats = [...feats.slice(0, i + 1), ...feats.slice(i).filter((f) => f.source != feats[i].source)];
            }

            const [lon, lat] = e.lngLat;
            onClick({
                lon: lon,
                lat: lat,
                layers: feats.map((f) => {
                    return {
                        id: f.layer.id,
                        ...f.properties,
                    };
                }),
            });
        } else {
            onClick({});
        }
    };

    return (
        <div className="glmap-container relative">
            <div className="glmap-internal-container">
                <ReactMapGL
                    reuseMaps
                    initialViewState={viewport}
                    mapStyle={mapStyle}
                    onClick={onMapClick}
                    // interactiveLayerIds={interactiveLayerIds || Object.keys(layerData || {}) || null}
                    onHover={onMapHover}
                    onViewportChange={setViewport}
                    mapboxAccessToken={mapboxAccessToken}
                    style={{ width: mapWidth, height: mapHeight }}
                >
                    <div className="nav-holder">
                        <NavigationControl />
                    </div>

                    {/* static layers for reliable z-indexing (max 5) */}
                    <Layer id="z-0" type="background" layout={{ visibility: 'none' }} paint={{}} />
                    <Layer id="z-1" type="background" layout={{ visibility: 'none' }} paint={{}} />
                    <Layer id="z-2" type="background" layout={{ visibility: 'none' }} paint={{}} />
                    <Layer id="z-3" type="background" layout={{ visibility: 'none' }} paint={{}} />
                    <Layer id="z-4" type="background" layout={{ visibility: 'none' }} paint={{}} />

                    {props.children}

                    <ScaleControl maxWidth={100} unit={scaleUnit} style={scaleControlStyle} />
                </ReactMapGL>

                <div className="overlay-container absolute top-0 left-0 w-full h-full pointer-events-none">
                    {overlayComponents}
                </div>
            </div>
        </div>
    );
}
