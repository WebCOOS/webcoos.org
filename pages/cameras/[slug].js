import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { HeroSection, NarrativeSection, PartnerLogos, Section, SectionHeader } from '@axds/landing-page-components';
import Page from '../../components/Page';

import { getSiteMetadata, getYaml } from '../../utils';
import { parseWebCOOSAsset } from '../../components/utils/webCOOSHelpers';
import { IconCamera, IconVideoCamera } from '../../components/Icon';

import dynamic from 'next/dynamic';

const CameraSummary = dynamic(() => import('../../components/CameraSummary'), { ssr: false });
const MediaGallery = dynamic(() => import('../../components/MediaGallery'), { ssr: false });
const TabbedGallery = dynamic(() => import('../../components/TabbedGallery'), { ssr: false });

const apiUrl = process.env.NEXT_PUBLIC_WEBCOOS_API_URL || 'https://app.stage.webcoos.org/webcoos/api',
    apiVersion = 'v1',
    source = 'webcoos';

export default function CameraPage({ metadata, slug, rawMetadata, parsedMetadata, services, ...props }) {
    const availTabs = useMemo(() => {
        return services.map((service) => {
            return {
                key: service.common.slug,
                label: service.common.label,
                inventory: service.inventory,
                serviceUuid: service.uuid,
                icon:
                    service.svcType === 'img' ? (
                        <IconCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />
                    ) : (
                        <IconVideoCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />
                    ),
                galleryComponent: (date) => {
                    return (
                        <MediaGallery
                            key={`${slug}-${date.toISOString()}-${service.uuid}`}
                            apiUrl={process.env.NEXT_PUBLIC_WEBCOOS_API_URL || 'https://app.stage.webcoos.org/webcoos/api'}
                            apiVersion='v1'
                            token={process.env.NEXT_PUBLIC_WEBCOOS_API_TOKEN}
                            serviceUuid={service.uuid}
                            selectedDate={date}
                            timezone={parsedMetadata.timezone}
                            iconComponent={
                                service.svcType === 'img' ? (
                                    <IconCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />
                                ) : (
                                    <IconVideoCamera
                                        size={4}
                                        extraClasses='inline-block pr-1 align-bottom'
                                        paddingx={0}
                                    />
                                )
                            }
                            zoomedComponent={(zoomed, onClick) =>
                                service.svcType === 'img' ? (
                                    <img
                                        className='object-contain'
                                        src={zoomed.data.properties.url}
                                        alt={zoomed.data.dateTimeStr}
                                        onClick={onClick}
                                    />
                                ) : (
                                    <video className='object-contain' controls onClick={onClick}>
                                        <source src={zoomed.data.properties.url} type='video/mp4' />
                                    </video>
                                )
                            }
                        />
                    );
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

                <TabbedGallery
                    availTabs={availTabs}
                    timezone={parsedMetadata.timezone}
                    apiUrl={process.env.NEXT_PUBLIC_WEBCOOS_API_URL || 'https://app.stage.webcoos.org/webcoos/api'}
                />

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

    const cameraMetadataResponse = await fetch(`${apiUrl}/${apiVersion}/assets/${params.slug}?source=${source}`, {
        headers: {
            Authorization: `Token ${process.env.NEXT_PUBLIC_WEBCOOS_API_TOKEN}`,
            Accept: 'application/json',
        },
    });

    // https://nextjs.org/docs/api-reference/data-fetching/get-static-props#notfound
    if (!cameraMetadataResponse.ok) {
        return {
            notFound: true
        }
    }

    const cameraMetadataResult = await cameraMetadataResponse.json(),
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
        services = rawServices.map(service => {
            const svcType = service.common.slug.indexOf('-stills') !== -1 ? 'img' : 'video';

            return {
                ...service,
                svcType: svcType,
            };
        })

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
