import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

export function IntroScene() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.play();
    }
  }, [isPlaying]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleNextPage = () => {
    router.push('/chicago');
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <video
        ref={videoRef}
        src="/data/light1.mp4"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        muted
        loop
      />
      <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
        <button onClick={handlePlay} disabled={isPlaying} style={{ marginRight: 10 }}>
          Play Video
        </button>
        <button onClick={handleNextPage}>
          Go to Map
        </button>
      </div>
    </div>
  );
}