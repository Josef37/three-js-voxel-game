import { PerspectiveCamera, Object3D, DirectionalLight } from "three";
import { KeyControls } from "./key-controls";
import { MouseControls } from "./mouse-controls";

export class Player extends Object3D {
  constructor(x = 0, y = 0, z = 0) {
    super();
    this.position.set(x, y, z);
    this.rotationHelper = new Object3D();
    this.add(this.rotationHelper);
    this.camera = new PerspectiveCamera(75, 2, 0.1, 2000);
    this.camera.lookAt(0, -1, -5);
    this.rotationHelper.add(this.camera);

    this.keyControls;
    this.mouseControls;
    this.camera.add(MouseControls.loadCursorSprite());

    this.light = new DirectionalLight();
    this.light.position.set(-10, 30, -15);
    this.light.target = this;
    this.add(this.light);
  }

  initControls(domElement) {
    this.keyControls = new KeyControls(domElement, { speed: 20 });
    this.mouseControls = new MouseControls(domElement, { sensitivity: 0.01 });
  }

  getCamera() {
    return this.camera;
  }

  updatePosition() {
    this.translateOnAxis(
      this.keyControls.getDelta().applyMatrix4(this.rotationHelper.matrix),
      1
    );
  }

  updateRotation() {
    const mouseMovement = this.mouseControls.getDelta();
    this.rotationHelper.rotateY(-mouseMovement.x);
    this.camera.rotateX(-mouseMovement.y);
    this.clampRotationX();
  }

  clampRotationX() {
    const cameraRotation = this.camera.rotation.x;
    if (Math.PI / 2 < cameraRotation) {
      this.camera.rotation.x = Math.PI / 2;
    } else if (cameraRotation < -Math.PI / 2) {
      this.camera.rotation.x = -Math.PI / 2;
    }
  }
}
