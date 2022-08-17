import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';

import { HeroSection, NarrativeSection, PartnerLogos, Section, SectionHeader } from '@axds/landing-page-components';
import Page from '../../components/Page';

import { getSiteMetadata, getYaml } from '../../utils';
import { parseWebCOOSAsset } from '../../components/utils/webCOOSHelpers';
import { IconCamera, IconVideoCamera } from '../../components/Icon';

import dynamic from 'next/dynamic';

const CameraSummary = dynamic(() => import('../../components/CameraSummary'), { ssr: false });
const MediaGallery = dynamic(() => import('../../components/MediaGallery'), { ssr: false });
const TabbedGallery = dynamic(() => import('../../components/TabbedGallery'), { ssr: false });

export default function CameraPage({ metadata, slug, rawMetadata, parsedMetadata, services, ...props }) {

    // create tabs for TabbedGallery based on services in the asset
    const availTabs = services.map((service) => {
        return {
            key: service.common.slug,
            label: service.common.label,
            serviceUuid: service.uuid,
            icon:
                service.svcType === 'img' ? (
                    <IconCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />
                ) : (
                    <IconVideoCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />
                ),
            galleryComponent: (date, empty) => {
                return (
                    <MediaGallery
                        key={`${slug}-${date.toISOString()}-${service.uuid}`}
                        serviceUuid={service.uuid}
                        selectedDate={date}
                        timezone={parsedMetadata.timezone}
                        empty={empty}
                        iconComponent={
                            service.svcType === 'img' ? (
                                <IconCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />
                            ) : (
                                <IconVideoCamera size={4} extraClasses='inline-block pr-1 align-bottom' paddingx={0} />
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

    // if gallery the querystring, select the tab

    // BIG NOTE: this page will load twice (maybe only in dev mode?), and the first time through
    // the router is not "ready", which means the querystring params are not available. Because we
    // want to set the selectedTab of the TabbedGallery component from here, and that's setting initial
    // internal state from a passed in prop, we need to wait for it to be ready.  Docs warn us against
    // conditional rendering from router.isReady (due to SSR, I guess?) and say to only use router.isReady
    // in a useEffect, so we do that and set the startTab state.

    // see: https://github.com/vercel/next.js/discussions/11484
    //      https://github.com/vercel/next.js/discussions/11484#discussioncomment-1867578

    const [startTab, setStartTab] = useState(undefined);

    const router = useRouter();

    useEffect(() => {
        if (router.isReady && availTabs.length) {
            if (router.query.gallery) {
                const keys = new Set(availTabs.map(at => at.key));
                if (keys.has(router.query.gallery)) {
                    setStartTab(router.query.gallery);
                } else {
                    // gallery queryarg exists but is invalid? remove it from the route
                    const { gallery, ...rest } = router.query;
                    router.replace({
                        pathname: router.pathname,
                        query: rest,
                    })

                    setStartTab(availTabs[0].key)
                }
            } else {
                // no gallery slug, use the first available
                setStartTab(availTabs[0].key)
            } 
        }
    }, [router.query, availTabs])


    // event handler for when tabbed gallery active tab changes, update URL
    const onTabChanged = (key) => {
        router.push({
            pathname: router.pathname,
            query: {
                ...router.query,
                gallery: key
            }
        },
        undefined,
        {
            scroll: false,
            shallow: true
        })
    }

    // console.info("PAGE GONNA RENDER", startTab);

    return (
        <Page metadata={metadata} title={parsedMetadata.label}>
            <Section>
                <SectionHeader>
                    <a className='text-primary hover:underline' href='/cameras/'>
                        Cameras
                    </a>{' '}
                    | {parsedMetadata.label}
                </SectionHeader>
                <CameraSummary {...parsedMetadata} />

                {startTab && (
                    <TabbedGallery
                        availTabs={availTabs}
                        timezone={parsedMetadata.timezone}
                        apiUrl={process.env.NEXT_PUBLIC_WEBCOOS_API_URL || 'https://app.stage.webcoos.org/webcoos/api'}
                        selectedTab={startTab}
                        onTabChanged={onTabChanged}
                    />
                )}

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
    const apiUrl = process.env.NEXT_PUBLIC_WEBCOOS_API_URL || 'https://app.stage.webcoos.org/webcoos/api',
        apiVersion = 'v1',
        source = 'webcoos';

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
