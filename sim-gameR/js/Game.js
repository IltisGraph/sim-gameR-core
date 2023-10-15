import { MovingVars } from "./constants";

export default class Game {
    /**
     * 
     * @param {BABYLON.Scene} sceneClass 
     * @param {BABYLON.engine} engine 
     * @param {logEvent} logEvent 
     * @param {analytics} analytics 
     */
    constructor (sceneClass, engine, logEvent, analytics) {
        this.sceneClass = sceneClass;
        this.engine = engine;
        this.analytics = analytics;
        this.logEvent = logEvent;
    }

    /**
     * Sets the new current scene by providing the class
     * @param {*} newSceneClass 
     */
    setScene(newSceneClass) {
        this.sceneClass.removeSceneListener();
        newSceneClass.createSceneListener();
        newSceneClass.createEachTimeEventListeners();
        this.engine.stopRenderLoop();

        this.engine.runRenderLoop(() => {
            newSceneClass.getScene().render();
        });
        MovingVars.gamePage = newSceneClass.name;


        this.sceneClass = newSceneClass;
    }
}