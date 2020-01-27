import { World } from "./world";
import { Player } from "./player";
import { GameView } from "./game-view";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class GameController {
  constructor() {
    this.world = new World();
    this.player = new Player(0, 20, 50);
    const canvas = document.querySelector("#c");
    this.controls = new OrbitControls(this.player.camera, canvas);
    this.controls.addEventListener("change", () =>
      this.updatePlayerPosition(this.player.camera.position)
    );
    this.currentMeshes = [];
    this.view = new GameView(this, canvas, this.player.camera);
  }

  animate() {
    this.view.resize();
    this.view.setCameraPosition(this.player.position);
    this.updateMeshes();
    this.view.draw();
    requestAnimationFrame(() => this.animate());
  }

  updatePlayerPosition(position) {
    this.player.position.copy(position);
  }

  updateMeshes() {
    const newMeshes = this.world.getMeshes(this.player.position);
    const meshesToAdd = newMeshes.filter(
      mesh => !this.currentMeshes.includes(mesh)
    );
    const meshesToRemove = this.currentMeshes.filter(
      mesh => !newMeshes.includes(mesh)
    );
    this.currentMeshes = newMeshes;
    this.view.updateMeshes({ meshesToAdd, meshesToRemove });
  }
}
