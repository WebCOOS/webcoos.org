import { type ReactElement } from "react"

import { Provider } from "jotai"
import CamerasLoader from "./CamerasLoader"
import PageTitle from "@/Components/PageTitle"


const CamerasNew =  (): ReactElement => {
  return (
    <Provider>
      <PageTitle>Cameras</PageTitle>
      <CamerasLoader />
    </Provider>
  )
}

export default CamerasNew