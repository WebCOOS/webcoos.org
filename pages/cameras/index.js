import { HeroSection, NarrativeSection, PartnerLogos, Section, SectionHeader } from '@axds/landing-page-components';
import Page from '../../components/Page';
import { getSiteMetadata, getYaml } from '../../utils';

import dynamic from 'next/dynamic';

const CameraLandingSection = dynamic(() => import('../../components/CameraLandingSection'), { ssr: false });

export default function Cameras({ cameras, metadata }) {
    return (
        <Page metadata={metadata} title='Cameras'>
            <Section>
                <SectionHeader>Cameras</SectionHeader>
                <CameraLandingSection
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    apiUrl={process.env.NEXT_PUBLIC_WEBCOOS_API_URL || 'https://app.stage.webcoos.org/webcoos/api'}
                    token={process.env.NEXT_PUBLIC_WEBCOOS_API_TOKEN}
                    apiVersion='v1'
                    source='webcoos'
                    stations={cameras.cameras.active}
                />
            </Section>
        </Page>
    );
}

export async function getStaticProps() {
    return {
        props: {
            metadata: await getSiteMetadata(),
            cameras: await getYaml('cameras.yaml'),
        },
    };
}
