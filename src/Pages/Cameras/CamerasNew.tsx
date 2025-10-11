import { type ReactElement } from "react"

import { Provider } from "jotai"
import CamerasLoader from "./CamerasLoader"


const CamerasNew =  (): ReactElement => {
  return (
    <Provider>
      <title>Cameras | WebCOOS</title>
      <CamerasLoader />
    </Provider>
  )
}

export default CamerasNew