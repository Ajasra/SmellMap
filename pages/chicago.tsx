import { MapScene } from "../components/scenes/MapScene";
import VideoPlayer from "../components/VideoPlayer";

export default function MapPage() {
  return (
    <main>
      <VideoPlayer />
      <MapScene />
    </main>
  );
}
