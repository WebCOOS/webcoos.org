import type { Feature, Polygon } from 'geojson';
import { useMemo } from 'react';
import { circle, union, featureCollection, polygon as turfPolygon } from "@turf/turf";
import { utils } from '@axdspub/axiom-ui-utilities';

//import classNames from 'classnames';

//import circle from "@turf/circle";
//import union from "@turf/union";

function StaticMap({
    longitude,
    latitude,
    wedgePolygon,
    width = 600,
    height = 400,
    zoom = 10,
    style = 'mapbox/light-v10',
    mapboxAccessToken = import.meta.env.VITE_APP_MAPBOX_TOKEN,
    markerSymbol = undefined,
    color,
    extraClasses,
    decimalPlaces = 4,
    extraStyle = {}
}: {
    longitude: number,
    latitude: number,
    wedgePolygon?: Polygon,
    width?: number,
    height?: number,
    zoom?: number,
    style?: string,
    mapboxAccessToken?: string,
    markerSymbol?: string,
    extraClasses?: string,
    decimalPlaces?: number,
    extraStyle?: object,
    color?: string,
    
}) {
    const overlay = useMemo(() => {
        if (!(longitude && latitude)) {
            return null;
        }
        /* const sym = markerSymbol ? `-${markerSymbol}` : '',
            col = color ? `+${color.replace('#', '')}` : '';

        if (zoom < 8) {
            return `pin-l${sym}${col}(${longitude},${latitude})`;
        } */
        const radius = 0.2 + (Math.max(0, 11 - zoom) * 0.3),
            feature = circle([longitude, latitude], radius, {
                units: 'kilometers',
                properties: {
                    ...(color
                        ? {
                              fill: color,
                          }
                        : {}),
                },
            });
        return feature as Feature<Polygon>;
    }, [longitude, latitude, markerSymbol, zoom]);

    const wedgeOverlay = useMemo(() => {
        if (!wedgePolygon) {
            return null;
        }
        if (zoom < 10) { return null; }
        /* const feature = {
            type: 'Feature',
            properties: {
                'stroke-opacity': 0.1,
                ...(color
                    ? {
                          fill: color,
                      }
                    : {}),
            },
            geometry: {
                type: 'Polygon',
                coordinates: [
                    wedgePolygon.coordinates[0].map((cPair) => [
                        parseFloat(cPair[0].toPrecision(6)),
                        parseFloat(cPair[1].toPrecision(6)),
                    ]),
                ],
            },
        }; */
        const feature = turfPolygon(
            [
                wedgePolygon.coordinates[0].map((cPair) => [
                    parseFloat(cPair[0].toPrecision(6)),
                    parseFloat(cPair[1].toPrecision(6)),
                ]),
            ],
            {
                'stroke-opacity': 0.1,
                ...(color
                    ? {
                          fill: color,
                      }
                    : {}),
            },
            )
        return feature;
    }, [wedgePolygon, zoom]);

    const gj = (feature:Feature) => `geojson(${encodeURIComponent(JSON.stringify(feature))})`;

    const imgSrc = useMemo(() => {
        const overlayUnion =
                wedgeOverlay && overlay
                    ? union(featureCollection([
                            overlay, 
                            wedgeOverlay
                        ]), {
                            properties: {
                                ...(color
                                    ? {
                                            fill: color,
                                        }
                                    : {}),
                            },
                        })
                    : overlay,
            overlayJoined = typeof overlayUnion === 'string' || !overlayUnion ? overlayUnion : gj(overlayUnion),
            overlayPortion = overlayJoined ? `${overlayJoined}/` : '',
            lon = longitude || -99.0909,
            lat = latitude || 39.8355,
            zum = longitude && latitude ? zoom : 2;

        const str = `https://api.mapbox.com/styles/v1/${style}/static/${overlayPortion}${lon},${lat},${zum},0,0/${width}x${height}?access_token=${mapboxAccessToken}`;
        return str;
    }, [style, latitude, longitude, width, height, overlay, wedgeOverlay, zoom, mapboxAccessToken, color]);

    const lonDisp = useMemo(() => {
        if (longitude && Number.isInteger(decimalPlaces)) {
            return longitude.toFixed(decimalPlaces);
        }
        return longitude || '';
    }, [longitude, decimalPlaces]);

    const latDisp = useMemo(() => {
        if (latitude && Number.isInteger(decimalPlaces)) {
            return latitude.toFixed(decimalPlaces);
        }
        return latitude || '';
    }, [latitude, decimalPlaces]);

    return (
        <div
            className={utils.makeClassName({
                defaultClassName: 'bg-white border border-gray-200 relative', 
                className: extraClasses
            })}
            style={{ 
                width: `${width}px`, 
                height: `${height}px`, 
                ...extraStyle 
            }}
        >
            <img src={imgSrc} alt={`Map showing ${lonDisp} ${latDisp}`} width={width} height={height} />

            <div className="font-mono text-xs flex gap-2 justify-center absolute top-0 inset-x-0">
                <div className="overflow-ellipsis overflow-x-hidden flex-shrink">{latDisp}</div>
                <div className="overflow-ellipsis overflow-x-hidden flex-shrink">{lonDisp}</div>
            </div>
        </div>
    );
}


export default StaticMap;
