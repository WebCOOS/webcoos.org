import React, { useMemo } from 'react';
import { StaticMap } from '@axds/landing-page-components';
import AutoSizer from '@enykeev/react-virtualized/dist/commonjs/AutoSizer';
import { useMapboxContext } from './contexts/MapboxContext';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

import classNames from 'classnames';

import dynamic from 'next/dynamic';

const VideoStreamPlayer = dynamic(
    () => import('@axds/landing-page-components/build/es/no-ssr').then((mod) => mod.VideoStreamPlayer),
    { ssr: false }
);

function selectStream( stream_list ) {

    if( !stream_list ) {
        return [ null, null ];
    }

    // Get deep copy to ensure we aren't mutating the original
    const working = JSON.parse( JSON.stringify( stream_list ) );

    working.forEach(
        ( [stream_type, stream] ) => {
            if(
                ( !( 'priority' in stream ) )
                ||
                ( typeof stream.priority === 'undefined' )
            ) {
                // If a priority is missing, give it a sufficiently low priority
                // to ensure it isn't sorted above other priorities, but give
                // preference in the following order among other unspecified stream
                // types:
                //
                // 1. (highest) hls
                // 2. dash
                // 3. (lowest) embed

                switch( stream_type ) {
                    case "hls":
                        stream.priority = -97;
                        return;
                    case "dash":
                        stream.priority = -98;
                        return;
                    case "embed":
                        stream.priority = -99;
                        return;
                    default:
                        throw new Error(
                            `Unhandled stream type: ${stream_type}`
                        )
                }
            }
        }
    )

    // Sort by priority, highest priority being last in the array, and taking
    // precedence when popped off the end.
    working.sort(
        ( [a_type,a_stream],[b_type, b_stream] ) => {
            return a_stream.priority - b_stream.priority;
        }
    );

    return working.pop();
}

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
    hls_stream,
    dash_stream,
    embed_stream,
    services,
    wedge,
    cameraSvcDataLink,
    alt_bg,
    has_bottom = true,
}) {
    const mapboxAccessToken = useMapboxContext();

    const hls_url = hls_stream?.url,
        dash_url = dash_stream?.url,
        embed_url = embed_stream?.url,
        embedAttrs = embed_stream?.attributes;

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

    const available_streams = [];

    if( !!hls_stream ) {
        available_streams.push( ['hls', hls_stream] );
    }

    if( !!dash_stream ) {
        available_streams.push( ['dash', dash_stream] );
    }

    if( !!embed_stream ) {
        available_streams.push( ['embed', embed_stream] );
    }

    let selected_stream_type = null, selected_stream = null;

    if( available_streams.length > 0 ) {
        [ selected_stream_type, selected_stream ] = selectStream(
            available_streams
        );
        // console.log( 'selected: ', selected_stream_type, selected_stream )
    }

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
                <div className='hidden md:block md:flex-grow md:flex-shrink md:overflow-ellipsis md:overflow-hidden'>
                    <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeRaw, rehypeKatex]}
                        className={classNames('prose camera-prose text-sm p-0 pt-4')}
                    >
                    {description}
                    </ReactMarkdown>
                </div>
                {cameraSvcDataLink && (
                    <div className='hidden md:flex text-center justify-self-end flex-col justify-end gap-y-1'>
                        {galleryServices.map((s) => cameraSvcDataLink(slug, s))}
                    </div>
                )}
            </div>
            <div className='md:self-center md:justify-self-center'>
                {hasStream ? (
                    ( !!selected_stream_type && selected_stream_type === 'embed' ) ? (
                        <iframe src={embed_url} width='500px' height='375px' frameBorder='0' allowFullScreen {...embedAttrs}></iframe>
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
