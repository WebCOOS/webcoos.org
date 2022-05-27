import { useMemo } from 'react';
import { HeroSection, NarrativeSection, PartnerLogos, Section, SectionHeader } from '@axds/landing-page-components';
import Page from '../../components/Page';

import { getSiteMetadata, getYaml } from '../../utils';
import { parseWebCOOSAsset } from '../../components/utils/webCOOSHelpers';

import dynamic from 'next/dynamic';

// const CameraSummary = dynamic(() => import('../../components/CameraSummary'), { ssr: false });
// const StillsGallery = dynamic(() => import('../../components/StillsGallery'), { ssr: false });
const CameraLandingSection = dynamic(() => import('../../components/CameraLandingSection'), { ssr: false });
const WebCOOSMap = dynamic(() => import('../../components/WebCOOSMap'), { ssr: false });

const apiUrl = 'https://app.stage.webcoos.org/webcoos/api',
    apiVersion = 'v1',
    source = 'webcoos';

export default function CommunityPage({ metadata, community, communityMetadata, ...props }) {
    return (
        <Page metadata={metadata} title={community}>
            <Section>
                <SectionHeader>
                    <a className='text-primary hover:underline' href='/communities/'>
                        Communities
                    </a>{' '}
                    | {community}
                </SectionHeader>
            </Section>

            {communityMetadata.content?.hero && <HeroSection {...communityMetadata.content.hero} />}

            <Section>
                <WebCOOSMap
                    apiUrl='https://app.stage.webcoos.org/webcoos/api'
                    apiVersion='v1'
                    token='219ec2bd77f37ce8bbb12e4c08a7b62bd506a7d3'
                    source='webcoos'
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    stationSlugs={communityMetadata.cameras}
                    mapHeight={250}
                />

                <CameraLandingSection
                    apiUrl='https://app.stage.webcoos.org/webcoos/api'
                    apiVersion='v1'
                    token='219ec2bd77f37ce8bbb12e4c08a7b62bd506a7d3'
                    source='webcoos'
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    stations={communityMetadata.cameras}
                />
            </Section>
        </Page>
    );
}

export async function getStaticPaths() {
    const cameraData = await getYaml('cameras.yaml'),
        communityNames = Object.keys(cameraData.cameras.communities);

    return {
        paths: communityNames.map((community) => ({
            params: {
                community,
            },
        })),
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const cameraData = await getYaml('cameras.yaml'),
        communityMetadata = cameraData.cameras.communities[params.community];

    return {
        props: {
            metadata: await getSiteMetadata(),
            community: params.community,
            communityMetadata: communityMetadata,
        },
    };
}