import {
  Vector2,
  TextureLoader,
  Sprite,
  SpriteMaterial,
  NearestFilter
} from "three";

export class MouseControls {
  constructor(domElement, { sensitivity }) {
    this.domElement = domElement;
    this.sensitivity = sensitivity;
    this.delta = new Vector2(0, 0);
    this.initControls();
  }

  static loadCursorSprite() {
    const cursorTexture = new TextureLoader().load("assets/cross.png");
    cursorTexture.magFilter = NearestFilter;
    cursorTexture.minFilter = NearestFilter;
    var cursorMaterial = new SpriteMaterial({
      map: cursorTexture,
      opacity: 0.7
    });
    var cursorSprite = new Sprite(cursorMaterial);
    cursorSprite.position.x = 0;
    cursorSprite.position.y = 0;
    cursorSprite.position.z = -0.1;
    cursorSprite.scale.set(0.0033, 0.0033, 0.0033);
    return cursorSprite;
  }

  initControls() {
    const mousemoveHandler = event =>
      this.updateDelta(new Vector2(event.movementX, event.movementY));

    document.addEventListener("pointerlockchange", () => {
      if (document.pointerLockElement === this.domElement) {
        this.domElement.addEventListener("mousemove", mousemoveHandler);
      } else {
        this.domElement.removeEventListener("mousemove", mousemoveHandler);
      }
    });
  }

  getDelta() {
    const delta = this.delta.clone();
    this.delta = new Vector2(0, 0);
    return delta.multiplyScalar(this.sensitivity);
  }

  updateDelta(movement) {
    this.delta.add(movement);
  }
}
