import { type ReactElement } from 'react';

function FooterLogo({ 
    logoImageSrc, 
    logoAlt 
}: {
    logoImageSrc: string;
    logoAlt: string;
}): ReactElement {
    return (
        <div className="flex">
            <img className="object-contain max-w-full max-h-36" src={logoImageSrc} alt={logoAlt} />
        </div>
    );
}

export { FooterLogo };
