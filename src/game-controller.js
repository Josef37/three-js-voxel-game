import { World } from "./world";
import { Player } from "./player";
import { GameView } from "./game-view";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class GameController {
  constructor() {
    this.world = new World();
    this.player = new Player(0, 2, 10);
    const canvas = document.querySelector("#c");
    this.controls = new OrbitControls(this.player.camera, canvas);
    this.controls.addEventListener("change", () => this.updatePlayerPosition());
    this.view = new GameView(
      canvas,
      this.player.camera,
      this.world.getMeshes(this.player.position)
    );
  }

  updatePlayerPosition() {
    this.player.position = this.player.camera.position;
    this.view.setMeshes(this.world.getMeshes(this.player.position));
  }
}
