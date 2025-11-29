import { useContext, useEffect, useState, type ReactElement } from "react"
import Nav from "./Nav"
import SiteContext from "@/state/SiteContext"
import { Link } from "react-router"

const Header = (): ReactElement => {
    const siteContext = useContext(SiteContext)

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) { // Adjust 50px as your desired scroll threshold
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    if (siteContext === undefined) {
        return (<></>)
    }

    const headerClassName = 'fixed top-0 right-0 left-0 bg-white flex flex-col md:flex-row md:items-center md:justify-between border-b-4 border-[var(--color-primary)] mb-4 z-30'
    const headerClassNameNotScrolled = 'p-4'
    const headerClassNameScrolled = 'shadow-lg transition-shadow duration-300 px-4 py-1'


    const imgClassName = 'object-contain'
    const imgClassNameNotScrolled = 'max-h-16 transition-all duration-100 mr-4'
    const imgClassNameScrolled = 'max-h-6 transition-all duration-100 mr-2'

    return (
        <header className={`${headerClassName} ${isScrolled ? headerClassNameScrolled : headerClassNameNotScrolled}`}>

            <div className="flex justify-between">
                <span className="flex items-center">
                    <Link to={siteContext.header.logoUrl}>
                        <img
                            className={`${imgClassName} ${isScrolled ? imgClassNameScrolled : imgClassNameNotScrolled}`}
                            src={isScrolled ? siteContext.header.logoImageSmall : siteContext.header.logoImage}
                            alt={siteContext.header.logoAltText}
                        />


                    </Link>
                    <Link to="/" className={isScrolled ? 'text-xl' : 'text-2xl'}>{siteContext.site.title}</Link>
                </span>
                <button type="button" className="block md:hidden p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
            </div>
            <Nav scrolled={isScrolled} />
        </header>
    )
}

export default Header