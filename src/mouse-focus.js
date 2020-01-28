import { Raycaster } from "three";

export class MouseFocus {
  constructor() {
    this.intersection = null;
    this.blockPosition = this.raycaster = new Raycaster();
    this.raycaster.near = 0.1;
    this.raycaster.far = 10;
  }

  updateFocus(camera, meshes) {
    this.raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const intersects = this.raycaster.intersectObjects(meshes);
    if (intersects.length) {
      this.intersection = intersects[0];
    } else {
      this.intersection = null;
    }
  }

  getFocusedPosition() {
    return this.intersection ? this.intersection.point : null;
  }

  getBlockPosition() {
    if (!this.intersection) return null;
    return this.followNormal(-0.5).floor();
  }

  getNewBlockPosition() {
    if (!this.intersection) return null;
    return this.followNormal(0.5).floor();
  }

  /**
   * Following normal from point with given length.
   * (helps with computing which block was clicked by moving inside it)
   * @param {number} length length of vector
   */
  followNormal(length) {
    const normal = this.intersection.face.normal.clone();
    const position = this.intersection.point.clone();
    // Follow half the face normal to land inside the block
    return position.add(normal.multiplyScalar(length));
  }
}
