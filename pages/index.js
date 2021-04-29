import { HeroSection } from '@axds/landing-page-components';
import Page from '../components/Page';
import { getSiteMetadata, getYaml } from '../utils';

export default function Home({ content, metadata }) {
    return (
        <Page metadata={metadata}>
            {/* Pages can be built by composing common components from the
              * @axds/landing-page-components package
              */}
            <HeroSection {...content.sections.hero} />

            {/* Along with custom components and markup, possibly driven by YAML configuration
              * as shown here. Feel free to remove any of the starter content which is not needed
              * for your page.
             */}
            <div className='bg-primary-lighter'>
                <section className='container mx-auto p-4 py-12'>
                    <h2 className='text-2xl font-bold mb-8'>Project Partners</h2>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8'>
                        {content.sections.partners.map((partner) => (
                            <a key={partner.name} href={partner.link} className='flex flex-col justify-between bg-white shadow-sm border rounded p-4'>
                                <img alt={partner.name} className='flex-grow object-contain mx-auto max-h-24 mb-2' src={partner.image} />
                                {partner.name}
                            </a>
                        ))}
                    </div>
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
