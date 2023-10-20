import { MovingVars } from "./constants";

export default class Game {
    /**
     * 
     * @param {BABYLON.Scene} sceneClass 
     * @param {BABYLON.engine} engine 
     * @param {logEvent} logEvent 
     * @param {analytics} analytics
     * @param {set} set
     * @param {get} get
     * @param {ref} ref  
     * @param {database} db
     * @param {child} child 
     * @param {number} plot 
     */
    constructor (sceneClass, engine, logEvent, analytics, set, get, ref, db, child, plot) {
        this.sceneClass = sceneClass;
        this.engine = engine;
        this.analytics = analytics;
        this.logEvent = logEvent;
        this.set = set;
        this.get = get;
        this.ref = ref;
        this.db = db;
        this.plot = plot;
        this.child = child;
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