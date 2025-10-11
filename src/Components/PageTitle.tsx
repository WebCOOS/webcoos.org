import type { ReactElement } from "react"

const PageTitle = ({children}: {children: string}): ReactElement => {
  return (
    <title>{children} | WebCOOS</title>
  )
}
export default PageTitle