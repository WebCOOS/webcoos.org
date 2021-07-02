import { HeroSection, PartnerLogos } from '@axds/landing-page-components';
import Page from '../components/Page';
import { getSiteMetadata, getYaml } from '../utils';

export default function Home({ content, metadata }) {
    return (
        <Page metadata={metadata}>
            {/* Pages can be built by composing common components from the
              * @axds/landing-page-components package
              */}
            <HeroSection {...content.sections.hero} />

            <div className='bg-primary-lighter'>
                <section className='container mx-auto p-4 py-12'>
                    <h2 className='text-2xl font-bold mb-8'>Project Partners</h2>
                    <PartnerLogos
                        partners={content.sections.partners}
                        maxBoxesPerRow={7}
                        imageHeight='sm'
                    />
                </section>
            </div>

            <section className='container mx-auto p-4 py-12'>
                <h2 className='text-2xl font-bold mb-8'>Project Funding</h2>
                <p>
                    This project is funded by the NOAA U.S. Integrated Ocean Observing System’s
                    (IOOS®) Ocean Technology Transition grant.
                </p>
            </section>
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
