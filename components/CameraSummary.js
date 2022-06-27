import React, { useMemo } from 'react';
import { StaticMap } from '@axds/landing-page-components';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

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
    alt_bg,
    has_bottom = true,
    mapboxAccessToken = process.env.REACT_APP_MAPBOX_TOKEN || process.env.STORYBOOK_MAPBOX_TOKEN
}) {
    const thumbsProps = useMemo(() => {
        if (thumbnails) {
            const srcset = `${thumbnails.rect_small} 200w, ${thumbnails.rect_medium} 400w, ${thumbnails.rect_large} 800w`,
                // is the thumbnail center and large or video is center and thumb is right/small?
                sizes = !!hls_url ?
                    "(max-width: 840px) 200px, (max-width: 1536px) 400px, 800px" :
                    "(max-width: 200px) 200px, (max-width: 940px) 400px, 800px";

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
    }, [thumbnail, thumbnails, hls_url]);

    const borderColor = useMemo(() => {
        if (alt_bg) {
            return '#a8aeae';
        }
        return '#ACB5B1';
    }, [alt_bg]);

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
                <div className='grid grid-cols-3 md:grid-cols-2 font-bold justify-between items-center text-sm'>
                    <div>{group}</div>
                    <div className='justify-self-center md:justify-self-end'>{slug}</div>
                    <div className='md:hidden flex flex-col font-normal text-xs justify-self-end items-end sm:flex-row sm:gap-2 sm:items-center'>
                        <div>{longitude}</div>
                        <div>{latitude}</div>
                    </div>
                </div>

                <p className='hidden md:block md:flex-grow md:flex-shrink md:overflow-ellipsis md:overflow-hidden'>
                    {description}
                </p>

                <div className='hidden md:block bg-white p-4 border border-gray-200 text-center justify-self-end'>
                    Data Access
                </div>
            </div>
            <div className='md:self-center md:justify-self-center'>
                {hls_url ? (
                    <VideoStreamPlayer
                        assetUri={hls_url}
                        className='object-contain border'
                        style={{ borderColor: borderColor }}
                    />
                ) : (
                    <img {...thumbsProps} alt={label} className='w-full h-full object-fill' />
                )}
            </div>

            <div
                className={classNames('hidden md:flex md:gap-4', {
                    'md:flex-col': !!hls_url,
                })}
            >
                <div className='md:flex-grow' style={{ minHeight: '90px' }}>
                    <AutoSizer>
                        {({ height, width }) => (
                            <StaticMap
                                width={width}
                                height={height}
                                latitude={latitude}
                                longitude={longitude}
                                markerSymbol='attraction'
                                mapboxAccessToken={mapboxAccessToken}
                                extraClasses={'border'}
                                extraStyle={{ borderColor: borderColor }}
                                decimalPlaces={3}
                            />
                        )}
                    </AutoSizer>
                </div>
                {hls_url ? (
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