import { utils } from '@axdspub/axiom-ui-utilities';
import Section  from '@Components/Section/Section';
import SectionHeader  from '@Components/Section/SectionHeader';
import MarkdownContent from '@Components/MarkdownContent';
import type { AboutSection } from './types';

const NarrativeSection = ({ 
        title, 
        rows, 
        imageClassName, 
        shaded 
    }: AboutSection & {shaded?: boolean} ) => {
    return (
        <Section shaded={shaded}>
            <SectionHeader>{title}</SectionHeader>
            {
                rows.map((row, idx) => {
                    const hasImage = !!row.image;
                    const wrapperClass = utils.makeClassName({
                        defaultClassName: 'flex flex-col mt-12 mb-24 justify-between items-center', 
                        className: hasImage ? 'md:flex-row': undefined
                    });
                    const contentColClass = utils.makeClassName({
                        defaultClassName: 'w-full', 
                        extras: [
                            hasImage ? 'md:w-6/12' : undefined,
                            hasImage && idx % 2 !== 0 ? 'md:order-last' : undefined
                        ]
                    });
                    const imageColClass = utils.makeClassName({
                        defaultClassName: 'w-full md:w-5/12 relative'
                    });
                    return (
                        <div key={idx} className={wrapperClass}>
                            <div className={contentColClass}>
                                <MarkdownContent className='max-w-full'>
                                    {row.content}
                                </MarkdownContent>
                            </div>
                            {hasImage && (
                                <div className={imageColClass}>
                                    <img
                                        className={imageClassName}
                                        alt={row.imageAltText || row.image}
                                        src={row.image}
                                    />{
                                        row.imageCaption && (
                                            <MarkdownContent className='prose-sm max-w-full'>
                                                {row.imageCaption}
                                            </MarkdownContent>
                                        )
                                    }
                                </div>
                            )}
                        </div>
                    )
                })
            }
        </Section>
    );
}

export default NarrativeSection;
