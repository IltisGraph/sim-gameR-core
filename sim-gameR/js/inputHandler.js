import {getShopScene, getGameScene } from "./sceneCreator";
import { island_size, buyable, MovingVars } from "./constants";
import "../node_modules/@babylonjs/loaders/glTF"
import * as BABYLON from "../node_modules/@babylonjs/core";
// import { Inspector } from "@babylonjs/inspector";


export function inputInit(camera, tracking, pos, analytics, event, engine) {
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

    document.getElementById("shop").onclick = () => {
        console.log("Clicked on shop");
        event(analytics, "shop_open");
        loadShop(engine, analytics, event);
    }

    document.getElementById("shop").innerText = "Shop";
    
    window.addEventListener("pointermove", (event) => {
        if (!tracking) {
            return;
        }
        if (MovingVars.gamePage !== "game") {
            return
        }
    
        if (camera.position._x > 40 || camera.position._x < -40 || camera.position._z > 40 || camera.position._z < -40) {
            if (camera.position._x > 5) {
                camera.position._x--;
            }
            if (camera.position._x < -35) {
                camera.position._x++;
            }
            if (camera.position._z > 5) {
                camera.position._z--;
            }
            if (camera.position._z < -35) {
                camera.position._z++;
            }
            return;
        }
    
        let x = event.clientX;
        let y = event.clientY;
    
        const slower = .001;
    
        if (x > pos.x) {
            camera.position._x -= ((x - pos.x) - camera.position._x) * slower;
        } else if (x < pos.x) {
            camera.position._x -= ((x - pos.x) - Math.abs(camera.position._x)) * slower;
            
        }
    
        if (y > pos.y) {
            camera.position._z += ((y - pos.y) - camera.position._z) * slower;
        } else if (y < pos.y) {
            camera.position._z += ((y - pos.y) - Math.abs(camera.position._z)) * slower;
        }
        
    });
    
    window.addEventListener("pointerup", (event) => {
        if (MovingVars.gamePage !== "game") {
            return
        }
        tracking = false;
    })
}

export function shopInputHandler(camera, engine, analytics, event) {

   

    let pos = {x:0, y:0}
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
    
        if (camera.position._x < 0 || camera.position._x > 10) {
            if (camera.position._x > 10) {
                camera.position._x--;
            }
            if (camera.position._x < 0) {
                camera.position._x++;
            }
            
            return;
        }
    
        let x = event.clientX;
        let y = event.clientY;
    
        const slower = .001;
    
        if (x > pos.x) {
            camera.position._x -= ((x - pos.x) - camera.position._x) * slower;
        } else if (x < pos.x) {
            camera.position._x -= ((x - pos.x) - Math.abs(camera.position._x)) * slower;
            
        }
    
        
    });
    
    window.addEventListener("pointerup", (event) => {
        if (MovingVars.gamePage !== "shop") {
            return
        }
        tracking = false;

        // see if the buy button is pressed
        //width: 270px; height: 150px
        


    })
}

function loadShop(engine, analytics, event) {
    engine.stopRenderLoop();


    document.getElementById("shop").innerText = "Verlassen";
    document.getElementById("shop").onclick = () => {
        loadGame(engine, analytics, event);
        // remove the scene listener from the shop
        getShopScene(analytics, event, engine)["scene"].onPointerObservable.clear();
    }

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


