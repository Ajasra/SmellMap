import React, { useEffect, useRef, useState } from "react";
// @ts-ignore
import css from "./VideoPlayer.module.css";
import { useAppContext } from "../context/AppContext";

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { state, dispatch } = useAppContext();
  const { pathId, chapterId, volume, isLoaded, isDebug } = state;
  const [videoSrc, setVideoSrc] = useState("");

  const mode = "path";

  const nextVideo = () => {
    if (mode == "path") {
      const currentPath = state.pathes.find((path) => path.id === pathId);
      let currentId = chapterId + 1;
      if (currentId > currentPath.points) currentId = 1;
      dispatch({ type: "SET_CHAPTER_ID", payload: currentId });
    } else if (mode == "all") {
      const currentPathIndex = state.pathes.findIndex(
        (path) => path.id === pathId,
      );
      let nextPathIndex = currentPathIndex + 1;
      if (nextPathIndex >= state.pathes.length) nextPathIndex = 0;
      const nextPath = state.pathes[nextPathIndex];
      dispatch({ type: "SET_PATH_ID", payload: nextPath.id });
      dispatch({ type: "SET_CHAPTER_ID", payload: 1 });
    } else {
      videoRef.current.pause();
    }
  };

  useEffect(() => {
    const checkVideoExists = async () => {
      const videoUrl = `/pathes/${pathId}/${chapterId}.mp4`;
      try {
        const response = await fetch(videoUrl, { method: "HEAD" });
        if (response.ok) {
          setVideoSrc(videoUrl);
        } else {
          console.error(`Video not found: ${videoUrl}`);
        }
      } catch (error) {
        console.error(`Error checking video: ${error}`);
      }
    };

    checkVideoExists();
  }, [pathId, chapterId]);

  useEffect(() => {
    if (videoRef.current && videoSrc && isLoaded) {
      videoRef.current.load();
      videoRef.current.play();
    }
  }, [videoSrc, isLoaded]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <>
      {isLoaded && (
        <video
          ref={videoRef}
          className={css.fullscreenVideo}
          src={videoSrc}
          onEnded={nextVideo}
        />
      )}
      {isDebug && (
        <div>
          <div>pathId: {pathId}</div>
          <div>chapterId: {chapterId}</div>
        </div>
      )}
    </>
  );
};

export default VideoPlayer;
