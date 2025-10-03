// hidden md:flex items-center

import { useContext, type ReactElement } from "react"
import { Link } from "react-router"
import SiteContext from "@/state/SiteContext"

function Nav({scrolled = false}: {scrolled: boolean}): ReactElement {
  const siteContext = useContext(SiteContext)
  if(siteContext === undefined){
    return (<></>)
  }
  const linkClassName = 'block py-2 mr-4 font-semibold text-[var(--color-primary-darker)] transition-all duration-100'
  const linkClassNameScrolled = 'text-xs block py-2 mr-4 font-semibold text-[var(--color-primary-darker)] transition-all duration-100'
  return (<div className='hidden md:flex items-center'>{
    siteContext.header.menus.map((item) => {
      return <Link key={item.label} to={item.to} className={scrolled ? linkClassNameScrolled : linkClassName}>{item.label}</Link>
    })}</div>)
}

export default Nav