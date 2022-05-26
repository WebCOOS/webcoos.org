import { HeroSection, NarrativeSection, PartnerLogos, Section, SectionHeader } from '@axds/landing-page-components';
import Page from '../../components/Page';

// import { getSiteMetadata, getYaml } from '../../utils';
import { getSiteMetadata } from '../../utils';
import { parseWebCOOSAsset } from '../../components/utils/webCOOSHelpers';

import dynamic from 'next/dynamic';

const CameraSummary = dynamic(
    () => import('../../components/CameraSummary'),
    { ssr: false }
);

export default function CameraPage({ metadata, slug, parsedMetadata, ...props }) {
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
            </Section>
        </Page>
    );
}

export async function getStaticPaths() {
    // if wanted: pull this from the asset api

    // @TODO: pull from site.yaml?
    const cameraSlugs = [
        'buxton',
        'cherrypier_north',
        'cherrypier_south',
        'currituck_hampton_inn',
        'currituck_sailfish',
        'follypier_north',
        'follypier_south',
        'miami40th',
        'northinlet',
        'oakisland_east',
        'oakisland_west',
        'staugustinepier',
        'twinpier',
    ];

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
    const apiUrl = 'https://app.stage.webcoos.org/webcoos/api',
        apiVersion = 'v1',
        source = 'webcoos';

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
            Object.entries(parsedMetadata).map(p => {
                return [
                    p[0],
                    p[1] === undefined ? null : p[1]
                ]
            })
        )

    return {
        props: {
            metadata: await getSiteMetadata(),
            slug: params.slug,
            parsedMetadata: sanitized,
        },
    };
}
