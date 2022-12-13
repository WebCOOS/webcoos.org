import React, { useMemo } from 'react';
import classNames from 'classnames';
import { IconLink } from './Icon';

import dynamic from 'next/dynamic';
const VideoStreamPlayer = dynamic(
    () => import('@axds/landing-page-components/build/es/no-ssr').then((mod) => mod.VideoStreamPlayer),
    { ssr: false }
);

export default function StationCard({
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
    extraClasses = '',
    ...props
}) {
    const hasStream = (!!hls_url || !!dash_url || !!embed_url);

    const thumbsProps = useMemo(() => {
        if (thumbnails) {
            const srcset = `${thumbnails.rect_small} 200w, ${thumbnails.rect_medium} 400w, ${thumbnails.rect_large} 800w`,
                // is the thumbnail center and large or video is center and thumb is right/small?
                sizes = !!hasStream
                    ? '(max-width: 840px) 200px, (max-width: 1536px) 400px, 800px'
                    : '(max-width: 200px) 200px, (max-width: 940px) 400px, 800px';

            return {
                src: thumbnails.rect_large,
                srcSet: srcset,
                sizes: sizes,
            };
        } else {
            return {
                src: thumbnail,
            };
        }
    }, [thumbnail, thumbnails, hls_url, dash_url, embed_url]);

    return (
        <div className={classNames('w-full rounded overflow-hidden shadow-lg bg-white', extraClasses)}>
            {hasStream ? (
                !!embed_url ? (
                    <iframe
                        src={embed_url}
                        width='500px'
                        height='375px'
                        frameBorder='0'
                        allowFullScreen
                        {...embedAttrs}
                    ></iframe>
                ) : (
                    <VideoStreamPlayer key={slug} assetUri={hls_url || dash_url} className='object-contain border' />
                )
            ) : (
                <img key={slug} {...thumbsProps} alt={label} className='w-full object-fill' />
            )}

            <div className='px-6 py-4'>
                <div className='font-bold text-xl mb-2'>{label}</div>
                {description && <p className='text-gray-700 text-base'>{description}</p>}
                <a
                    href={`/cameras/${slug}`}
                    className='bg-primary hover:bg-primary-darker text-white hover:text-primary-lighter font-bold py-2 px-2 rounded my-2 inline-block cursor-pointer border border-primary-darker hover:shadow'
                >
                    <IconLink size={4} extraClasses='inline-block' paddingx={1} />
                    More Info and Data
                </a>
            </div>
        </div>
    );
}
