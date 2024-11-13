"use client";

import { MantineProvider } from '@mantine/core';
import css from "../MainScene/MainScene.module.css";
import {Canvas} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'
import {Button} from "@mantine/core";
import {PlayIcon} from "@radix-ui/react-icons";
import {useState} from "react";
import {MapWater} from "../../map/water";
import {MapGrass} from "../../map/grass";
import {MapTrees} from "../../map/trees";
import {MapBuildingsSm} from "../../map/buildings_sm";
import {MapBuildingsBg} from "../../map/buildings_bg";
import {MapRoads} from "../../map/roads";
import {MapHighway} from "../../map/highway";
import {MapInteractive} from "../../map/interactive";

const scale = 30;
const offset = [-scale/2, 0, scale/2]
const backgroundCol = "#888888";

export function MapScene() {

    const [isLoading, setIsLoading] = useState(true);


    function start_handler() {
        return
    }

    return (
        <div className={css.container}>
            {isLoading && <div className="loader">Loading...</div>}
            <Canvas camera={{position: [0, 4, 6]}}
                    style={{
                        width: "100vw",
                        height: "100vh",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        backgroundColor: backgroundCol,
                    }}
            >
                <fog attach="fog" color={backgroundCol} near={4} far={20}/>
                <ambientLight intensity={0.3}/>
                <directionalLight position={[10, 10, 5]} intensity={1}/>
                <OrbitControls
                    maxPolarAngle={Math.PI / 2 - Math.PI / 12}
                    // maxPolarAngle={Math.PI - Math.PI / 6}
                />
                <group position={offset}>
                    <MapWater mapScale={scale}/>
                    <MapGrass mapScale={scale}/>
                    <MapTrees mapScale={scale}/>
                    <MapBuildingsSm mapScale={scale}/>
                    <MapBuildingsBg mapScale={scale}/>
                    <MapRoads mapScale={scale}/>
                    <MapHighway mapScale={scale}/>
                    <MapInteractive mapScale={scale}/>
                </group>

                <axesHelper args={[5]}/>
                {/*<EffectComposer autoClear={false}>*/}
                {/*    <DepthOfField focusDistance={1} focalLength={.1} bokehScale={20} />*/}
                {/*</EffectComposer>*/}

            </Canvas>
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