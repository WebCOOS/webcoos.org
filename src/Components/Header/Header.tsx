import { useContext, type ReactElement } from "react"
import Nav from "./Nav"
import SiteContext from "@/state/SiteContext"
import { Link } from "react-router"

const Header = (): ReactElement => {
    const siteContext = useContext(SiteContext)
    if (siteContext === undefined) {
        return (<></>)
    }
    return (
        <header className="flex flex-col md:flex-row md:items-center md:justify-between p-4 border-b-4 border-[var(--color-primary)] mb-4">
            
            <div className="flex justify-between">
                <span className="flex items-center">
                    <Link to={siteContext.header.logoUrl}>
                        <img
                            className='object-contain max-h-16 mr-4'
                            src={siteContext.header.logoImage}
                            alt={siteContext.header.logoAltText}
                        />
                    </Link>
                    <Link to="/" className="text-2xl">{siteContext.site.title}</Link>
                </span>
                <button type="button" className="block md:hidden p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
            </div>
            <Nav />
        </header>
    )
}

export default Header