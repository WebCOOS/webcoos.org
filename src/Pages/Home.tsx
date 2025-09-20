import type { ReactElement } from "react"
import YAML from "../Layouts/YAML"
import type { HomePage } from "../types/yaml"
import MarkdownContent from "../Components/MarkdownContent"


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
        <div className='min-h-full'>
            <section>
                <div className='container mx-auto p-4 py-12'>
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
                                <div className='capitalize text-primary font-semibold ml-2'>{icon.label}</div>
                            </div>
                        );
                    })}
                </div>

                    <div className="flex flex-wrap">
                        {content.sections.hero.buttons &&
                            content.sections.hero.buttons.map((button) => {
                                const buttonClass = 'block text-center uppercase tracking-wide text-base md:text-sm border-2 rounded-md px-6 py-3 border-primary'
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

                </div>
            </section>
        </div>
    )
}

const Home = (): ReactElement => {
    return (
        <YAML 
            yamlFile="/page_content/home.yaml" 
            Component={HomePageContent} 
            />
    )
}

export default Home