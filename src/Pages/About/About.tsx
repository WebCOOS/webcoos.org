import type { About as AboutType } from './types';
import  Section from '@Components/Section/Section';
import NarrativeSection from './NarrativeSection';
import  SectionHeader  from '@Components/Section/SectionHeader';
import type { ReactElement } from 'react';
import YAML from '@Layouts/YAML';
import Page from '@Components/Page';
import { PartnerLogos } from './PartnerLogos';

const AboutContent = (about: AboutType): ReactElement => {
    const content = about;
    return (
        <>
        <title>{about.sections.main.title}</title>
        <Page>
            <NarrativeSection
                {...content.sections.main}
            />

            <Section shaded={true}>
                <SectionHeader>Project Partners</SectionHeader>
                <PartnerLogos partners={content.sections.partners} maxBoxesPerRow={8} imageHeight='sm' />
            </Section>

            <NarrativeSection shaded={false} {...content.sections.contact} />
            <NarrativeSection shaded={true} {...content.sections.funding} />
        </Page>
        </>
    );
}

const About = (): ReactElement => {
    return <>
    
        <YAML<AboutType>
            yamlFile="/yaml_content/about.yaml"
            Component={AboutContent}
        />
    </>
}

export default About

