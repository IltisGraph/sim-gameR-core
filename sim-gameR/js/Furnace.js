import * as BABYLON from "@babylonjs/core";


export default class Furnace {
    /**
     * 
     * @param {BABYLON.Vector2} position 
     * @param {BABYLON.AbstractMesh} mesh 
     */
    constructor(position, mesh) {
        this.x = position.x;
        this.y = position.y;
        this.mesh = mesh;
    }

    update() {

    }

    onclick() {
        console.log("clicked furnace!");
    }

    getRTDBdata() {
        let out = {};
        out["x"] = this.mesh.position.x / 2;
        out["z"] = this.mesh.position.z / 2;
        out["type"] = "Furnace";

        return out;
    }

    loadFromData(data) {
        this.mesh.position.x = data["x"] * 2;
        this.mesh.position.z = data["z"] * 2;
    }
}