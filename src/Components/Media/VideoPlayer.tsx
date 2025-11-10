// VideoPlayer.tsx
import React, { useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css'; // Import Video.js CSS

type PlayerOptions = typeof videojs.options;
type Player = Parameters<typeof videojs>["1"];

interface VideoPlayerProps {
  options: PlayerOptions
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ options }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = videoRef.current;
      if (videoElement) {
        playerRef.current = videojs(videoElement, options, () => {
          console.log('player is ready');
        });
        const player = playerRef.current;

        player.on('error', () => {
          const error = player.error();
          if (error) {
            console.error('Video.js Error:', error.code, error.message);
            // Implement custom error handling logic here
            // e.g., display a user-friendly message, retry stream, etc.
          }
        });
      }
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay);
      player.src(options.sources)
    }
  }, [options]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
        console.log('player disposed');
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player className='w-full h-full'>
      <video ref={videoRef} className="video-js vjs-big-play-centered w-full h-full" />
    </div>
  );
};

export default VideoPlayer;