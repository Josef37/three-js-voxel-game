import { World } from "./world";
import { Player } from "./player";
import { GameView } from "./game-view";
import { MouseFocus } from "./mouse-focus";

const infoBox = document.querySelector("#info");

export class GameController {
  constructor() {
    const canvas = document.querySelector("#c");
    this.world = new World();
    this.player = new Player(0, 20, 50);
    this.player.initControls(canvas);
    this.currentMeshes = [];
    this.view = new GameView(canvas, this.player);
    this.mouseFocus = new MouseFocus();
    this.initMouseEventHandler(canvas);
    this.addResizeHandler();
  }

  initMouseEventHandler(canvas) {
    document.addEventListener("click", e => {
      if (!document.pointerLockElement) {
        canvas.requestPointerLock();
        return;
      }
      switch (e.button) {
        case 0: // main / left mouse button
          this.removeBlock();
          break;
        case 2: // secondary / right mouse button
          this.placeBlock();
          break;
      }
    });
  }

  addResizeHandler() {
    window.addEventListener("resize", () =>
      this.view.resize(this.player.getCamera())
    );
  }

  animate() {
    this.player.updatePosition();
    this.player.updateRotation();
    this.updateMeshes();
    this.mouseFocus.updateFocus(this.player.getCamera(), this.currentMeshes);
    this.view.draw(this.player.getCamera());

    const pos = this.mouseFocus.getNewBlockPosition();
    infoBox.textContent = pos
      ? `${pos.x}, ${pos.y}, ${pos.z}`
      : "Nö, einfach nö!";

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

  placeBlock() {
    const newBlockPosition = this.mouseFocus.getNewBlockPosition();
    if (newBlockPosition) this.world.placeBlock(newBlockPosition);
  }

  removeBlock() {
    const blockPosition = this.mouseFocus.getBlockPosition();
    if (blockPosition) this.world.removeBlock(blockPosition);
  }
}
