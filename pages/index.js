import {
    HeroSection,
    NarrativeSection,
    PartnerLogos,
    Section,
    SectionHeader
} from '@axds/landing-page-components';
import Page from '../components/Page';
import { getSiteMetadata, getYaml } from '../utils';

export default function Home({ content, metadata }) {
    return (
        <Page metadata={metadata}>
            <HeroSection {...content.sections.hero} />

            <Section shaded={true}>
                <SectionHeader>Project Partners</SectionHeader>
                <PartnerLogos
                    partners={content.sections.partners}
                    maxBoxesPerRow={7}
                    imageHeight='sm'
                />
            </Section>

            <NarrativeSection {...content.sections.funding} />
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
