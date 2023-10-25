import * as BABYLON from "@babylonjs/core"
import GameScene from "./GameScene";

export default class MapScene {
    static game;
    static name = "map";
    static buttons = [];

    /**
     * 
     * @param {BABYLON.Engine} engine 
     */
    static createScene(engine) {
        const scene = new BABYLON.Scene(engine);
        scene.createDefaultLight();
        this.scene = scene;

        const camera = new BABYLON.UniversalCamera("cam2", BABYLON.Vector3.Zero, scene);
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
        document.getElementById("map").style.animation = "move-button 0.15s linear";
        document.getElementById("map").onanimationend = () => {
            document.getElementById("map").style.bottom = "1%";
            document.getElementById("map").style.width = "75px";
            document.getElementById("map").style.height = "75px";
        }
        document.getElementById("mapbutton-holder").style.display = "block";
        for(let i = 0; i < 36; i++) {
            const button = document.createElement("button");
            this.buttons.push(button);
            button.onclick = () => {
                console.log("want to map: " + (i + 1));
            }
            button.innerText = i;
            button.style.width = "75px";
            button.style.height = "75px";
            document.getElementById("mapbutton-holder").appendChild(button);
        }

        document.getElementById("map").innerText = "Verlassen";
        document.getElementById("map").onclick = () => {
            // animation
            document.getElementById("map").innerText = "Karte";
            document.getElementById("map").style.animation = "shop-button-back 0.15s linear";
            document.getElementById("map").onanimationend = () => {
                document.getElementById("map").style.bottom = "15%";
                document.getElementById("map").style.width = "65px";
                document.getElementById("map").style.height = "65px";
                document.getElementById("map").animation = "none";
            }
            this.game.setScene(GameScene);
            document.getElementById("shop").style.display = "block";
            
            // delete all Buttons
            for (let i = 0; i < this.buttons.length; i++) {
                document.getElementById("mapbutton-holder").removeChild(this.buttons[i]);
            }
            this.buttons = [];
            
            document.getElementById("mapbutton-holder").style.display = "none";
        }
        document.getElementById("shop").style.display = "none";
    }




}