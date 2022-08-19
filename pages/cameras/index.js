import { HeroSection, NarrativeSection, PartnerLogos, Section, SectionHeader } from '@axds/landing-page-components';
import Page from '../../components/Page';
import { getSiteMetadata, getYaml } from '../../utils';

import Link from 'next/link';
import dynamic from 'next/dynamic';

const CameraLandingSection = dynamic(() => import('../../components/CameraLandingSection'), { ssr: false });

export default function Cameras({ cameras, metadata }) {
    return (
        <Page metadata={metadata} title='Cameras'>
            <Section>
                <SectionHeader>Cameras</SectionHeader>
                <CameraLandingSection
                    stations={cameras.cameras.active}
                    cameraSvcDataLink={(cameraSlug, cameraSvcProps) => {
                        return (
                            <Link
                                key={cameraSvcProps.common.slug}
                                href={`/cameras/${cameraSlug}?gallery=${cameraSvcProps.common.slug}`}
                            >
                                <a className='block bg-primary hover:bg-primary-darker text-white hover:bg-primary-lighter border border-primary-darker p-2'>
                                    {cameraSvcProps.common.label}
                                </a>
                            </Link>
                        );
                    }}
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
