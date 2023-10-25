import "../node_modules/@babylonjs/loaders/glTF";
import GameScene from "./GameScene";
import MapScene from "./MapScene";
import ShopScene from "./ShopScene";
import {island_size, buyable, MovingVars} from "./constants";




export function preloadScenes(engine, analytics, event) {
    GameScene.createScene(engine);
    ShopScene.createScene(engine);
    GameScene.createEventListeners(event, analytics, engine);
    ShopScene.createEventListeners();
    MapScene.createScene(engine);
    MapScene.createEventListeners(event, analytics, engine);
     
}
/**
 * @deprecated
 * @returns 
 */
export function getGameScene() {
    console.warn("call to deprecated function getGameScene")
    createGameSceneObservers(gameScene["scene"]);
    ShopScene["scene"].onPointerObservable.clear();
    MovingVars.gamePage = "game"
    return gameScene;
}

/**
 * @deprecated
 * @param {*} analytics 
 * @param {*} event 
 * @param {*} engine 
 * @returns 
 */
export function getShopScene(analytics, event, engine) {
    console.warn("call to deprecated function getShopScene!");
    createShopSceneObservers(ShopScene["scene"], analytics, event, engine);
    gameScene["scene"].onPointerObservable.clear();
    MovingVars.gamePage = "shop"
    return ShopScene;
}
