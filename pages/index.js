import {
    HeroSection,
    NarrativeSection,
    PartnerLogos,
    Section,
    SectionHeader
} from '@axds/landing-page-components';
import Page from '../components/Page';
import { getSiteMetadata, getYaml } from '../utils';

import dynamic from 'next/dynamic';

const WebCOOSMap = dynamic(
    () => (
        import('../components/WebCOOSMap')
    ), { ssr: false })

export default function Home({ content, metadata, cameras }) {
    return (
        <Page metadata={metadata}>
            <HeroSection {...content.sections.hero} />

            <Section shaded={true}>
                <SectionHeader>Cameras</SectionHeader>
                <WebCOOSMap
                    longitude={-75.8139}
                    latitude={36.3388}
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    apiUrl='https://app.stage.webcoos.org/webcoos/api'
                    token='219ec2bd77f37ce8bbb12e4c08a7b62bd506a7d3'
                    stationSlugs={cameras.cameras.active}
                />
            </Section>

            <Section>
                <SectionHeader>Project Partners</SectionHeader>
                <PartnerLogos partners={content.sections.partners} maxBoxesPerRow={7} imageHeight='sm' />
            </Section>

            <NarrativeSection shaded={true} {...content.sections.funding} />
        </Page>
    );
}

export async function getStaticProps() {
    return {
        props: {
            metadata: await getSiteMetadata(),
            content: await getYaml('home.yaml'),
            cameras: await getYaml('cameras.yaml')
        },
    };
}
