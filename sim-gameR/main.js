import * as BABYLON from "./node_modules/@babylonjs/core";
import "./node_modules/@babylonjs/loaders/glTF";
import { getGameScene, getShopScene, preloadScenes } from "./js/sceneCreator";
// import { Inspector } from "@babylonjs/inspector";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics, logEvent } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getDatabase, set, child, ref, get, onValue } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getPerformance } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-performance.js";
import { getRemoteConfig, getValue, fetchConfig, activate } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-remote-config.js";
import Game from "./js/Game";
import GameScene from "./js/GameScene";
import ShopScene from "./js/ShopScene";
import MapScene from "./js/MapScene";
import { MovingVars, island_size } from "./js/constants";
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
const db = getDatabase(app);

let plot;

/**
 * checks if the user logs in for the first time
 */
function checkUser() {
    const user = localStorage.getItem("user_sim");
    get(child(ref(db), "users/" + user + "/name")).then((snapshot) => {
        if (!snapshot.exists()) {
            // first time
            // create the new user in the rtdb
            const username = window.prompt(getValue(remoteConfig, "new_username_german")._value);
            set(ref(db, "users/" + user + "/name"), username);
            window.alert("Erfolgreich " + username + " als Benutzernamen ausgewählt!");

            
            get(child(ref(db), "plots")).then((snapshot) => {
                // search for a empty village spot
                // we try randomly up to 50x, then we select the 1 we get
                const plots = snapshot.val();
                let rNum;
                console.log(plots)
                for (let i = 0; i < 50; i++) {
                    const r = Math.ceil(Math.random() * 36 + 1)
                    if (plots[r]["owner"] === "none") {
                        rNum = r;
                        break;
                    }
                }
                if (rNum == undefined) {
                    // 50x random did not find anything
                    for (let i = 1; i < 36 + 1; i++) {
                        if (plots[i]["owner"] === "none") {
                            rNum = i;
                            break;
                        }
                    }
                }
                if (rNum == undefined) {
                    window.alert("Sag sofort dem Admin (Roman) bescheid!");
                }
    
    
                let village = {};
                for (let x = 0; x < island_size; x++) {
                    for (let y = 0; y < island_size; y++) {
                        village[x + "|" + y] = 0;
                    }
                }
                plot = rNum;
                set(ref(db, "villages/" + rNum), village);
                set(ref(db, "users/" + user + "/plots/" + Date.now()), rNum)
                set(ref(db, "plots/" + rNum + "/owner"), user);
            })
            
            
        } else {
            // not first time
            get(child(ref(db), "users/" + user + "/plots")).then((snapshot) => {
                let keys = Object.keys(snapshot.val());
                plot = snapshot.val()[keys[0]];
                try {
                    game.plot = plot;
                } catch(e) {
                    console.log("WOW, you have reeeallly low latency! xD");
                }
                GameScene.load();
            })
        }
    })
}




remoteConfig.defaultConfig = {
    "shop_button_color": "#fa9507",
    "new_username_german" : "Gib deinen Ingame-Namen ein. Du musst dich weiterhin mit den erhaltenen Zugangsdaten anmelden!"
};

activate(remoteConfig);

await fetchConfig(remoteConfig);



const buy_button_color = getValue(remoteConfig, "shop_button_color");
console.log(buy_button_color);
document.getElementById("shop").style.backgroundColor = buy_button_color._value;


const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas);

preloadScenes(engine, analytics, logEvent);

const game = new Game(null, engine, logEvent, analytics, set, get, ref, db, child, plot);
GameScene.game = game;
ShopScene.game = game;
MapScene.game = game;
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
        checkUser();
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
        checkUser()
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

