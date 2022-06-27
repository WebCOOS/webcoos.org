import { NarrativeSection, PartnerLogos, Section, SectionHeader } from '@axds/landing-page-components';
import Page from '../components/Page';
import { getSiteMetadata, getYaml } from '../utils';

export default function Home({ content, metadata, cameras }) {
    return (
        <Page metadata={metadata}>
            <NarrativeSection {...content.sections.main} />

            <NarrativeSection shaded={true} {...content.sections.contact} />

            <Section>
                <SectionHeader>Project Partners</SectionHeader>
                <PartnerLogos partners={content.sections.partners} maxBoxesPerRow={7} imageHeight='sm' />
            </Section>
        </Page>
    );
}

export async function getStaticProps() {
    return {
        props: {
            metadata: await getSiteMetadata(),
            content: await getYaml('about.yaml'),
        },
    };
}
