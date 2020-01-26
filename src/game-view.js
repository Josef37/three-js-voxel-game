import { WebGLRenderer, Scene } from "three";
import { resizeRendererToDisplaySize, resizeCameraToRenderSize } from "./utils";

export class GameView {
  constructor(controller, canvas, camera, objects) {
    this.controller = controller;
    this.renderer = new WebGLRenderer({ canvas });
    this.scene = new Scene();
    this.camera = camera;
    this.scene.add(...objects);
  }

  updateMeshes({ meshesToAdd, meshesToRemove }) {
    if (meshesToAdd.length) this.scene.remove(...meshesToRemove);
    if (meshesToRemove.length) this.scene.add(...meshesToAdd);
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
