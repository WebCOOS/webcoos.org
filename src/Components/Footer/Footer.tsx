import { type ReactElement, useContext } from "react";
import { FooterContact } from "./FooterContact";
import { FooterLinkList } from "./FooterLinkList";
import { FooterLogo } from "./FooterLogo";
import SiteContext from "@/state/SiteContext";

function Footer(): ReactElement {
    const footer = useContext(SiteContext)?.footer
    if(footer === undefined) {
        return <></>
    }

    return (
        <footer className="bg-primary text-white">
            <div className="container mx-auto p-8">
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <FooterLogo logoImageSrc={footer.logoImage} logoAlt={footer.logoAltText} />
                    <FooterContact {...footer.contact} />
                    {footer.linkLists && footer.linkLists.map((list) => (
                        <FooterLinkList key={list.title} {...list} />
                    ))}
                </div>
            </div>
        </footer>
    );
}

export default Footer;