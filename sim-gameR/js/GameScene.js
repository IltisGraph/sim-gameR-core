import { MovingVars, buyable, island_size } from "./constants";
import * as BABYLON from "../node_modules/@babylonjs/core"
import "../node_modules/@babylonjs/loaders/glTF";
import ShopScene from "./ShopScene";


export default class GameScene {
    
    static game;
    static name = "game";
    /**
     * should only be called once to load the scene. use setScene() then
     * @param {BABYLON.Engine} engine
     */
    static createScene(engine) {
        console.log("Loading gameScene!");
        const scene = new BABYLON.Scene(engine);

        scene.createDefaultLight();
        const camera = new BABYLON.UniversalCamera("cam1", new BABYLON.Vector3(15, 20, 0), scene);
        camera.setTarget(new BABYLON.Vector3(15, 0, 15))

        const sand = BABYLON.SceneLoader.ImportMesh(
            "",
            "./3d/",
            "sand_floor.gltf",
            scene,
            function (meshes, particleSystems, skeletons, animationGroups) {
                const model = meshes[0];
                model.position.set(0, 5, 0);
                for (let x = 0; x < island_size; x++) {
                    for (let y = 0; y < island_size; y++) {
                        const cloneName = "sandClone_" + x + "_" + y;
                        let m = model.clone(cloneName);
                        m.position.set(x * 2, 0, y * 2);
                        m.actionManager = new BABYLON.ActionManager(scene);
                        m.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                            { trigger: BABYLON.ActionManager.OnPickTrigger },
                            (e) => {
                                console.log("clicked: " + m.name);
                            }
                        ))
                    }
                }
            }
        );
        // sand.position._y = 5;

        const wall = BABYLON.SceneLoader.ImportMesh(
            "",
            "./3d/",
            "wall_1_empty.gltf",
            scene,
            function (meshes, particleSystems, skeletons, animationGroups) {
                const model = meshes[0];
                model.position.set(4, 0, 4);
                const topLeft = model.clone("top-left-wall");
                topLeft.position.set(4, 0, 34);
                topLeft.rotate(BABYLON.Axis.Y, Math.PI - Math.PI / 2);
                const topRight = model.clone("top-right-wall");
                topRight.position.set(34, 0, 34);
                topRight.rotate(BABYLON.Axis.Y, Math.PI)
            }
        )
        const openWall = BABYLON.SceneLoader.ImportMesh(
            "",
            "./3d/",
            "wall_1_closed.gltf",
            scene,
            function (meshes, particleSystems, skeletons, aniamtionGroups) {
                const model = meshes[0];
                model.position.set(4, 0, 4);
                const bottomRight = model.clone("bottom-right-wall");
                bottomRight.position.set(34, 0, 4);
                bottomRight.rotate(BABYLON.Axis.Y, -(Math.PI / 2));

            }
        )

        this.scene = scene;
        this.camera = camera;
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
     * @returns BABYLON.Scene
     */
    static getCamera() {
        return this.camera;
    }
    /**
     * Creates the scene binded event listener
     */
    static createSceneListener() {
        this.scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
                    const pickedName = pointerInfo.pickInfo.pickedMesh.name;
                    console.log("Double tapped on: " + pickedName);
                    console.log(pointerInfo.pickInfo.pickedMesh.position);
                    break;
            }
        })
    }

    /**
     * removes the scene binded event listener
     */
    static removeSceneListener() {
        this.scene.onPointerObservable.clear();
    }

    /**
     * 
     * @param {logEvent} logEvent 
     * @param {firebase analytics} analytics 
     * @param {BABYLON.Engine} engine 
     */
    static createEventListeners(logEvent, analytics, engine) {
        let pos = {"x":0, "y":0};
        let tracking = false;
        window.addEventListener("pointerdown", (event) => {
            // console.log("X: " + event.clientX);
            // console.log("Y: " + event.clientY);
            if (MovingVars.gamePage !== "game") {
                return
            }
            tracking = true;
            pos.x = event.clientX;
            pos.y = event.clientY;
        });

        this.createEachTimeEventListeners();

        window.addEventListener("pointermove", (event) => {
            if (!tracking) {
                return;
            }
            if (MovingVars.gamePage !== "game") {
                return
            }

            if (this.camera.position._x > 40 || this.camera.position._x < -40 || this.camera.position._z > 40 || this.camera.position._z < -40) {
                if (this.camera.position._x > 5) {
                    this.camera.position._x--;
                }
                if (this.camera.position._x < -35) {
                    this.camera.position._x++;
                }
                if (this.camera.position._z > 5) {
                    this.camera.position._z--;
                }
                if (this.camera.position._z < -35) {
                    this.camera.position._z++;
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

            if (y > pos.y) {
                this.camera.position._z += ((y - pos.y) - this.camera.position._z) * slower;
            } else if (y < pos.y) {
                this.camera.position._z += ((y - pos.y) - Math.abs(this.camera.position._z)) * slower;
            }

        });

        window.addEventListener("pointerup", (event) => {
            if (MovingVars.gamePage !== "game") {
                return
            }
            tracking = false;
        })
    }

    /**
     * create the event listeners which have to be created each time the scene(Class) is loaded and have to be overridden after another scene(Class) is loaded
     */
    static createEachTimeEventListeners() {
        document.getElementById("shop").onclick = () => {
            console.log("Clicked on shop");
            this.game.logEvent(this.game.analytics, "shop_open");
            // loadShop(engine, analytics, logEvent);
            this.game.setScene(ShopScene);
        }

        document.getElementById("shop").innerText = "Shop";
    }

    /**
     * loads a new building into the game
     * @param {string} buildingName 
     */
    static loadNewBuilding(buildingNr) {
        BABYLON.SceneLoader.ImportMesh(
            "",
            "../3d/",
            buyable[buildingNr] + ".gltf",
            this.scene,
            function (meshes, particleSystems, skeletons, animationGroups) {
                console.log("successfully loaded " + buildingNr);
                const mesh = meshes[0];
                mesh.name = Date.now();
                mesh.position.set(10, 0, 10);
                if (buildingNr == 0) {
                    // mine
                    animationGroups[1].start();
                    animationGroups[1].loopAnimation = true;
                    animationGroups[0].start();
                    animationGroups[0].loopAnimation = true;

                }
            }
        )
    }
}