import { GameController } from "./game-controller";

const gameController = new GameController();
requestAnimationFrame(() => gameController.animate());
