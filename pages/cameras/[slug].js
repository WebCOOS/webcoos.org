import { useMemo } from 'react';
import { HeroSection, NarrativeSection, PartnerLogos, Section, SectionHeader } from '@axds/landing-page-components';
import Page from '../../components/Page';

import { getSiteMetadata, getYaml } from '../../utils';
import { parseWebCOOSAsset } from '../../components/utils/webCOOSHelpers';

import dynamic from 'next/dynamic';

const CameraSummary = dynamic(() => import('../../components/CameraSummary'), { ssr: false });
const StillsGallery = dynamic(() => import('../../components/StillsGallery'), { ssr: false });

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

                {serviceUuid && (
                    <div className='my-4'>
                        <StillsGallery
                            apiUrl={apiUrl}
                            apiVersion={apiVersion}
                            token={process.env.NEXT_PUBLIC_WEBCOOS_API_TOKEN}
                            serviceUuid={serviceUuid}
                        />
                    </div>
                )}
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

    // FIXME: no filter for slug? have to filter it client-side
    const allMetadataResponse = await fetch(`${apiUrl}/${apiVersion}/assets/?source=${source}&_nocache=true`, {
            headers: {
                Authorization: `Token ${process.env.NEXT_PUBLIC_WEBCOOS_API_TOKEN}`,
                Accept: 'application/json',
            },
        }),
        allMetadataResult = await allMetadataResponse.json(),
        cameraMetadata = allMetadataResult.results.find((cr) => cr.data.common.slug === params.slug),
        parsedMetadata = parseWebCOOSAsset(cameraMetadata),
        sanitized = Object.fromEntries(
            Object.entries(parsedMetadata).map((p) => {
                return [p[0], p[1] === undefined ? null : p[1]];
            })
        );

    return {
        props: {
            metadata: await getSiteMetadata(),
            slug: params.slug,
            rawMetadata: cameraMetadata,
            parsedMetadata: sanitized,
        },
    };
}
