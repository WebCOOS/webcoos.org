import { utils } from '@axdspub/axiom-ui-utilities';
import { type ReactElement } from 'react';
import type { SectionParams } from './types';

function Section({ 
    shaded = false, 
    className, 
    children, 
    ...rest
 }: SectionParams): ReactElement {

    const sectionClass = utils.makeClassName({
        className,
        extras: [shaded ? 'bg-[var(--color-primary-lighter)]' : undefined]
    })
    return (
        <section className={sectionClass} {...rest}>
            <div className='container mx-auto p-4 py-12'>
                {children}
            </div>
        </section>
    );
}

export default Section
