import { type ReactElement } from "react"

import CamerasLoader from "./CamerasLoader"
import PageTitle from "@/Components/PageTitle"


const CamerasNew =  (): ReactElement => {
  return (
      <>
        <PageTitle>Cameras</PageTitle>
        <div className='p-10 flex flex-col h-full'>
            <h1 className='text-2xl font-bold'>Cameras New</h1>
            <div className='relative h-full -mx-10 px-10'>
                <CamerasLoader />
            </div>
        </div>
      </>
  )
}

export default CamerasNew