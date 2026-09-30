import React, { useEffect, useRef } from 'react';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { Vector3, Color4, Color3 } from '@babylonjs/core/Maths/math';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { InputManager } from './input/InputManager';
import { GateManager } from './gates/GateManager';

interface BabylonSceneProps {
    onScoreUpdate: (score: number) => void;
    onLivesUpdate: (lives: number) => void;
    onQuestionUpdate: (qText: string) => void;
}

export const BabylonScene: React.FC<BabylonSceneProps> = ({ onScoreUpdate, onLivesUpdate, onQuestionUpdate }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const engine = new Engine(canvas, true);
        const scene = new Scene(engine);
        scene.clearColor = new Color4(0.439, 0.788, 0.953, 1); 

        const camera = new FreeCamera("camera", new Vector3(0, 4, -7), scene);
        camera.setTarget(new Vector3(0, 1, 3));

        const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
        light.intensity = 0.9;

        // Infinite Road Setup
        const roadMat = new StandardMaterial("roadMat", scene);
        roadMat.diffuseColor = new Color3(0.847, 0.662, 0.423);

        const road1 = MeshBuilder.CreatePlane("road1", { width: 6, height: 60 }, scene);
        road1.rotation.x = Math.PI / 2;
        road1.position.z = 30;
        road1.material = roadMat;

        const road2 = MeshBuilder.CreatePlane("road2", { width: 6, height: 60 }, scene);
        road2.rotation.x = Math.PI / 2;
        road2.position.z = 90;
        road2.material = roadMat;

        // --- Side Green Hills / Terrain Slopes ---
        const terrainMat = new StandardMaterial("terrainMat", scene);
        terrainMat.diffuseColor = new Color3(0.373, 0.796, 0.447); // Fresh Green (#5FCB72)

        // Left Hill Bank
        const leftTerrain1 = MeshBuilder.CreatePlane("leftTerrain1", { width: 20, height: 60 }, scene);
        leftTerrain1.rotation.x = Math.PI / 2;
        leftTerrain1.position = new Vector3(-13, -0.2, 30);
        leftTerrain1.material = terrainMat;

        const leftTerrain2 = MeshBuilder.CreatePlane("leftTerrain2", { width: 20, height: 60 }, scene);
        leftTerrain2.rotation.x = Math.PI / 2;
        leftTerrain2.position = new Vector3(-13, -0.2, 90);
        leftTerrain2.material = terrainMat;

        // Right Hill Bank
        const rightTerrain1 = MeshBuilder.CreatePlane("rightTerrain1", { width: 20, height: 60 }, scene);
        rightTerrain1.rotation.x = Math.PI / 2;
        rightTerrain1.position = new Vector3(13, -0.2, 30);
        rightTerrain1.material = terrainMat;

        const rightTerrain2 = MeshBuilder.CreatePlane("rightTerrain2", { width: 20, height: 60 }, scene);
        rightTerrain2.rotation.x = Math.PI / 2;
        rightTerrain2.position = new Vector3(13, -0.2, 90);
        rightTerrain2.material = terrainMat;
  
        // --- Pine Trees Generation on Forest Edges ---
        const trunkMat = new StandardMaterial("trunkMat", scene);
        trunkMat.diffuseColor = new Color3(0.5, 0.35, 0.2); // Wood brown

        const pineMat = new StandardMaterial("pineMat", scene);
        pineMat.diffuseColor = new Color3(0.15, 0.55, 0.25); // Forest green

        // Function to create a simple low-poly pine tree
        const createPineTree = (name: string, x: number, z: number) => {
            const trunk = MeshBuilder.CreateCylinder(`${name}_trunk`, { diameter: 0.4, height: 1.5 }, scene);
            trunk.position = new Vector3(x, 0.75, z);
            trunk.material = trunkMat;

            const foliage = MeshBuilder.CreateCylinder(`${name}_foliage`, { diameterTop: 0.1, diameterBottom: 2.2, height: 3 }, scene);
            foliage.position = new Vector3(x, 2.5, z);
            foliage.material = pineMat;

            // Group them or track them in an array for scrolling
            return [trunk, foliage];
        };

        // Spawn rows of trees along left and right edges
        const treeMeshes: BABYLON.Mesh[] = [];
        for (let zPos = -10; zPos <= 120; zPos += 15) {
            // Left trees
            const leftTrees = createPineTree(`left_tree_${zPos}`, -8 - (zPos % 3), zPos);
            treeMeshes.push(...leftTrees as BABYLON.Mesh[]);

            // Right trees
            const rightTrees = createPineTree(`right_tree_${zPos}`, 8 + (zPos % 4), zPos);
            treeMeshes.push(...rightTrees as BABYLON.Mesh[]);
        }
      
        // Player Box
        const player = MeshBuilder.CreateBox("player", { size: 0.8 }, scene);
        player.position = new Vector3(0, 0.4, 0);
        const playerMat = new StandardMaterial("playerMat", scene);
        playerMat.diffuseColor = new Color3(0.956, 0.478, 0.196);
        player.material = playerMat;

        // Lane Logic
        const lanePositions = [-2, 0, 2];
        let currentLaneIndex = 1;
        let targetX = lanePositions[currentLaneIndex];

        const inputManager = new InputManager((direction) => {
            if (direction === 'left' && currentLaneIndex > 0) {
                currentLaneIndex--;
            } else if (direction === 'right' && currentLaneIndex < lanePositions.length - 1) {
                currentLaneIndex++;
            }
            targetX = lanePositions[currentLaneIndex];
        });

        // Game State & Gate Manager
        let lives = 3;
        let score = 0;
        let checkedRow = false;

        const gateManager = new GateManager(scene);
        gateManager.spawnGateRow(40);
        
        // Push initial question to UI
        onQuestionUpdate(`${gateManager.currentQuestion.num1} + ${gateManager.currentQuestion.num2}`);

        const gameSpeed = 0.20;

        // Render loop
        engine.runRenderLoop(() => {
            player.position.x += (targetX - player.position.x) * 0.15;

            road1.position.z -= gameSpeed;
            road2.position.z -= gameSpeed;
            if (road1.position.z < -30) road1.position.z = road2.position.z + 60;
            if (road2.position.z < -30) road2.position.z = road1.position.z + 60;

            gateManager.update(gameSpeed);

            if (gateManager.gates.length > 0) {
                const firstGateZ = gateManager.gates[0].mesh.position.z;

                if (firstGateZ > 25) {
                    checkedRow = false;
                }

           // Scroll roads and side terrain
            road1.position.z -= gameSpeed;
            road2.position.z -= gameSpeed;
            leftTerrain1.position.z -= gameSpeed;
            leftTerrain2.position.z -= gameSpeed;
            rightTerrain1.position.z -= gameSpeed;
            rightTerrain2.position.z -= gameSpeed;

            if (road1.position.z < -30) {
                road1.position.z = road2.position.z + 60;
                leftTerrain1.position.z = leftTerrain2.position.z + 60;
                rightTerrain1.position.z = rightTerrain2.position.z + 60;
            }
            if (road2.position.z < -30) {
                road2.position.z = road1.position.z + 60;
                leftTerrain2.position.z = leftTerrain1.position.z + 60;
                rightTerrain2.position.z = rightTerrain1.position.z + 60;
            }

           // Scroll trees
            treeMeshes.forEach(tree => {
                tree.position.z -= gameSpeed;
                // Loop trees back if they go behind the camera
                if (tree.position.z < -10) {
                    tree.position.z += 135;
                }
            });

           // Precise collision window with strict debounce flag
                if (!checkedRow && firstGateZ <= 0.2 && firstGateZ >= -0.5) {
                    checkedRow = true;
                    const activeGate = gateManager.gates.find(g => g.laneIndex === currentLaneIndex);

                    if (activeGate) {
                        if (activeGate.isCorrect) {
                            score += 10;
                            onScoreUpdate(score);
                        } else {
                            lives -= 1;
                            onLivesUpdate(lives);
                            if (lives <= 0) {
                                alert(`Game Over! Final Score: ${score}`);
                                lives = 3;
                                score = 0;
                                onScoreUpdate(score);
                                onLivesUpdate(lives);
                            }
                        }
                    }
                }

                if (firstGateZ < -5) {
                    gateManager.spawnGateRow(50);
                    onQuestionUpdate(`${gateManager.currentQuestion.num1} + ${gateManager.currentQuestion.num2}`);
                }
            }

            scene.render();
        });

        const handleResize = () => engine.resize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            inputManager.dispose();
            gateManager.disposeGates();
            engine.stopRenderLoop();
            scene.dispose();
            engine.dispose();
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            style={{ width: '100vw', height: '100vh', display: 'block', outline: 'none' }} 
        />
    );
};
