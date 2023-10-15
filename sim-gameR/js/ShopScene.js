import * as BABYLON from "../node_modules/@babylonjs/core"
import { MovingVars } from "./constants";
import "../node_modules/@babylonjs/loaders/glTF";
import { buyable } from "./constants";
import GameScene from "./GameScene";

export default class ShopScene {
    static game;
    static name = "shop";
    /**
     * only used to preload the scene once at the beginning
     * @param {BABYLON.Engine} engine
     */
    static createScene(engine) {
        const scene = new BABYLON.Scene(engine);
        scene.createDefaultLight();

        const camera = new BABYLON.UniversalCamera("shopCam", new BABYLON.Vector3(0, 0, 0), scene);
        // camera.attachControl(true);
        let positions = [];
        for (let i = 0; i < buyable.length; i++) {
            const mesh = BABYLON.SceneLoader.ImportMesh(
                "",
                "./3d/",
                buyable[i] + ".gltf",
                scene,
                function (meshes, particleSystems, skeletons, animationGroups) {
                    console.log("Loaded mesh!");
                    const model = meshes[0];
                    model.position.set(i * 5, 0, 10);
                    for (let group = 0; group < animationGroups.length; group++) {
                        animationGroups[group].stop();
                    }
                }

            )
        }
        const buyCube = BABYLON.SceneLoader.ImportMesh(
            "",
            "./3d/",
            "shopBuy.gltf",
            scene,
            function (meshes, particleSystems, skeletons, animationGroups) {
                const model = meshes[0];
                model.rotate(BABYLON.Axis.Y, Math.PI / 2);
                model.position.set(-1000, -1.5, 10);
                for (let i = 0; i < buyable.length; i++) {
                    const cloneName = i + "_buyButton";
                    const c = model.clone(cloneName);
                    c.position.set(i * 5, -1.5, 10);
                    c.rotate(BABYLON.Axis.Y, Math.PI);

                }
            }
        );

        this.camera = camera;
        this.scene = scene;
    }

    /**
     * 
     * @returns BABYLON.Scene
     */
    static getScene() {
        return this.scene;
    }
    /**
     * 
     * @returns BABYLON.Camera
     */
    static getCamera() {
        return this.camera;
    }
    /**
     * Creates the scene binded listeners
     */
    static createSceneListener() {
        this.scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:
                    if (pointerInfo.pickInfo.pickedMesh == null) {
                        return;
                    }
                    break
                case BABYLON.PointerEventTypes.POINTERUP:
                    if (pointerInfo.pickInfo.pickedMesh == null) {
                        return;
                    }

                    const pickedName = pointerInfo.pickInfo.pickedMesh.name;
                    console.log("picked: " + pickedName);
                    const nr = pickedName.slice(0, 1);
                    // create the bought object
                    GameScene.loadNewBuilding(nr);
                    this.game.setScene(GameScene);
                    break;


            }
        });
    }
    /**
     * removes the scene binded listeners
     */
    static removeSceneListener() {
        this.scene.onPointerObservable.clear();
    }
    /**
     * creates the normal event listeners
     */
    static createEventListeners() {
        let pos = { x: 0, y: 0 }
        let tracking = false;
        window.addEventListener("pointerdown", (event) => {
            // console.log("X: " + event.clientX);
            // console.log("Y: " + event.clientY);
            if (MovingVars.gamePage !== "shop") {
                return
            }
            tracking = true;
            pos.x = event.clientX;
            pos.y = event.clientY;
        });

        window.addEventListener("pointermove", (event) => {
            if (!tracking) {
                return;
            }
            if (MovingVars.gamePage !== "shop") {
                return
            }

            if (this.camera.position._x < 0 || this.camera.position._x > 10) {
                if (this.camera.position._x > 10) {
                    this.camera.position._x--;
                }
                if (this.camera.position._x < 0) {
                    this.camera.position._x++;
                }

                return;
            }

            let x = event.clientX;
            let y = event.clientY;

            const slower = .001;

            if (x > pos.x) {
                this.camera.position._x -= ((x - pos.x) - this.camera.position._x) * slower;
            } else if (x < pos.x) {
                this.camera.position._x -= ((x - pos.x) - Math.abs(this.camera.position._x)) * slower;

            }


        });

        window.addEventListener("pointerup", (event) => {
            if (MovingVars.gamePage !== "shop") {
                return
            }
            tracking = false;

        })
    }

    /**
     * create the event listeners which have to be created each time the scene(Class) is loaded and have to be overridden after another scene(Class) is loaded
     */
    static createEachTimeEventListeners() {
        document.getElementById("shop").innerText = "Verlassen";
        document.getElementById("shop").onclick = () => {
            this.game.setScene(GameScene);
        }
    }
}