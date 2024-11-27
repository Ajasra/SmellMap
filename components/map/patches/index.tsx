import * as THREE from "three";
import {useAppContext} from "../../context/AppContext";
import {useEffect, useRef, useState} from "react";
import {RadiantFieldGeo} from "../../RadiantFieldGeo";

export function Patches({ mapScale }: { mapScale: number }){

    const { state, dispatch } = useAppContext();
    const [activePatch, setActivePatch] = useState(null);
    const { pathData, chapterId, pathes, pathId } = state;
    const lineRef = useRef<THREE.Line>(null);

    useEffect(() => {
        let actPath = pathes.find((path) => path.id === pathId);
        if(actPath) {
            setActivePatch(actPath);
        }
    }, [pathData, pathes, pathId]);

    useEffect(() => {
        if (lineRef.current && pathData.pathData.length > 0) {
            const points = pathData.pathData.map(
                (point) => new THREE.Vector3(point.x * mapScale, 1.3, -point.y * mapScale)
            );
            const curve = new THREE.CatmullRomCurve3(points);
            const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(300));
            lineRef.current.geometry = geometry;
        }
    }, [pathData.pathData, mapScale]);

    function updateChapterId(chapterId: number) {
        dispatch({ type: "SET_CHAPTER_ID", payload: chapterId });
    }

    return (
        <>
            {
                (activePatch && activePatch.points && pathData.pointsData.length > 0) &&
                pathData.pointsData.map((patch, index) => {
                    const isHighlighted = index === activePatch.points - chapterId;
                    return (
                        <group key={patch.x + patch.y + patch.z} position={[patch.x * mapScale, 1.3, -patch.y * mapScale]}
                               scale={0.2}>
                            <mesh
                                onClick={() => updateChapterId(activePatch.points - index)}
                            >
                                <coneGeometry attach="geometry" args={[1, 1, 3]}/>
                                <meshStandardMaterial
                                    attach="material"
                                    color={isHighlighted ? "#cc0000" : activePatch.colorArrow}
                                />
                            </mesh>
                            {isHighlighted &&
                                <RadiantFieldGeo
                                    position={[0, -.5, 0]}
                                    color={new THREE.Color(1, 0, 0)}
                                />
                            }
                        </group>
                    );
                })}
            { activePatch && pathData.pathData.length > 0 && (
                <line ref={lineRef}>
                    <bufferGeometry />
                    <lineBasicMaterial attach="material" color={activePatch.color} />
                </line>
            )}

        </>
    );
}