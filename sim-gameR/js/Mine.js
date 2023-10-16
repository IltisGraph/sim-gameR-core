import { AbstractMesh, Vector2 } from "@babylonjs/core";

export default class Mine {
    
    /**
     * 
     * @param {Vector2} position 
     * @param {AbstractMesh} mesh 
     */
    constructor(position, mesh) {
        this.x = position._x;
        this.y = position._y;
        this.mesh = mesh;
    }

    update() {
        this.mesh.position._x = this.x;
        this.mesh.position._y = this.y;
    }

    onclick() {
        console.log("triggered mine onclick function")
    }
}