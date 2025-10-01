import type { ReactElement } from "react"
import YAML from "@Layouts/YAML"
import type { HomePage } from "@/types/yaml/home"
import MarkdownContent from "@Components/MarkdownContent"
import Page  from "@Components/Page";
import Section from "@Components/Section/Section";
import { Link } from "react-router";


function onLinkClick(event: React.MouseEvent<HTMLAnchorElement>, location: string) {
    if (location && location.startsWith('#')) {
        event.preventDefault();
        if (document) {
            const scrollEl = document.getElementById(location.slice(1))
            if (scrollEl) {
                scrollEl.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    }
}


const HomePageContent = (content: HomePage) => {
    return (
        <Page>
            <Section>
                    <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex-grow md:pr-4 flex flex-col gap-4">
                    <h1 className="text-4xl">{content.sections.hero.title}</h1>
                    {content.sections.hero.subtitle && <p className="text-xl">{content.sections.hero.subtitle}</p>}
                    {content.sections.hero.markdownContent && <MarkdownContent children={content.sections.hero.markdownContent} />}

                    <div className='grid grid-cols-2'>
                    {content.sections.hero.icons.map((icon, ii) => {
                        return (
                            <div key={ii} className='flex flex-row items-center'>
                                <img src={icon.img} className='w-32 h-32' alt={icon.label} />
                                <div className='capitalize text-[var(--color-primary)] font-semibold ml-2'>{icon.label}</div>
                            </div>
                        );
                    })}
                </div>

                    <div className="flex flex-wrap">
                        {content.sections.hero.buttons &&
                            content.sections.hero.buttons.map((button) => {
                                const buttonClass = 'block text-center uppercase tracking-wide text-base md:text-sm border-2 rounded-md px-6 py-3 border-[var(--color-primary)] text-[var(--color-primary)]'
                                return (
                                    <a
                                        className="mr-4 mb-4"
                                        key={button.label}
                                        href={button.to}
                                        onClick={(event) => onLinkClick(event, button.to)}
                                    >
                                        <div className={buttonClass}>{button.label}</div>
                                    </a>
                                );
                            })}
                    </div>
                </div>
                <img
                    className={`flex-shrink-0 object-contain w-full md:w-1/2 mt-4 md:mt-0 ${content.sections.hero.imageClassName}`}
                    src={content.sections.hero.image}
                    alt={content.sections.hero.imageAltText}
                />
            </div>

            </Section>
            <Section shaded={true}>
                    <h2 className="text-2xl font-bold mb-4">Cameras</h2>
                    <div className='h-[500px] bg-white bg-opacity-50 p-4'>
                        Map
                </div>

            </Section>
            <Section>
                <h2 className="text-2xl font-bold mb-4">News</h2>
                <div className='grid xl:grid-cols-3 md:grid-cols-2 gap-4'>
                    {content.sections.news.map((item, ii) => {
                        return (
                            <div
                                key={ii}
                                className='flex-grow flex-shrink-0 flex flex-col gap-2'
                                style={{ flexBasis: 0 }}
                            >

                                <Link to={item.link} target='_blank' className='self-center'>
                                    <img
                                        src={item.image}
                                        alt={item.imageAltText}
                                        className='rounded-xl shadow border border-gray-400'
                                        style={{ height: '12em' }}
                                    />
                                </Link>

                                <div className='text-xs italic'>
                                    {item.date}
                                </div>

                                <div className='text-lg font-semibold' style={{ minHeight: '3.5em' }}>
                                    {item.title}
                                </div>

                                <MarkdownContent children={item.content} />

                                <Link to={item.link} target='_blank' className='text-primary hover:underline'>
                                    Read More.
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </Section>
        </Page>
    )
}

const Home = (): ReactElement => {
    return (
        <YAML<HomePage> 
            yamlFile="/yaml_content/home.yaml" 
            Component={HomePageContent} 
            />
    )
}

export default Home