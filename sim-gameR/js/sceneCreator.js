import * as BABYLON from "../node_modules/@babylonjs/core";
import "../node_modules/@babylonjs/loaders/glTF";



export function createShopScene(engine) {
    const scene = new BABYLON.Scene(engine);
    scene.createDefaultLight();
    const buyable = ["mine", "ofen_aus", "schleifer_diamant"];
    const camera = new BABYLON.UniversalCamera("shopCam", new BABYLON.Vector3(0, 0, 0), scene);
    // camera.attachControl(true);
    let positions = [];
    for (let i = 0; i < buyable.length; i++) {
        const mesh = BABYLON.SceneLoader.ImportMesh(
            "",
            "./3d/",
            buyable[i] + ".gltf",
            scene,
            function(meshes, particleSystems, skeletons, animationGroups) {
                console.log("Loaded mesh!");
                const model = meshes[0];
                model.position.set(i * 5, 0, 10);
                for (let group = 0; group < animationGroups.length; group++) {
                    animationGroups[group].stop();
                }
            }
    
        )
    }


    return {"scene":scene, "camera":camera};
}


