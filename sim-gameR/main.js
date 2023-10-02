import * as BABYLON from "@babylonjs/core";
import "@babylonjs/loaders/glTF"

const canvas = document.getElementById("renderCanvas");

const engine = new BABYLON.Engine(canvas);

const createScene = function () {
	const scene = new BABYLON.Scene(engine);

    // scene.createDefaultCameraOrLight(true, false, true);
    scene.createDefaultLight();
    const camera = new BABYLON.UniversalCamera("cam1", new BABYLON.Vector3(0, 5, -10), scene);
    camera.attachControl(true);
    camera.inputs.addMouseWheel();

    // const light = new BABYLON.PointLight("light", new BABYLON.Vector3(0, -1, 0), scene);
    const light2 = new BABYLON.SpotLight("slight", new BABYLON.Vector3(0, -1, 0), new BABYLON.Vector3(0, 5, 0), Math.PI / 3, 2, scene);

    const gizmo  = new BABYLON.LightGizmo()
    gizmo.light = light2;

    const box = new BABYLON.MeshBuilder.CreateBox("box", {size: 10, width: 10, height: 1}, scene);

    BABYLON.SceneLoader.ImportMesh(
        "",
        "./3d/",
        "mine.gltf",
        scene,
        function(meshes, particleSystems, skeletons, animationGroups) {
            const model = meshes[0];
            animationGroups[1].play(true);
        }
    );
    

	return scene;
}

const scene = createScene();


engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener("resize", function() {
    engine.resize();
});