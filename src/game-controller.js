import { World } from "./world";
import { Player } from "./player";
import { GameView } from "./game-view";

const infoBox = document.querySelector("#info");

export class GameController {
  constructor() {
    this.world = new World();
    this.player = new Player(0, 20, 50);
    const canvas = document.querySelector("#c");
    this.currentMeshes = [];
    this.view = new GameView(canvas, this.player);
  }

  animate() {
    this.player.updatePosition();
    this.updateMeshes();
    this.view.resize(this.player.getCamera());
    this.view.draw(this.player.getCamera());

    infoBox.textContent = `${this.player.position.x}, ${this.player.position.y}, ${this.player.position.z}`;

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
