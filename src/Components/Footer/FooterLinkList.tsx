import  { type ReactElement } from 'react';
import { Link } from 'react-router';

function FooterLinkList({ title, links }: {
    title: string;
    links: Array<{
        label: string;
        to: string;
    }>;
}): ReactElement {
    return (
        <div>
            <div className="font-bold">{title}</div>
            <ul>
                {links.map((link) => (
                    <li key={link.label}>
                        <Link to={link.to}>{link.label}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export { FooterLinkList };
