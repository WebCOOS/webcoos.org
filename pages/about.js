import { NarrativeSection, PartnerLogos, Section, SectionHeader } from '@axdspub/landing-page-components';
import Page from '../components/Page';
import { getSiteMetadata, getYaml } from '../utils';

export default function Home({ content, metadata, cameras }) {
    return (
        <Page metadata={metadata}>
            <NarrativeSection {...content.sections.main} />

            <Section shaded={true}>
                <SectionHeader>Project Partners</SectionHeader>
                <PartnerLogos partners={content.sections.partners} maxBoxesPerRow={8} imageHeight='sm' />
            </Section>

            <NarrativeSection shaded={false} {...content.sections.contact} />

            <NarrativeSection shaded={true} {...content.sections.funding} />
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
