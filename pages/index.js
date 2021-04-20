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
                    <h2 className='text-2xl font-bold mb-4'>Example custom section</h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4'>
                        {content.sections.partners.map((partner) => (
                            <img key={partner.name} alt={partner.name} className='rounded-xl' src={partner.image} />
                        ))}
                    </div>
                </section>
            </div>
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
