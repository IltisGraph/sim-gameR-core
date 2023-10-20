import * as BABYLON from "@babylonjs/core";


export default class Saw {
    /**
     * 
     * @param {BABYLON.Vector2} position 
     * @param {BABYLON.AbstractMesh} mesh 
     */
    constructor (position, mesh) {
        this.x = position.x;
        this.y = position.y;
        this.mesh = mesh;
    }

    update () {

    }

    onclick () {
        console.log("clicked on Saw");
    }

    getRTDBdata() {
        let out = {};
        out["x"] = this.mesh.position.x / 2;
        out["z"] = this.mesh.position.z / 2;
        out["type"] = "Saw";

        return out;
    }

    loadFromData(data) {
        this.mesh.position.x = data["x"];
        this.mesh.position.z = data["z"];
    }
}