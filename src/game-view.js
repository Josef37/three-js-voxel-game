import { WebGLRenderer, Scene, DirectionalLight, Fog } from "three";
import { resizeRendererToDisplaySize, resizeCameraToRenderSize } from "./utils";

export class GameView {
  constructor(controller, canvas, camera) {
    this.controller = controller;
    this.renderer = new WebGLRenderer({ canvas });
    this.renderer.shadowMap.enabled = true;
    this.scene = new Scene();
    this.camera = camera;

    // TODO add to player (make player Object3D)
    const light = new DirectionalLight();
    light.position.set(10, 20, 0);
    light.castShadow = true;
    this.scene.add(light);

    // this.scene.fog = new Fog(0x000000, 1, 100);
  }

  updateMeshes({ meshesToAdd, meshesToRemove }) {
    if (meshesToRemove.length) this.scene.remove(...meshesToRemove);
    if (meshesToAdd.length) this.scene.add(...meshesToAdd);
  }

  draw() {
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    if (resizeRendererToDisplaySize(this.renderer)) {
      resizeCameraToRenderSize(this.renderer, this.camera);
    }
  }

  setCameraPosition(position) {
    this.camera.position.copy(position);
  }
}
