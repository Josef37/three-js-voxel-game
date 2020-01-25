import { Vector3, PerspectiveCamera } from "three";

export class Player {
  constructor(x = 0, y = 0, z = 0) {
    this.position = new Vector3(x, y, z);
    this.camera = new PerspectiveCamera(75, 2, 0.1, 2000);
    this.camera.position.set(this.position.x, this.position.y, this.position.z);
  }
}
