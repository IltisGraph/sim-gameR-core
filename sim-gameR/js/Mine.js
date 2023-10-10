export default class Mine {
    constructor(x, y, mesh) {
        this.x = x;
        this.y = y;
        this.mesh = mesh;
    }

    update() {
        this.mesh.position._x = this.x;
        this.mesh.position._y = this.y;
    }

    onclick() {

    }
}