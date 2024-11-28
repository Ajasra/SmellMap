import { MapScene } from "../components/scenes/MapScene";
import VideoPlayer from "../components/UI/VideoPlayer";
import MainMenu from "../components/UI/Menu";

export default function MapPage() {
  return (
    <main>
      <VideoPlayer />
      <MapScene />
      <MainMenu />
    </main>
  );
}
