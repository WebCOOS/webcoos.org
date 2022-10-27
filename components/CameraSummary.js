import React, { useMemo } from 'react';
import { StaticMap } from '@axds/landing-page-components';
import AutoSizer from '@enykeev/react-virtualized/dist/commonjs/AutoSizer';
import { useMapboxContext } from './contexts/MapboxContext';

import classNames from 'classnames';

import dynamic from 'next/dynamic';

const VideoStreamPlayer = dynamic(
    () => import('@axds/landing-page-components/build/es/no-ssr').then((mod) => mod.VideoStreamPlayer),
    { ssr: false }
);

export default function CameraSummary({
    uuid,
    slug,
    label,
    description,
    source,
    group,
    longitude,
    latitude,
    thumbnail,
    thumbnails,
    hls_url,
    dash_url,
    embed_url,
    embedAttrs,
    services,
    wedge,
    cameraSvcDataLink,
    alt_bg,
    has_bottom = true,
}) {
    const mapboxAccessToken = useMapboxContext();

    const hasStream = (!!hls_url || !!dash_url || !!embed_url);

    const thumbsProps = useMemo(() => {
        if (thumbnails) {
            const srcset = `${thumbnails.rect_small} 200w, ${thumbnails.rect_medium} 400w, ${thumbnails.rect_large} 800w`,
                // is the thumbnail center and large or video is center and thumb is right/small?
                sizes = hasStream
                    ? '(max-width: 840px) 200px, (max-width: 1536px) 400px, 800px'
                    : '(max-width: 200px) 200px, (max-width: 940px) 400px, 800px';

            return {
                src: thumbnails.rect_large,
                srcSet: srcset,
                sizes: sizes
            }
        } else {
            return {
                src: thumbnail
            }
        }
    }, [thumbnail, thumbnails, hls_url, dash_url, embed_url]);

    const borderColor = useMemo(() => {
        if (alt_bg) {
            return '#a8aeae';
        }
        return '#ACB5B1';
    }, [alt_bg]);

    const galleryServices = services ? services
        .filter((service) => service.data.type !== 'StreamingService')
        .flatMap((service) => {
            return {
                uuid: service.uuid,
                common: service.data.common,
                elements: service.elements,
            };
        }) : [];

    return (
        <div
            className={classNames(
                'max-w-screen-2xl grid grid-cols-1 gap-1 p-2 md:grid-cols-camera md:gap-4 md:p-4 border-t-2 border-r-2 border-l-2',
                { 'border-b-2': has_bottom }
            )}
            style={{
                backgroundColor: alt_bg ? '#D2DADA' : '#BFC9C5',
                borderColor: borderColor,
            }}
        >
            <div className='flex flex-col gap-1 text-sm'>
                <a href={`/cameras/${slug}`} className='font-bold text-2xl'>
                    {label}
                </a>
                <p className='hidden md:block md:flex-grow md:flex-shrink md:overflow-ellipsis md:overflow-hidden'>
                    {description}
                </p>
                {cameraSvcDataLink && (
                    <div className='hidden md:flex text-center justify-self-end flex-col justify-end gap-y-1'>
                        {galleryServices.map((s) => cameraSvcDataLink(slug, s))}
                    </div>
                )}
            </div>
            <div className='md:self-center md:justify-self-center'>
                {hasStream ? (
                    !!embed_url ? (
                        <iframe src={embed_url} width='500px' height='375px' frameborder='0' allowfullscreen {...embedAttrs}></iframe>
                    ) : (
                        <VideoStreamPlayer
                            assetUri={hls_url || dash_url}
                            className='object-contain border'
                            style={{ borderColor: borderColor }}
                        />
                    )
                ) : (
                    <img
                        {...thumbsProps}
                        alt={label}
                        className='w-full h-full object-fill shadow-lg border'
                        style={{ borderColor: borderColor }}
                    />
                )}
            </div>

            <div
                className={classNames('hidden md:flex md:gap-4', {
                    'md:flex-col': hasStream,
                })}
            >
                <div className='md:flex-grow' style={{ minHeight: '90px' }}>
                    <AutoSizer>
                        {({ height, width }) =>
                            latitude &&
                            longitude && (
                                <StaticMap
                                    width={width}
                                    height={height}
                                    latitude={latitude}
                                    longitude={longitude}
                                    markerSymbol='attraction'
                                    extraClasses={'border shadow-sm'}
                                    extraStyle={{ borderColor: borderColor }}
                                    decimalPlaces={3}
                                    zoom={10}
                                    mapboxAccessToken={mapboxAccessToken}
                                    wedgePolygon={wedge}
                                />
                            )
                        }
                    </AutoSizer>
                </div>
                {hasStream ? (
                    <div>
                        <img
                            {...thumbsProps}
                            className={classNames('border')}
                            style={{ borderColor: borderColor }}
                            alt={label}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
}
