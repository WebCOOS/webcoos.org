import { type ReactElement, type ReactNode } from 'react';
import { LocationMarkerIcon, PhoneIcon, MailIcon } from '@heroicons/react/solid';

function FooterContactRow(
    { 
        icon, 
        children 
    }: 
    { 
        icon?: ReactNode; 
        children: ReactNode 
    }
): ReactElement {
    return (
        <div className="flex">
            <div className="flex-grow-0 mr-1">{icon}</div>
            <div className="flex-grow not-italic whitespace-pre">{children}</div>
        </div>
    );
}

function FooterContact({ 
    name, address, tel, email 
}: { 
    name?: string; 
    address?: string; 
    tel?: string; 
    email?: string; 
}): ReactElement {
    return (
        <div className="flex flex-col">
            {name && (
                <FooterContactRow>
                    <span className="font-bold">{name}</span>
                </FooterContactRow>
            )}
            {address && (
                <FooterContactRow icon={<LocationMarkerIcon className='h-5 w-5' />}>
                    {address}
                </FooterContactRow>
            )}
            {tel && <FooterContactRow icon={<PhoneIcon className='h-5 w-5' />}>{tel}</FooterContactRow>}
            {email && (
                <FooterContactRow icon={<MailIcon className='h-5 w-5' />}>
                    <a href={`mailto:${email}`}>{email}</a>
                </FooterContactRow>
            )}
        </div>
    );
}

export { FooterContact };
