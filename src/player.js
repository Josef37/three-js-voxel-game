import { Vector3, PerspectiveCamera, Clock, Object3D } from "three";
import { Controls } from "./controls";

export class Player extends Object3D {
  constructor(x = 0, y = 0, z = 0) {
    super();
    this.position.set(x, y, z);
    this.camera = new PerspectiveCamera(75, 2, 0.1, 2000);
    this.camera.lookAt(0, -1, -5);
    this.add(this.camera);

    this.controls = new Controls({ speed: 50 });
  }

  getCamera() {
    return this.camera;
  }

  updatePosition() {
    this.position.add(this.controls.getMovementVector());
  }
}
