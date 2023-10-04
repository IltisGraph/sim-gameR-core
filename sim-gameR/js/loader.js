import * as BABYLON from "../node_modules/@babylonjs/core";
import "../node_modules/@babylonjs/loaders/glTF";

let loadedMeshes = {};
let gltfNames = ["mine", "ofen_aus", "sand_floor", "sand", "schleifer_diamant", "schleifer_eisen", "schleifer_emerald", "wall_1_closed", "wall_1_empty"];
/**
 * @deprecated
 */
function loadGLTFName(name, scene) {
    const mesh = BABYLON.SceneLoader.ImportMesh(
        "",
        "./3d/",
        name + ".gltf",
        scene,
        function(meshes, particleSystems, skeletons, animationGroups) {
            console.log("Loaded mesh!");
            const model = meshes[0];
            loadedMeshes[name] = model;
        }

    )
}

/**
 * @deprecated
 */
export function preloadMeshes(scene, engine) {
    const preloadScene = new BABYLON.Scene(engine);
    for (let name of gltfNames) {
        loadGLTFName(name, scene)
    }
    console.log("Finished loading Meshes!");
    console.log(loadedMeshes);
}
/** modelName -> the filename; name --> the name id of the returned mesh */

/**
 * @deprecated
 */
export function getMesh(modelName, name) {
    return loadedMeshes[modelName].clone(name);
}
