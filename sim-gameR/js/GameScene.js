import { MovingVars, buyable, island_size } from "./constants";
import * as BABYLON from "../node_modules/@babylonjs/core"
import "../node_modules/@babylonjs/loaders/glTF";
import ShopScene from "./ShopScene";
import Mine from "./Mine";
import Furnace from "./Furnace";
import Saw from "./Saw";


export default class GameScene {
    
    static game;
    static name = "game";
    static buildings = {};
    static moveUILoaded = false;
    static movingMeshwithParent = null;
    static movingUIMeshes = [];
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
            let pMesh;
            switch (pointerInfo.type) {
                case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
                    pMesh = pointerInfo.pickInfo.pickedMesh;
                    if (("" + pMesh.parent.name).startsWith("m_c") || ("" + pMesh.parent.name).slice(0, 9) === "sandClone") {
                        return;
                    }
                    console.log("Double tapped on: " + pMesh.parent.name);
                    console.log(pMesh.parent.absolutePosition);
                    if (this.moveUILoaded) {
                        this.removeMoveUI();
                    }
                    this.loadMoveUI(pMesh);
                    break;
                case BABYLON.PointerEventTypes.POINTERPICK:
                    pMesh = pointerInfo.pickInfo.pickedMesh;
                    // console.log(pMesh.parent.absolutePosition)
                    if (("" + pMesh.parent.name).slice(0, 9) === "sandClone") {
                        this.removeMoveUI();
                        return;
                    }
                    if (("" + pMesh.parent.name).startsWith("m_c")) {
                        // the move UI
                        const dir = ("" + pMesh.parent.name).slice(3, 4);
                        // dir --> 0 = O | 1 = W | 2 = N | 3 = S
                        console.log("moving current movingMeshwithParent")
                        switch (parseInt(dir)) {
                            case 0:
                                this.movingMeshwithParent.position.x += 2;
                                for (let i = 0; i < this.movingUIMeshes.length; i++) {
                                    this.movingUIMeshes[i].position.x += 2;
                                }
                                break;
                            case 3:
                                this.movingMeshwithParent.position.z -= 2;
                                for (let i = 0; i < this.movingUIMeshes.length; i++) {
                                    this.movingUIMeshes[i].position.z -= 2;
                                }
                                break;
                            case 1:
                                for (let i = 0; i < this.movingUIMeshes.length; i++) {
                                    this.movingUIMeshes[i].position.x -= 2;
                                }
                                this.movingMeshwithParent.position.x -= 2;
                                break;
                            case 2:
                                for (let i = 0; i < this.movingUIMeshes.length; i++) {
                                    this.movingUIMeshes[i].position.z += 2;
                                }
                                this.movingMeshwithParent.position.z += 2;
                                break;
                        }


                        return;
                    }
                    console.log("picked: " + pMesh.parent.name);
                    this.buildings[pMesh.parent.name].onclick();
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
                    GameScene.buildings[mesh.name] = new Mine(mesh.position, mesh);
                    animationGroups[1].stop();
                    animationGroups[1].loopAnimation = true;
                    animationGroups[0].stop();
                    animationGroups[0].loopAnimation = true;

                } else if (buildingNr == 1) {
                    // furnace
                    GameScene.buildings[mesh.name] = new Furnace(mesh.position, mesh);
                } else if (buildingNr == 2) {
                    // saw
                    GameScene.buildings[mesh.name] = new Saw(mesh.position, mesh);
                    animationGroups[1].stop();
                    animationGroups[1].loopAnimation = true;
                    animationGroups[0].stop();
                    animationGroups[0].loopAnimation = true;
                }
            }
        )
    }

    /**
     * Creates a move UI around a position
     * @param {BABYLON.AbstractMesh} position 
     */
    static loadMoveUI(mesh) {
        if (this.moveUILoaded) {
            return;
        }
        const position = mesh.parent.absolutePosition;
        this.movingMeshwithParent = mesh.parent;
        this.moveUILoaded = true;
        BABYLON.SceneLoader.ImportMesh(
            "",
            "../3d/",
            "move.gltf",
            this.scene,
            function (meshes, particleSystems, skeletons, animationGroups) {
                console.log("loading move UI");
                const mesh = meshes[0];
                mesh.name = "m_c0"
                mesh.position.set(position._x + 2, 4, position._z);
                const c1 = mesh.clone("m_c1");
                c1.position.set(position._x - 2, 4, position._z)
                c1.rotate(BABYLON.Axis.Y, Math.PI)
                const c2 = mesh.clone("m_c2");
                c2.position.set(position._x, 4, position._z + 2)
                c2.rotate(BABYLON.Axis.Y, -(Math.PI / 2))
                const c3 = mesh.clone("m_c3");
                c3.position.set(position._x, 4, position._z - 2)
                c3.rotate(BABYLON.Axis.Y, Math.PI / 2);
                GameScene.movingUIMeshes.push(mesh);
                GameScene.movingUIMeshes.push(c1);
                GameScene.movingUIMeshes.push(c2);
                GameScene.movingUIMeshes.push(c3);

            }
        )
    }

    static removeMoveUI() {
        this.moveUILoaded = false;
        for (let i = 0; i < this.movingUIMeshes.length; i++) {
            this.movingUIMeshes[i].dispose();
            this.movingUIMeshes[i] = null;
        }
        this.movingUIMeshes = [];

    }

    /**
     * loads the game from the rtdb
     * @param {integer} plotNr 
     */
    // static loadGame(plotNr, get, ref, db) {
    //     const user = localStorage.getItem("user_sim");
    //     get(ref(db))
    // }
}