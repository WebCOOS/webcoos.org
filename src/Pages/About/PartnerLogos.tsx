import type { Partner } from './types';
import { utils } from '@axdspub/axiom-ui-utilities';

function PartnerLogos({
    partners,
    maxBoxesPerRow = 6,
    boxed = true,
    showName = true,
    imageHeight = 'md'
}: {
    partners: Partner[];
    maxBoxesPerRow?: number;
    boxed?: boolean;
    showName?: boolean;
    imageHeight?: 'sm' | 'md' | 'lg';
}) {
    const containerClassOptions: Record<string, boolean> = {
        'grid grid-cols-2 md:grid-cols-3 gap-8': boxed,
        'flex flex-wrap': !boxed,
        'lg:grid-cols-3': boxed && maxBoxesPerRow <= 3,
        'lg:grid-cols-4': boxed && maxBoxesPerRow === 4,
        'lg:grid-cols-5': boxed && maxBoxesPerRow === 5,
        'lg:grid-cols-6': boxed && maxBoxesPerRow === 6,
        'lg:grid-cols-7': boxed && maxBoxesPerRow === 7,
        'lg:grid-cols-8': boxed && maxBoxesPerRow === 8,
        'lg:grid-cols-9': boxed && maxBoxesPerRow === 9,
        'lg:grid-cols-10': boxed && maxBoxesPerRow >= 10,
    }
    const containerClass =  Object.keys(containerClassOptions).filter(key => containerClassOptions[key]).join(' ')
    
    const linkClass = utils.makeClassName({
        defaultClassName: 'flex flex-col justify-between', 
        className: boxed ? 'bg-white shadow-sm border rounded p-4' : 'mr-20 mb-4'
    });
    const imageClass = utils.makeClassName({
        defaultClassName: 'flex-grow object-contain mx-auto mb-2', 
        className: imageHeight === 'sm'
            ? 'max-h-24'
            : imageHeight === 'md' 
                ? 'max-h-32' 
                : imageHeight === 'lg' 
                    ? 'max-h-40'
                    : undefined
    });
    return (
        <div className={containerClass}>
            {partners.map((partner) => (
                <a key={partner.name} href={partner.link} className={linkClass}>
                    <img alt={partner.name} className={imageClass} src={partner.image} />
                    {showName && partner.name}
                </a>
            ))}
        </div>
    );
}

export { PartnerLogos };
