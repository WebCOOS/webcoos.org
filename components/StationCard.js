import React, { useMemo } from 'react';
import classNames from 'classnames';

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
    extraClasses = '',
    ...props
}) {
    const thumbsProps = useMemo(() => {
        if (thumbnails) {
            const srcset = `${thumbnails.rect_small} 200w, ${thumbnails.rect_medium} 400w, ${thumbnails.rect_large} 800w`,
                // is the thumbnail center and large or video is center and thumb is right/small?
                sizes = !!hls_url
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
    }, [thumbnail, thumbnails, hls_url]);

    return (
        <div className={classNames("w-full rounded overflow-hidden shadow-lg bg-white", extraClasses)}>
            {hls_url ? (
                <VideoStreamPlayer assetUri={hls_url} className="object-contain border" />
            ) : (
                <img {...thumbsProps} alt={label} className="w-full object-fill" />
            )}

            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{label}</div>
                {description && <p className="text-gray-700 text-base">{description}</p>}
                <a
                    href={`/cameras/${slug}`}
                    className="bg-blue-300 hover:bg-blue-400 text-blue-900 hover:text-black font-bold py-2 px-4 rounded my-2 inline-block cursor-pointer border border-blue-900 hover:shadow"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 inline"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                    </svg>
                    More Info and Data
                </a>
                <div className="">Community Pages</div>
                <ul>
                    <li>Coming soon...</li>
                </ul>
            </div>
        </div>
    );
}