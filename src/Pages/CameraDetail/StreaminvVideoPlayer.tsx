import type { ReactElement } from 'react'
// import ShakaPlayer from 'shaka-player'
import 'shaka-player-react/dist/controls.css'


type IStreamingPlayerProps = {
    src: string
    autoPlay?: boolean
    width?: number
    height?: number
    playbackRate?: number
    muted?: boolean
    volume?: number
    className?: string
}



const StreamingVideoPlayer = (_props: IStreamingPlayerProps): ReactElement => {

    return (
        <></>
    )
}

export default StreamingVideoPlayer