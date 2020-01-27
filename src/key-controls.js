import { Vector3, Clock } from "three";

export class KeyControls {
  constructor(domElement, { speed }) {
    this.domElement = domElement;
    this.speed = speed;
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

  initControls() {
    document.addEventListener("keydown", e => {
      this.startKeyClock(e.key);
    });

    document.addEventListener("keyup", e => {
      this.stopKeyClock(e.key);
    });
  }

  getDelta() {
    for (const key in this.keyClocks) {
      this.keyDurations[key] += this.keyClocks[key].getDelta();
    }

    const movementVector = new Vector3();
    for (const key in this.keyDurations) {
      const duration = this.keyDurations[key];
      this.keyDurations[key] = 0;
      const vector = KeyControls.keyVectors[key]
        .clone()
        .multiplyScalar(duration);
      movementVector.add(vector);
    }
    return movementVector.multiplyScalar(this.speed);
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

KeyControls.keyVectors = {
  w: new Vector3(0, 0, -1),
  s: new Vector3(0, 0, 1),
  a: new Vector3(-1, 0, 0),
  d: new Vector3(1, 0, 0),
  e: new Vector3(0, -1, 0),
  q: new Vector3(0, 1, 0)
};
