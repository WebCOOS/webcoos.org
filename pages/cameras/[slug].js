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
const TabbedGallery = dynamic(() => import('../../components/TabbedGallery'), { ssr: false });

const apiUrl = 'https://app.stage.webcoos.org/webcoos/api',
    apiVersion = 'v1',
    source = 'webcoos';

export default function CameraPage({ metadata, slug, rawMetadata, parsedMetadata, services, ...props }) {
    const availTabs = useMemo(() => {
        return services.map((service) => {
            return {
                key: service.common.slug,
                label: service.common.label,
                inventory: service.inventory,
                icon:
                    service.svcType === 'img' ? (
                        <IconCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />
                    ) : (
                        <IconVideoCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />
                    ),
                galleryComponent: (date) => {
                    if (service.svcType === 'img') {
                        return (
                            <StillsGallery
                                key={`${slug}-${date.toISOString()}-${service.uuid}`}
                                apiUrl='https://app.stage.webcoos.org/webcoos/api'
                                apiVersion='v1'
                                token={process.env.NEXT_PUBLIC_WEBCOOS_API_TOKEN}
                                serviceUuid={service.uuid}
                                selectedDate={date}
                            />
                        );
                    } else if (service.svcType === 'video') {
                        return (
                            <VideoGallery
                                key={`${slug}-${date.toISOString()}-${service.uuid}`}
                                apiUrl='https://app.stage.webcoos.org/webcoos/api'
                                apiVersion='v1'
                                token={process.env.NEXT_PUBLIC_WEBCOOS_API_TOKEN}
                                serviceUuid={service.uuid}
                                selectedDate={date}
                            />
                        );
                    }
                },
            };
        });
    }, [services]);

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

                <TabbedGallery availTabs={availTabs} />

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

    const cameraMetadataResponse = await fetch(
            `${apiUrl}/${apiVersion}/assets/${params.slug}?source=${source}&_nocache=true`,
            {
                headers: {
                    Authorization: `Token ${process.env.NEXT_PUBLIC_WEBCOOS_API_TOKEN}`,
                    Accept: 'application/json',
                },
            }
        ),
        cameraMetadataResult = await cameraMetadataResponse.json(),
        parsedMetadata = parseWebCOOSAsset(cameraMetadataResult),
        sanitized = Object.fromEntries(
            Object.entries(parsedMetadata).map((p) => {
                return [p[0], p[1] === undefined ? null : p[1]];
            })
        ),
        rawServices = cameraMetadataResult.feeds.flatMap((feed) => {
            return feed.products.flatMap((product) => {
                return product.services
                    .filter((service) => service.data.type !== 'StreamingService')
                    .flatMap((service) => {
                        return {
                            uuid: service.uuid,
                            common: service.data.common,
                            elements: service.elements,
                        };
                    });
            });
        }),
        services = await Promise.all(
            rawServices.map(async (service) => {
                // retrieve inventory for this service
                const dataInventoryResponse = await fetch(
                        `${apiUrl}/${apiVersion}/services/${service.uuid}/inventory/?_nocache=true`,
                        {
                            headers: {
                                Authorization: `Token ${process.env.NEXT_PUBLIC_WEBCOOS_API_TOKEN}`,
                                Accept: 'application/json',
                            },
                        }
                    ),
                    inventory = (await dataInventoryResponse.json()).results;

                const svcType = service.common.slug.indexOf('-stills') !== -1 ? 'img' : 'video';

                return {
                    ...service,
                    inventory: inventory,
                    svcType: svcType,
                };
            })
        );

    return {
        props: {
            metadata: await getSiteMetadata(),
            slug: params.slug,
            rawMetadata: cameraMetadataResult,
            parsedMetadata: sanitized,
            services: services,
        },
    };
}
