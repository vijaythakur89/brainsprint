import * as BABYLON from '@babylonjs/core';

export interface GateData {
    mesh: BABYLON.Mesh;
    value: number;
    isCorrect: boolean;
    laneIndex: number;
}

export class GateManager {
    private scene: BABYLON.Scene;
    public gates: GateData[] = [];
    public currentQuestion = { num1: 3, num2: 4, answer: 7 };

    private gateColors = [
        new BABYLON.Color3(1.0, 0.47, 0.41), // Coral (#FF7869)
        new BABYLON.Color3(0.97, 0.78, 0.31), // Sunshine Yellow (#F9C74F)
        new BABYLON.Color3(0.35, 0.72, 0.96)  // Sky Blue (#5AB9F4)
    ];

    constructor(scene: BABYLON.Scene) {
        this.scene = scene;
    }

    public generateNewQuestion() {
        const num1 = Math.floor(Math.random() * 5) + 1;
        const num2 = Math.floor(Math.random() * 5) + 1;
        const answer = num1 + num2;
        this.currentQuestion = { num1, num2, answer };
    }

    public spawnGateRow(spawnZ: number) {
        this.disposeGates();
        this.generateNewQuestion();

        const lanes = [-2, 0, 2];
        const correctLane = Math.floor(Math.random() * 3);
        const correctAns = this.currentQuestion.answer;

        // Build a pool of unique wrong answers guaranteed not to equal correctAns
        const wrongPool: number[] = [];
        let offset = 1;
        while (wrongPool.length < 2) {
            const candidate1 = correctAns + offset;
            const candidate2 = correctAns - offset;

            if (candidate1 > 0 && candidate1 !== correctAns && !wrongPool.includes(candidate1)) {
                wrongPool.push(candidate1);
            }
            if (candidate2 > 0 && candidate2 !== correctAns && !wrongPool.includes(candidate2)) {
                wrongPool.push(candidate2);
            }
            offset++;
        }

        // Assign values to the 3 lanes cleanly
        const answers: number[] = [];
        let wrongIndex = 0;

        for (let i = 0; i < 3; i++) {
            if (i === correctLane) {
                answers.push(correctAns);
            } else {
                answers.push(wrongPool[wrongIndex++]);
            }
        }

        lanes.forEach((laneX, index) => {
            const isCorrect = index === correctLane;
            const gateVal = answers[index];

            const gateBox = BABYLON.MeshBuilder.CreateBox(`gate_${index}`, { width: 1.8, height: 1.4, depth: 0.3 }, this.scene);
            gateBox.position = new BABYLON.Vector3(laneX, 0.7, spawnZ);

            const mat = new BABYLON.StandardMaterial(`gateMat_${index}`, this.scene);
            mat.diffuseColor = this.gateColors[index];
            mat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.3);
            mat.emissiveColor = this.gateColors[index].scale(0.15);

            const dynamicTexture = new BABYLON.DynamicTexture(`textTex_${index}`, { width: 512, height: 512 }, this.scene, true);
            const hexColor = this.gateColors[index].toHexString();
            
            dynamicTexture.drawText(gateVal.toString(), null, 320, "bold 240px Arial", "#FFFDF2", hexColor, true);
            
            mat.diffuseTexture = dynamicTexture;
            gateBox.material = mat;

            this.gates.push({
                mesh: gateBox,
                value: gateVal,
                isCorrect,
                laneIndex: index
            });
        });
    }

    public update(speed: number) {
        this.gates.forEach(g => {
            g.mesh.position.z -= speed;
        });
    }

    public disposeGates() {
        this.gates.forEach(g => {
            if (g.mesh.material) {
                const mat = g.mesh.material as BABYLON.StandardMaterial;
                if (mat.diffuseTexture) mat.diffuseTexture.dispose();
                mat.dispose();
            }
            g.mesh.dispose();
        });
        this.gates = [];
    }
}
