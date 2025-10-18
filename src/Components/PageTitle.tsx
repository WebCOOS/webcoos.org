import SiteContext from "@/state/SiteContext"
import { useContext, type ReactElement } from "react"

const PageTitle = ({children}: {children: string}): ReactElement => {
  const site = useContext(SiteContext)
  document.title = `${children} | ${site?.site.title}`
  return <></>
}
export default PageTitle