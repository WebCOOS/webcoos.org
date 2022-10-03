import { NarrativeSection, Section, SectionHeader } from '@axds/landing-page-components';
import Page from '../components/Page';
import ProductCard from '../components/ProductCard';
import { getSiteMetadata, getYaml } from '../utils';

export default function Products({ content, metadata }) {
    return (
        <Page metadata={metadata}>
            <NarrativeSection {...content.sections.main} />

            <Section className="-mt-24">
                <SectionHeader className='text-primary-darker'>Coming Soon:</SectionHeader>
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                    {content.sections.products.map((p) => {
                        return <ProductCard key={p.label} {...p} />;
                    })}
                </div>
            </Section>
        </Page>
    );
}

export async function getStaticProps() {
    return {
        props: {
            metadata: await getSiteMetadata(),
            content: await getYaml('products.yaml'),
        },
    };
}
