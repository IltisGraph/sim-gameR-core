import * as BABYLON from "./node_modules/@babylonjs/core";
import "./node_modules/@babylonjs/loaders/glTF"
import { inputInit } from "./js/inputHandler";
import { preloadMeshes, getMesh } from "./js/loader";
import { createShopScene } from "./js/sceneCreator";
// import { Inspector } from "@babylonjs/inspector";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCbVEDwbAD-qJ4BxpCJshI8PiWyoCPpc7E",
    authDomain: "stock-gamer.firebaseapp.com",
    databaseURL: "https://stock-gamer-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "stock-gamer",
    storageBucket: "stock-gamer.appspot.com",
    messagingSenderId: "909890968673",
    appId: "1:909890968673:web:656d725ff3ce1ac3ea5e20",
    measurementId: "G-0SMBYN5DTF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);


const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas);

let user;


document.getElementById("submitBtn").onclick = function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, username + "@r.com", password).then((userCredential) => {
        user = userCredential.user;
        localStorage.setItem("user_sim", user.uid);
        // console.log(user)
        // console.log(user.uid)
        console.log("logged in!");
        localStorage.setItem("login_sim", "true");
        document.getElementById("myWindow").style = "display:none;";
        document.getElementById('authBlocker').style.display = "none";
        inputInit(camera, tracking, pos, analytics, logEvent, engine);


    }).catch((error) => {
        console.log("not logged in")
        console.error(error);
        window.alert(error);
    })
}


onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        user = auth.currentUser;
        document.getElementById("myWindow").style = "display:none;";
        document.getElementById('authBlocker').style.display = "none";
        inputInit(camera, tracking, pos, analytics, logEvent, engine);

    } else {
    }
});




const island_size = 20;



// const s = createGameScene(engine, island_size);
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




// const camera = s["camera"];
// const scene = s["scene"];




engine.runRenderLoop(function () {
    scene.render();
});

window.addEventListener("resize", function () {
    engine.resize();
});

let tracking = false;
let pos = { x: 0, y: 0 }

// Inspector.Show(scene, {});

