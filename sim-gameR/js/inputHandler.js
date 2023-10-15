import {getShopScene, getGameScene } from "./sceneCreator";
import { island_size, buyable, MovingVars } from "./constants";
import "../node_modules/@babylonjs/loaders/glTF"
import * as BABYLON from "../node_modules/@babylonjs/core";
import Mine from "./Mine";
// import { Inspector } from "@babylonjs/inspector";

console.warn("Import of deprecated file inputHandler!")


function loadShop(engine, analytics, event) {
    engine.stopRenderLoop();


    

    const s = getShopScene(analytics, event, engine);
    const shopScene = s["scene"];
    const camera = s["camera"];
    MovingVars.gamePage = "shop"
    // shopInputHandler(camera, engine, analytics, event);
    engine.runRenderLoop(() => {
        shopScene.render();
    })

}

function loadGame(engine, analytics, event) {
    engine.stopRenderLoop();

    document.getElementById("shop").onclick = () => {
        console.log("Clicked on shop");
        event(analytics, "shop_open");
        loadShop(engine, analytics, event);
    }

    document.getElementById("shop").innerText = "Shop";

    const s = getGameScene(engine, island_size);
    // inputInit(s["camera"], false, {x:0, y:0}, analytics, event, engine)
    MovingVars.gamePage = "game"

    engine.runRenderLoop(() => {
        s["scene"].render();
    })
}

export function loadGameWithNewBuilding(engine, analytics, event, buildingNr, shopScene) {
    engine.stopRenderLoop();

    const s = getGameScene(engine, island_size);
    // inputInit(s["camera"], false, {x:0, y:0}, analytics, event, engine)

    document.getElementById("shop").onclick = () => {
        console.log("Clicked on shop");
        event(analytics, "shop_open");
        loadShop(engine, analytics, event);
    }

    document.getElementById("shop").innerText = "Shop";


    // create the new Building
    const loaded = BABYLON.SceneLoader.ImportMesh(
        "",
        "./3d/",
        buyable[buildingNr] + ".gltf",
        s["scene"],
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

    MovingVars.gamePage = "game"
    
    engine.runRenderLoop(() => {
        s["scene"].render();
    })
}


