import { WebGLRenderer, Scene, DirectionalLight, Fog } from "three";
import { resizeRendererToDisplaySize, resizeCameraToRenderSize } from "./utils";

export class GameView {
  constructor(canvas, player) {
    this.renderer = new WebGLRenderer({ canvas });
    this.renderer.shadowMap.enabled = true;
    this.scene = new Scene();
    this.scene.add(player);

    const light = new DirectionalLight();
    light.position.set(10, 20, 0);
    light.castShadow = true;
    this.scene.add(light);
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
