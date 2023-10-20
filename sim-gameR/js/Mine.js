import * as BABYLON from "@babylonjs/core";
export default class Mine {
    
    /**
     * 
     * @param {BABYLON.Vector2} position 
     * @param {BABYLON.AbstractMesh} mesh 
     */
    constructor(position, mesh) {
        this.x = position._x;
        this.y = position._y;
        this.mesh = mesh;
    }

    update() {
        // this.mesh.position.x = this.x;
        // this.mesh.position.y = this.y;
    }

    onclick() {
        console.log("triggered mine onclick function")
    }
    
    getRTDBdata() {
        let out = {};
        out["x"] = this.mesh.position.x / 2;
        out["z"] = this.mesh.position.z / 2;
        out["type"] = "Mine";

        return out;
    }

    loadFromData(data) {
        this.mesh.position.x = data["x"] * 2;
        this.mesh.position.z = data["z"] * 2;
    }
}