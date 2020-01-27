import { Vector2 } from "three";

export class MouseControls {
  constructor(domElement, { sensitivity }) {
    this.domElement = domElement;
    this.sensitivity = sensitivity;
    this.delta = new Vector2(0, 0);
    this.initControls();
  }

  initControls() {
    const mousemoveHandler = event =>
      this.updateDelta(new Vector2(event.movementX, event.movementY));

    document.addEventListener("pointerlockchange", () => {
      if (document.pointerLockElement === this.domElement) {
        this.domElement.addEventListener("mousemove", mousemoveHandler);
      } else {
        this.domElement.removeEventListener("mousemove", mousemoveHandler);
      }
    });
  }

  getDelta() {
    const delta = this.delta.clone();
    this.delta = new Vector2(0, 0);
    return delta.multiplyScalar(this.sensitivity);
  }

  updateDelta(movement) {
    this.delta.add(movement);
  }
}
