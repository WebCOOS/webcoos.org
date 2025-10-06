import { type ReactElement } from "react"

import { Provider } from "jotai"
import CamerasLoader from "./CamerasLoader"


const CamerasNew =  (): ReactElement => {
  return (
    <Provider>
      <CamerasLoader />
    </Provider>
  )
}

export default CamerasNew