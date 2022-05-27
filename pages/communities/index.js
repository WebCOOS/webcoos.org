import { HeroSection, NarrativeSection, PartnerLogos, Section, SectionHeader } from '@axds/landing-page-components';
import Page from '../../components/Page';
import { getSiteMetadata, getYaml } from '../../utils';

// import dynamic from 'next/dynamic';

// const WebCOOSMap = dynamic(() => import('../../components/WebCOOSMap'), { ssr: false });

export default function Communities({ communities, metadata }) {
    return (
        <Page metadata={metadata} title='Communities'>
            <Section>
                <SectionHeader>Communities</SectionHeader>
            </Section>
            <Section>
                <div className='flex gap-4'>
                    {Object.keys(communities).map((c) => {
                        return (
                            <a
                                key={c}
                                href={`/communities/${c}`}
                                className='block p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
                            >
                                <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
                                    {c}
                                </h5>
                                <p className='font-normal text-gray-700 dark:text-gray-400'>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas tristique quam nec
                                    lacus sagittis feugiat. Phasellus commodo urna sed lorem tempus tristique nec
                                    egestas mi. Phasellus mollis cursus viverra.
                                </p>
                            </a>
                        );
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
            communities: (await getYaml('cameras.yaml')).cameras.communities,
        },
    };
}
