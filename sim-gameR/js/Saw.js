import { AbstractMesh, Vector2 } from "@babylonjs/core";

export default class Saw {
    /**
     * 
     * @param {Vector2} position 
     * @param {AbstractMesh} mesh 
     */
    constructor (position, mesh) {
        this.x = position._x;
        this.y = position._y;
        this.mesh = mesh;
    }

    update () {

    }

    onclick () {
        console.log("clicked on Saw");
    }
}