import React, { useState, useEffect } from "react";
import { MapScene } from "../components/scenes/MapScene";
import VideoPlayer from "../components/UI/VideoPlayer";
import MainMenu from "../components/UI/Menu";
import {useAppContext} from "../components/context/AppContext";
import css from "../components/UI/VideoPlayer/VideoPlayer.module.css";

export default function MapPage() {

    const { state, dispatch } = useAppContext();

    function closeVideo() {
        dispatch({ type: "SET_IS_PLAYING", payload: false });
    }

    return (
    <main>
        <VideoPlayer />
        <MapScene />

        {state.isPlaying &&
         <button className="closeVideoButton" onClick={closeVideo} >
            <img src="/UI/close.png" alt="Close" width={50} height={50} />
        </button>
        }
        <MainMenu />
    </main>
  );
}
