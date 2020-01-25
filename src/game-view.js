import { WebGLRenderer, Scene } from "three";
import { resizeRendererToDisplaySize, resizeCameraToRenderSize } from "./utils";

const infoBox = document.querySelector("#info");

export class GameView {
  constructor(canvas, camera, objects) {
    this.renderer = new WebGLRenderer({ canvas });
    this.scene = new Scene();
    this.camera = camera;
    this.scene.add(...objects);
    requestAnimationFrame(() => this.animate());
  }

  // TODO: only remove and add changing meshes
  setMeshes(meshes) {
    this.scene.remove(...this.scene.children);
    this.scene.add(...meshes);
  }

  animate() {
    if (resizeRendererToDisplaySize(this.renderer)) {
      resizeCameraToRenderSize(this.renderer, this.camera);
    }

    const { x, y, z } = this.camera.position;
    infoBox.textContent = `${x}, ${y}, ${z}`;

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  }
}
