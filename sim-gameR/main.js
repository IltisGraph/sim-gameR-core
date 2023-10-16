import * as BABYLON from "./node_modules/@babylonjs/core";
import "./node_modules/@babylonjs/loaders/glTF"
import { getGameScene, getShopScene, preloadScenes } from "./js/sceneCreator";
// import { Inspector } from "@babylonjs/inspector";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getPerformance } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-performance.js";
import { getRemoteConfig, getValue, fetchConfig, activate } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-remote-config.js";
import Game from "./js/Game";
import GameScene from "./js/GameScene";
import ShopScene from "./js/ShopScene";
import { MovingVars } from "./js/constants";
;
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
const perf = getPerformance(app);
const remoteConfig = getRemoteConfig(app);

remoteConfig.defaultConfig = {
    "shop_button_color": "#fa9507"
};

activate(remoteConfig);

fetchConfig(remoteConfig);



const buy_button_color = getValue(remoteConfig, "shop_button_color");
document.getElementById("shop").style.backgroundColor = buy_button_color._value;


const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas);

preloadScenes(engine, analytics, logEvent);

const game = new Game(null, engine, logEvent, analytics);
GameScene.game = game;
ShopScene.game = game;
game.sceneClass = GameScene;
game.setScene(GameScene);



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
        localStorage.setItem("user_sim", userCredential.uid);
        // inputInit(camera, tracking, pos, analytics, logEvent, engine);



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
        localStorage.setItem("user_sim", user.uid);
        // inputInit(camera, tracking, pos, analytics, logEvent, engine);

    } else {
    }
});



window.addEventListener("resize", function () {
    engine.resize();
});

let tracking = false;
let pos = { x: 0, y: 0 }

// Inspector.Show(scene, {});

