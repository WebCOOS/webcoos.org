import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as duration from 'duration-fns';

import { Section, SectionHeader } from '@axdspub/landing-page-components';
import Page from '../../components/Page';

import { getSiteMetadata  } from '../../utils';
import { parseWebCOOSAsset, getAPIAssets } from '../../components/utils/webCOOSHelpers';
import { IconCamera, IconVideoCamera } from '../../components/Icon';

import dynamic from 'next/dynamic';

const CameraSummary = dynamic(() => import('../../components/CameraSummary'), { ssr: false });
const MediaGallery = dynamic(() => import('../../components/MediaGallery'), { ssr: false });
const TabbedGallery = dynamic(() => import('../../components/TabbedGallery'), { ssr: false });

export default function CameraPage({ metadata, slug, rawMetadata, parsedMetadata, services, ...props }) {

    // create tabs for TabbedGallery based on services in the asset
    const availTabs = services.map((service) => {
        // If the value parses to “more than one instance per day” (< PT1D) it should show a day picker
        // If the value parses to “one per day or less frequency than one per day” (>= PT1D), the UI should update to be a Year/Month selector and display all Elements for a given Month in the same paginated Gallery.
        // If properties.frequency.type is static the Element objects in a service should just be listed out a table/list. This means they are not based on a date or time and are really just static resources or things that were produced once. No calendar selector is required and there should be a limited amount of Element objects in this Service.

        let datePickerType = null;

        if (service.frequency.type === 'periodic') {
            // convert period to day
            const svcDayFreq = duration.toDays(service.frequency.period);
            // console.info("periodidc freq in days", svcDayFreq, service.common.slug);
            if (svcDayFreq >= 1) {
                datePickerType = 'monthly';
            } else {
                datePickerType = 'daily';
            }
        }

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
            inventoryName: datePickerType,
            galleryComponent: (date, empty) => {
                const k = !!date ? (date.start || date).toISOString() : 'any';

                return (
                    <MediaGallery
                        key={`${slug}-${k}-${service.uuid}`}
                        serviceUuid={service.uuid}
                        selectedDate={date}
                        timezone={parsedMetadata.timezone}
                        empty={empty}
                        sortDescending={true}
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
                                <video className='object-contain' controls muted autoPlay playsInline>
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
    // want to set the selectedTab of the TabbedGallery component from here, it means two things:
    // we'll wait to render the TabbedGallery until we know if or not we have a gallery query arg,
    // and we have to take full control over the changing of tabs in TabbedGallery (by specifying a
    // onTabClick handler).  This page is considered a parent component and is responsible for the
    // selected tab shown in the control.  This page can then add history entries to the browser
    // so the back button will pick a previously selected tab, for instance.

    // see: https://github.com/vercel/next.js/discussions/11484
    //      https://github.com/vercel/next.js/discussions/11484#discussioncomment-1867578

    const [selectedTab, setSelectedTab] = useState(undefined);

    const router = useRouter();

    useEffect(() => {
        if (router.isReady && availTabs.length) {
            if (router.query.gallery) {
                const keys = new Set(availTabs.map(at => at.key));
                if (keys.has(router.query.gallery)) {
                    setSelectedTab(router.query.gallery);
                } else {
                    // gallery queryarg exists but is invalid? remove it from the route
                    const { gallery, ...rest } = router.query;
                    router.replace({
                        pathname: router.pathname,
                        query: rest,
                    })

                    setSelectedTab(availTabs[0].key)
                }
            } else {
                // no gallery slug, use the first available
                setSelectedTab(availTabs[0].key)
            }
        }
    }, [router.query])

    // event handler for when tabbed gallery active tab wants to change
    // pushes a new route onto the browser history stack and lets the useEffect handler
    // update the tab.
    const onTabClick = (key) => {
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

                {selectedTab && (
                    <TabbedGallery
                        availTabs={availTabs}
                        timezone={parsedMetadata.timezone}
                        apiUrl={process.env.NEXT_PUBLIC_WEBCOOS_API_URL || 'https://app.stage.webcoos.org/webcoos/api'}
                        selectedTab={selectedTab}
                        onTabClick={onTabClick}
                    />
                )}

                <div className='my-4 flex'></div>
            </Section>
        </Page>
    );
}

export async function getStaticPaths() {
    // pull live metadata from API
    try {
        const cameraMetadataResult = await getAPIAssets(),
            activeSlugs = cameraMetadataResult.results
            .map((r) => {
                const parsed = parseWebCOOSAsset(r);
                if (parsed?.access === 'public') {
                    return parsed.slug;
                }
                return null;
            })
            .filter((pm) => !!pm);

        console.info("Found", activeSlugs.length, "cameras with access_level public");

        return {
            paths: activeSlugs.map((slug) => ({
                params: {
                    slug,
                },
            })),
            fallback: false,
        };

    } catch (e) {
        if (e?.name === 'ResponseNotOkError') {
            // https://nextjs.org/docs/api-reference/data-fetching/get-static-props#notfound
            return {
                notFound: true,
            };
        }
        throw e;
    }
}

export async function getStaticProps({ params }) {
    try {
        const cameraMetadataResult = await getAPIAssets({ slug: params.slug }),
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
                services: parsedMetadata.galleryServices,
            },
        };
    } catch (e) {
        if (e?.name === 'ResponseNotOkError') {
            // https://nextjs.org/docs/api-reference/data-fetching/get-static-props#notfound
            return {
                notFound: true,
            };
        }
        throw e;
    }
}
