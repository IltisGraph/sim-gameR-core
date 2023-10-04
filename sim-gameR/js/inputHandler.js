import { createShopScene, createGameScene } from "./sceneCreator";
import { island_size } from "./constants";
// import { Inspector } from "@babylonjs/inspector";


export function inputInit(camera, tracking, pos, analytics, event, engine) {
    window.addEventListener("pointerdown", (event) => {
        // console.log("X: " + event.clientX);
        // console.log("Y: " + event.clientY);
        tracking = true;
        pos.x = event.clientX;
        pos.y = event.clientY;
    });

    document.getElementById("shop").onclick = () => {
        console.log("Clicked on shop");
        event(analytics, "shop_open");
        loadShop(engine, analytics, event);
    }
    
    window.addEventListener("pointermove", (event) => {
        if (!tracking) {
            return;
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
        tracking = false;
    })
}

function shopInputHandler(camera, engine, analytics, event) {

    document.getElementById("shop").innerText = "Verlassen";
    document.getElementById("shop").onclick = () => {
        loadGame(engine, analytics, event);
    }

    let pos = {x:0, y:0}
    let tracking = false;
    window.addEventListener("pointerdown", (event) => {
        // console.log("X: " + event.clientX);
        // console.log("Y: " + event.clientY);
        tracking = true;
        pos.x = event.clientX;
        pos.y = event.clientY;
    });
    
    window.addEventListener("pointermove", (event) => {
        if (!tracking) {
            return;
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
        tracking = false;
    })
}

function loadShop(engine, analytics, event) {
    engine.stopRenderLoop();

    const s = createShopScene(engine);
    const shopScene = s["scene"];
    const camera = s["camera"];
    shopInputHandler(camera, engine, analytics, event);
    engine.runRenderLoop(() => {
        shopScene.render();
    })

}

function loadGame(engine, analytics, event) {
    engine.stopRenderLoop();

    const s = createGameScene(engine, island_size);
    inputInit(s["camera"], false, {x:0, y:0}, analytics, event, engine)

    engine.runRenderLoop(() => {
        s["scene"].render();
    })
}