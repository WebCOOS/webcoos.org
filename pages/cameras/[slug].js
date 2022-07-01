import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { HeroSection, NarrativeSection, PartnerLogos, Section, SectionHeader } from '@axds/landing-page-components';
import Page from '../../components/Page';

import { getSiteMetadata, getYaml } from '../../utils';
import { parseWebCOOSAsset } from '../../components/utils/webCOOSHelpers';
import { IconCamera, IconVideoCamera } from '../../components/Icon';

import dynamic from 'next/dynamic';

const CameraSummary = dynamic(() => import('../../components/CameraSummary'), { ssr: false });
const StillsGallery = dynamic(() => import('../../components/StillsGallery'), { ssr: false });
const VideoGallery = dynamic(() => import('../../components/VideoGallery'), { ssr: false });

const apiUrl = 'https://app.stage.webcoos.org/webcoos/api',
    apiVersion = 'v1',
    source = 'webcoos';

export default function CameraPage({ metadata, slug, rawMetadata, parsedMetadata, ...props }) {

    const serviceUuid = useMemo(() => {
        // find the compatable feed
        const products = rawMetadata.feeds.flatMap((feed) => {
            return feed.products.filter((product) => {
                return product.data.common.slug.indexOf('-stills') !== -1;
            });
        });

        if (products.length) {
            return products[0].services[0].uuid;
        }
        return null;
    }, [rawMetadata]);

    const videoServiceUuid = useMemo(() => {
        const products = rawMetadata.feeds.flatMap((feed) => {
            return feed.products.filter((product) => {
                return product.data.common.slug.indexOf('video-') !== -1;
            });
        });

        if (products.length) {
            return products[0].services[0].uuid;
        }
    }, [rawMetadata]);

    useEffect(() => {
        if (!serviceUuid && videoServiceUuid) {
            setCurTab('videos');
        }
    }, [videoServiceUuid, serviceUuid])

    const availTabs = useMemo(() => {
        const at = [];

        if (serviceUuid) {
            at.push({
                key: 'stills',
                icon: <IconCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />,
            });
        }

        if (videoServiceUuid) {
            at.push({
                key: 'videos',
                icon: <IconVideoCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />,
            });
        }
        return at;
    }, [serviceUuid, videoServiceUuid]);


    return (
        <Page metadata={metadata} title={parsedMetadata.label}>
            <Section>
                <SectionHeader>
                    <a className='text-primary hover:underline' href='/cameras/'>
                        Cameras
                    </a>{' '}
                    | {parsedMetadata.label}
                </SectionHeader>
                <CameraSummary {...parsedMetadata} mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN} />

                <ul
                    className='nav nav-tabs flex flex-col md:flex-row flex-wrap list-none border-b-0 pl-0 mb-4'
                    id='tabs-tab'
                    role='tablist'
                >
                    {availTabs.map((at) => {
                        return (
                            <li key={at.key} className='nav-item' role='presentation'>
                                <a
                                    href='#tabs-home'
                                    className={classNames(
                                        'nav-link block font-medium text-xs leading-tight uppercase border-x-0 border-t-0 border-b-2 border-transparent px-6 py-3 my-2 hover:border-transparent hover:bg-gray-100',
                                        {
                                            'text-primary border-primary hover:border-primary-darker hover:text-primary-darker':
                                                at.key === curTab,
                                        }
                                    )}
                                    id={`tabs-${at.key}-tab`}
                                    role='tab'
                                    aria-controls={`tabs-${at.key}`}
                                    aria-selected={at.key === curTab ? 'true' : 'false'}
                                    onClick={(e) => selectTab(e, at.key)}
                                >
                                    {at.icon}
                                    {at.key}
                                </a>
                            </li>
                        );
                    })}
                </ul>
                <div className='tab-content' id='tabs-tabContent'>
                    {serviceUuid && (
                        <div
                            className={classNames('tab-pane fade', {'visible': curTab === 'stills', 'hidden': curTab !== 'stills'})}
                            id='tabs-stills'
                            role='tabpanel'
                            aria-labelledby='tabs-stills-tab'
                        >
                            <StillsGallery
                                apiUrl={apiUrl}
                                apiVersion={apiVersion}
                                token={process.env.NEXT_PUBLIC_WEBCOOS_API_TOKEN}
                                serviceUuid={serviceUuid}
                            />
                        </div>
                    )}
                    {videoServiceUuid && (
                        <div
                            className={classNames('tab-pane fade', {'visible': curTab === 'videos', 'hidden': curTab !== 'videos'})}
                            id='tabs-videos'
                            role='tabpanel'
                            aria-labelledby='tabs-videos-tab'
                        >
                            <VideoGallery
                                apiUrl={apiUrl}
                                apiVersion={apiVersion}
                                token={process.env.NEXT_PUBLIC_WEBCOOS_API_TOKEN}
                                serviceUuid={videoServiceUuid}
                            />
                        </div>
                    )}
                </div>
                <div className='my-4 flex'></div>
            </Section>
        </Page>
    );
}

export async function getStaticPaths() {
    const cameraData = await getYaml('cameras.yaml'),
        cameraSlugs = cameraData.cameras.active;

    return {
        paths: cameraSlugs.map((slug) => ({
            params: {
                slug,
            },
        })),
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    // pull live metadata from API

    const cameraMetadataResponse = await fetch(`${apiUrl}/${apiVersion}/assets/${params.slug}?source=${source}&_nocache=true`, {
            headers: {
                Authorization: `Token ${process.env.NEXT_PUBLIC_WEBCOOS_API_TOKEN}`,
                Accept: 'application/json',
            },
        }),
        cameraMetadataResult = await cameraMetadataResponse.json(),
        parsedMetadata = parseWebCOOSAsset(cameraMetadataResult),
        sanitized = Object.fromEntries(
            Object.entries(parsedMetadata).map((p) => {
                return [p[0], p[1] === undefined ? null : p[1]];
            })
        );

    return {
        props: {
            metadata: await getSiteMetadata(),
            slug: params.slug,
            rawMetadata: cameraMetadataResult,
            parsedMetadata: sanitized,
        },
    };
}
