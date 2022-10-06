import {
    HeroSection,
    MarkdownContent,
    Section,
    SectionHeader
} from '@axds/landing-page-components';
import Page from '../components/Page';
import { getSiteMetadata, getYaml } from '../utils';
import { parseWebCOOSAsset, getAPIAssets } from '../components/utils/webCOOSHelpers';

import dynamic from 'next/dynamic';

const WebCOOSMap = dynamic(
    () => (
        import('../components/WebCOOSMap')
    ), { ssr: false })

export default function Home({ content, metadata, activeSlugs }) {
    return (
        <Page metadata={metadata}>
            <HeroSection {...content.sections.hero}>
                <div className='grid grid-cols-2'>
                    {content.sections.hero.icons.map((icon, ii) => {
                        return (
                            <div key={ii} className='flex flex-row items-center'>
                                <img src={icon.img} className='w-32 h-32' alt={icon.label} />
                                <div className='capitalize text-primary font-semibold ml-2'>{icon.label}</div>
                            </div>
                        );
                    })}
                </div>
            </HeroSection>

            <Section shaded={true}>
                <SectionHeader>Cameras</SectionHeader>
                <WebCOOSMap longitude={-75.8139} latitude={36.3388} stationSlugs={activeSlugs} />
            </Section>

            <Section>
                <SectionHeader>News</SectionHeader>
                <div className='flex gap-4'>
                    {content.sections.news.map((item, ii) => {
                        return (
                            <div
                                key={ii}
                                className='flex-grow flex-shrink-0 flex flex-col gap-4'
                                style={{ flexBasis: 0 }}
                            >
                                <a href={item.link} target='_blank' className='self-center'>
                                    <img
                                        src={item.image}
                                        alt={item.imageAltText}
                                        className='rounded-xl shadow border border-gray-400'
                                    />
                                </a>

                                <div className='text-lg font-semibold' style={{ minHeight: '3.5em' }}>
                                    {item.title}
                                </div>

                                <MarkdownContent children={item.content} />

                                <a href={item.link} target='_blank' className='text-primary hover:underline'>
                                    Read More.
                                </a>
                            </div>
                        );
                    })}
                </div>
            </Section>
        </Page>
    );
}

export async function getStaticProps() {
    try {
        const cameraMetadataResult = await getAPIAssets(),
            activeSlugs = cameraMetadataResult.results
                .map((r) => {
                    const parsed = parseWebCOOSAsset(r);
                    if (parsed?.access === 'public') {
                        return parsed.slug;
                    }
                    return null;
                })
                .filter((pm) => !!pm);

        return {
            props: {
                metadata: await getSiteMetadata(),
                content: await getYaml('home.yaml'),
                activeSlugs: activeSlugs,
            },
        };
    } catch (e) {
        if (e?.name === 'ResponseNotOkError') {
            // https://nextjs.org/docs/api-reference/data-fetching/get-static-props#notfound
            return {
                notFound: true,
            };
        }
        throw e;
    }
}
