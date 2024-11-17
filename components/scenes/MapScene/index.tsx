"use client";

import { MantineProvider } from '@mantine/core';
import css from "../MainScene/MainScene.module.css";
import {Canvas, useFrame} from "@react-three/fiber";
import {OrbitControls, PerspectiveCamera} from "@react-three/drei";
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'
import {Button} from "@mantine/core";
import {PlayIcon} from "@radix-ui/react-icons";
import {useEffect, useRef, useState} from "react";
import {MapRiver} from "../../map/water";
import {MapGrass} from "../../map/grass";
import {MapTrees} from "../../map/trees";
import {MapBuildingsBg} from "../../map/buildings_bg";
import {MapRoads} from "../../map/roads";
import {MapHighway} from "../../map/highway";
import {MapInteractive} from "../../map/interactive";
import {RoadMap} from "../../map/road_map";
import {MouseSphere} from "../../map/mouse";

import * as THREE from 'three';
import {TopRightCanvas} from "../ObjectCanvas";
import {MapLake} from "../../map/water1";
import {SubwayPath} from "../../map/subway";

const scale = 30;
const offset = [-scale/2, 0, scale/2]
const backgroundCol = "#eeeeee";

export function MapScene() {

    const [isLoading, setIsLoading] = useState(true);
    const [MP, setMP] = useState(new THREE.Vector3);
    const [activeId, setActiveId] = useState<number | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);


    function start_handler() {
        return
    }

    useEffect(() => {
        // alert(activeId)
    },[activeId])


    return (
        <div className={css.container}>
            {isLoading && <div className="loader">Loading...</div>}
            <Canvas
                    style={{
                        width: "100vw",
                        height: "100vh",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        backgroundColor: backgroundCol,
                    }}

            >
                <PerspectiveCamera
                    makeDefault
                    position={[0, 0, 10]}
                    ref={cameraRef}
                />
                {/*<fog attach="fog" color={backgroundCol} near={15} far={30}/>*/}
                <ambientLight intensity={0.5}/>
                <directionalLight position={[10, 10, 5]} intensity={2}/>
                <OrbitControls
                    maxPolarAngle={Math.PI / 2 - Math.PI / 12}
                />
                <RoadMap mapScale={scale} />
                <group position={offset}>
                    <MapRiver mapScale={scale}/>
                    <MapLake mapScale={scale}/>
                    <MapGrass mapScale={scale}/>
                    <MapTrees mapScale={scale} MP={MP}/>
                    <MapBuildingsBg mapScale={scale} MP={MP}/>
                    {/*<MapRoads mapScale={scale}/>*/}
                    {/*<MapHighway mapScale={scale}/>*/}
                    <MapInteractive mapScale={scale}  setActiveId={setActiveId} activeId={activeId}/>
                    <MouseSphere mapScale={scale} setMP={setMP}/>
                    <SubwayPath mapScale={scale} MP={MP} />
                </group>

                {/*<axesHelper args={[5]}/>*/}
                {/*<EffectComposer autoClear={false}>*/}
                {/*    <DepthOfField focusDistance={1} focalLength={.1} bokehScale={20} />*/}
                {/*</EffectComposer>*/}

            </Canvas>
            <TopRightCanvas setActiveId={setActiveId} activeId={activeId} cameraRef={cameraRef} mapScale={scale}/>
            {!isLoading && (
                <>
                <Button
                        onClick={()=> start_handler()}
                        style={{ position: "absolute", bottom: 20, right: 20 }}
                    >
                        <PlayIcon />
                    </Button>
                </>
            )}
        </div>
    );
}