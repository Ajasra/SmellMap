import React, { useEffect, useRef, useState } from "react";
// @ts-ignore
import css from "./VideoPlayer.module.css";
import { useAppContext } from "../../context/AppContext";

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { state, dispatch } = useAppContext();
  const { pathId, chapterId, volume, isLoaded, isDebug, isPlaying } = state;
  const [videoSrc, setVideoSrc] = useState("");

  const mode = "path";

  const nextVideo = () => {
    if (mode == "path") {
      videoRef.current.pause();
      dispatch({ type: "SET_IS_PLAYING", payload: false })
      const currentPath = state.pathes.find((path) => path.id === pathId);
      let currentId = chapterId + 1;
      if (currentId <= currentPath.points) {
        dispatch({ type: "SET_CHAPTER_ID", payload: currentId });
      }else{
        dispatch({type: "SET_CHAPTER_ID", payload: 0})
      }
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
    if(!isPlaying){
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }

  },[state.isPlaying])

  useEffect(() => {
    const checkVideoExists = async () => {
      dispatch({ type: "SET_IS_PLAYING", payload: true });
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

    if (pathId !== 0 && chapterId !== 0) {
      checkVideoExists();
    }
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
        {isLoaded && isPlaying ? (
            <div className={css.videoContainer}>
              <video
                  ref={videoRef}
                  className={css.fullscreenVideo}
                  src={videoSrc}
                  onEnded={nextVideo}
              />
            </div>
        ) : (
            <></>
        )}
        {isDebug && (
            <div className={css.debug}>
              <div>pathId: {pathId}</div>
              <div>chapterId: {chapterId}</div>
            </div>
        )}
      </>
  );
};

export default VideoPlayer;
