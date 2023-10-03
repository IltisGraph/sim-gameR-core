import * as BABYLON from "./node_modules/@babylonjs/core";
import "./node_modules/@babylonjs/loaders/glTF"
import {inputInit} from "./js/inputHandler";
import { Inspector } from "@babylonjs/inspector";


const canvas = document.getElementById("renderCanvas");

const engine = new BABYLON.Engine(canvas);

const island_size = 20;
let camera;

const createScene = function () {
	const scene = new BABYLON.Scene(engine);

    // scene.createDefaultCameraOrLight(true, false, true);
    scene.createDefaultLight();
    camera = new BABYLON.UniversalCamera("cam1", new BABYLON.Vector3(15, 20, 0), scene);
    camera.setTarget(new BABYLON.Vector3(15, 0, 15))
    // camera.attachControl(true);
    // camera.inputs.add()
    // camera.inputs.addMouseWheel();
    // camera.inputs.addVirtualJoystick();


    // const light = new BABYLON.PointLight("light", new BABYLON.Vector3(0, -1, 0), scene);
    const light2 = new BABYLON.SpotLight("slight", new BABYLON.Vector3(0, -1, 0), new BABYLON.Vector3(0, 5, 0), Math.PI / 3, 2, scene);

    const gizmo  = new BABYLON.LightGizmo()
    gizmo.light = light2;

    // const box = new BABYLON.MeshBuilder.CreateBox("box", {size: 10, width: 10, height: 1}, scene);
    const sand = BABYLON.SceneLoader.ImportMesh(
        "",
        "./3d/",
        "sand_floor.gltf",
        scene,
        function (meshes, particleSystems, skeletons, animationGroups) {
            const model = meshes[0];
            model.position.set(0, 5, 0);
            for (let x = 0; x < island_size; x++) {
                for (let y = 0; y < island_size; y++) {
                    const cloneName = "sandClone_" + x + "_" + y;
                    let m = model.clone(cloneName);
                    m.position.set(x * 2, 0, y * 2);
                    m.actionManager = new BABYLON.ActionManager(scene);
                    m.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
                        {trigger: BABYLON.ActionManager.OnPickTrigger},
                        (e) => {
                            console.log("clicked: " + m.name);
                        }
                    ))
                }
            }
        }
    );

    const wall = BABYLON.SceneLoader.ImportMesh(
        "",
        "./3d/",
        "wall_1_empty.gltf",
        scene,
        function (meshes, particleSystems, skeletons, animationGroups) {
            const model = meshes[0];
            model.position.set(4, 0, 4);
            const topLeft = model.clone("top-left-wall");
            topLeft.position.set(4, 0, 34);
            topLeft.rotate(BABYLON.Axis.Y, Math.PI - Math.PI / 2);
            const topRight = model.clone("top-right-wall");
            topRight.position.set(34, 0, 34);
            topRight.rotate(BABYLON.Axis.Y, Math.PI)
        }
    )
    const openWall = BABYLON.SceneLoader.ImportMesh(
        "",
        "./3d/",
        "wall_1_closed.gltf",
        scene,
        function (meshes, particleSystems, skeletons, aniamtionGroups) {
            const model = meshes[0];
            model.position.set(4, 0, 4);
            const bottomRight = model.clone("bottom-right-wall");
            bottomRight.position.set(34, 0, 4);
            bottomRight.rotate(BABYLON.Axis.Y, -(Math.PI / 2));

        }
    )


    // BABYLON.SceneLoader.ImportMesh(
    //     "",
    //     "./3d/",
    //     "mine.gltf",
    //     scene,
    //     function(meshes, particleSystems, skeletons, animationGroups) {
    //         const model = meshes[0];
    //         animationGroups[1].play(true);
    //     }
    // );
    

	return scene;
}

const scene = createScene();


engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener("resize", function() {
    engine.resize();
});

let tracking = false;
let pos = {x:0, y:0}

inputInit(camera, tracking, pos);
// Inspector.Show(scene, {});

