import { HeroSection, NarrativeSection, PartnerLogos, Section, SectionHeader } from '@axds/landing-page-components';
import Page from '../../components/Page';
import { getSiteMetadata, getYaml } from '../../utils';

import dynamic from 'next/dynamic';

const WebCOOSMap = dynamic(
    () => import('../../components/WebCOOSMap'),
    { ssr: false }
);

export default function Cameras({ content, metadata }) {
    return (
        <Page metadata={metadata}>
            <Section>
                <SectionHeader>Cameras</SectionHeader>
                <WebCOOSMap
                    longitude={-75.8139}
                    latitude={36.3388}
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                    apiUrl='https://app.stage.webcoos.org/webcoos/api'
                    token='219ec2bd77f37ce8bbb12e4c08a7b62bd506a7d3'
                    stationSlugs={[
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
                    ]}
                />
            </Section>
        </Page>
    );
}

export async function getStaticProps() {
    return {
        props: {
            metadata: await getSiteMetadata(),
            content: await getYaml('home.yaml'),
        },
    };
}
