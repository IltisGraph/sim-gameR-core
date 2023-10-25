import * as BABYLON from "@babylonjs/core"

export default class MapScene {
    static game;
    static name = "map";

    /**
     * 
     * @param {BABYLON.Engine} engine 
     */
    static createScene(engine) {
        const scene = new BABYLON.Scene(engine);
        scene.createDefaultLight();
        this.scene = scene;

        const camera = new BABYLON.UniversalCamera("cam2", BABYLON.Vector2.Zero, scene);
        this.camera = camera;
    }

    static getScene() {
        return this.scene;
    }

    static getCamera() {
        return this.camera;
    }

    static createSceneListener() {

    }

    static removeSceneListener() {

    }

    static createEventListeners(logEvent, analytics, engine) {

    }

    static createEachTimeEventListeners() {
        document.getElementById("mapbutton-holder").style.display = "block";
        for(let i = 0; i < 36; i++) {
            const button = document.createElement("button");
            button.onclick = () => {
                console.log("want to map: " + (i + 1));
            }
            button.style.width = "75px";
            button.style.height = "75px";
            document.getElementById("mapbutton-holder").appendChild(button);
        }
    }




}