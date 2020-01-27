import { Vector3, PerspectiveCamera, Clock } from "three";

export class Player {
  constructor(x = 0, y = 0, z = 0) {
    this.position = new Vector3(x, y, z);
    this.camera = new PerspectiveCamera(75, 2, 0.1, 2000);
    this.camera.position.set(this.position.x, this.position.y, this.position.z);

    this.speed = 50;
    this.keyClocks = {
      w: new Clock(false),
      s: new Clock(false),
      a: new Clock(false),
      d: new Clock(false),
      e: new Clock(false),
      q: new Clock(false)
    };
    this.keyDurations = {
      w: 0,
      s: 0,
      a: 0,
      d: 0,
      e: 0,
      q: 0
    };
    this.initControls();
  }

  updatePosition() {
    for (const key in this.keyClocks) {
      this.keyDurations[key] += this.keyClocks[key].getDelta();
    }

    const movementVector = new Vector3();
    for (const key in this.keyDurations) {
      const duration = this.keyDurations[key];
      this.keyDurations[key] = 0;
      const vector = Player.keyVectors[key].clone().multiplyScalar(duration);
      movementVector.add(vector);
    }
    this.position.add(movementVector.multiplyScalar(this.speed));
  }

  initControls() {
    // TODO: Canvas as EventListener?
    document.addEventListener("keydown", e => {
      this.startKeyClock(e.key);
    });

    document.addEventListener("keyup", e => {
      this.stopKeyClock(e.key);
    });
  }

  startKeyClock(key) {
    const clock = this.keyClocks[key];
    if (clock) {
      clock.start();
    }
  }

  stopKeyClock(key) {
    const clock = this.keyClocks[key];
    if (clock && this.keyDurations.hasOwnProperty(key)) {
      clock.stop();
      this.keyDurations[key] += clock.getDelta();
    }
  }
}

Player.keyVectors = {
  w: new Vector3(0, 0, -1),
  s: new Vector3(0, 0, 1),
  a: new Vector3(-1, 0, 0),
  d: new Vector3(1, 0, 0),
  e: new Vector3(0, -1, 0),
  q: new Vector3(0, 1, 0)
};
