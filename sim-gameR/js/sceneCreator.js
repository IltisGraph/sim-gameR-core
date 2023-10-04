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


export function createGameScene(engine, island_size) {
    console.log("Loading gameScene!");
    const scene = new BABYLON.Scene(engine);

    // scene.createDefaultCameraOrLight(true, false, true);
    scene.createDefaultLight();
    const camera = new BABYLON.UniversalCamera("cam1", new BABYLON.Vector3(15, 20, 0), scene);
    camera.setTarget(new BABYLON.Vector3(15, 0, 15))
    // camera.attachControl(true);
    // camera.inputs.add()
    // camera.inputs.addMouseWheel();
    // camera.inputs.addVirtualJoystick();


    // const light = new BABYLON.PointLight("light", new BABYLON.Vector3(0, -1, 0), scene);


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
                        { trigger: BABYLON.ActionManager.OnPickTrigger },
                        (e) => {
                            console.log("clicked: " + m.name);
                        }
                    ))
                }
            }
        }
    );
    // sand.position._y = 5;

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

    return {"scene": scene, "camera": camera}
}