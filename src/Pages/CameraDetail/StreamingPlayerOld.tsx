import React, { useEffect, useRef, useState } from 'react';
import shaka from 'shaka-player/dist/shaka-player.compiled';
import 'shaka-player/dist/controls.css'

function VideoStreamPlayer({ 
    src, 
    aspectRatio = '16/9', 
    ...rest 
}: {
    src: string
    aspectRatio?: string,
    className?: string
}) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const videoRef = useRef(null);

    const [videoError, setVideoError] = useState(null);

    useEffect(() => {
        const player = new shaka.Player(videoRef.current)
        //const ui = new shaka.ui.Overlay(player, containerRef.current, videoRef.current)
        player.load(src)
            .catch(e => {
                setVideoError(e);
                console.error(e)
                //ui.destroy();
                player.destroy();
                containerRef?.current?.classList?.remove('shaka-video-container');
            })

        return () => {
            //ui.destroy()
            player.destroy()
        }
    }, [])

    return (
        <div ref={containerRef} {...rest}>
            {!videoError && <video ref={videoRef} className="w-full h-full" />}
            {videoError && (
                <div className="flex gap-4 bg-red-100 p-4 rounded-md w-full" style={{ aspectRatio: aspectRatio }}>
                    <div className="w-max">
                        <div className="text-red-700">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-10 h-10"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                    <div className="text-sm flex flex-col">
                        <h6 className="font-semibold text-red-900 text-xl mb-1">Playback Error</h6>
                        <p className="text-red-700 flex-grow flex-shrink-0">This video couldn't be played.</p>

                        <details className='text-gray-600 text-xs overflow-y'>
                            <summary className='cursor-pointer'>Technical Details</summary>
                            <code className='font-mono'>{videoError.toString()}</code>
                        </details>
                    </div>
                </div>
            )}
        </div>
    );
}




interface ShakaPlayerProps {
  src: string;
}

export const ShakaPlayerComponent: React.FC<ShakaPlayerProps> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<shaka.Player | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // Install Shaka Player polyfills
    shaka.polyfill.installAll();

    // Check for browser support
    if (!shaka.Player.isBrowserSupported()) {
      console.error('Browser not supported by Shaka Player');
      return;
    }

    const player = new shaka.Player(videoElement);
    playerRef.current = player;

    // Listen for error events
    player.addEventListener('error', (event: shaka.Player.ErrorEvent) => {
      console.error('Shaka Player error:', event.detail);
    });

    // Load the manifest
    player.load(src).catch((error: shaka.util.Error) => {
      console.error('Error loading manifest:', error);
    });

    // Cleanup on component unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay // Or manage autoplay with state/props
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default ShakaPlayerComponent
