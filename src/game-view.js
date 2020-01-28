import { WebGLRenderer, Scene } from "three";
import { resizeRendererToDisplaySize, resizeCameraToRenderSize } from "./utils";

export class GameView {
  constructor(canvas, player) {
    this.renderer = new WebGLRenderer({ canvas });
    this.renderer.shadowMap.enabled = true;
    this.scene = new Scene();
    this.scene.add(player);
  }

  updateMeshes({ meshesToAdd, meshesToRemove }) {
    if (meshesToRemove.length) this.scene.remove(...meshesToRemove);
    if (meshesToAdd.length) this.scene.add(...meshesToAdd);
  }

  draw(camera) {
    this.renderer.render(this.scene, camera);
  }

  resize(camera) {
    if (resizeRendererToDisplaySize(this.renderer)) {
      resizeCameraToRenderSize(this.renderer, camera);
    }
  }
}
