import { Vector3, Clock } from 'three'

/** Key controls for moving objects */
export class KeyControls {
  /**
   * @param {HTMLElement} domElement The element to listen to
   * @param {Object} settings
   * @param {number} settings.speed
   */
  constructor (domElement, { speed }) {
    this.speed = speed
    /** Clocks running while keys are pressed */
    this.keyClocks = {
      w: new Clock(false),
      s: new Clock(false),
      a: new Clock(false),
      d: new Clock(false),
      e: new Clock(false),
      q: new Clock(false)
    }
    /** keeping track of how long a key got pressed */
    this.keyDurations = {
      w: 0,
      s: 0,
      a: 0,
      d: 0,
      e: 0,
      q: 0
    }
    this.initControls(domElement)
  }

  /**
   * Inits keydown and keyup listeners on the element
   * @param {HTMLElement} domElement the element to listen to
   */
  initControls (domElement) {
    domElement.addEventListener('keydown', e => {
      this.startKeyClock(e.key)
    })

    domElement.addEventListener('keyup', e => {
      this.stopKeyClock(e.key)
    })
  }

  /**
   * Calculates movement from key presses and resets the counters
   * @returns {Vector3} the movement vector since the last time this function was called
   */
  getMovementDelta () {
    // Update to the newest clock state
    for (const key in this.keyClocks) {
      this.keyDurations[key] += this.keyClocks[key].getDelta()
    }

    // Sum all key press durations
    const movementVector = new Vector3()
    for (const key in this.keyDurations) {
      const duration = this.keyDurations[key]
      this.keyDurations[key] = 0
      const vector = KeyControls.keyVectors[key]
        .clone()
        .multiplyScalar(duration)
      movementVector.add(vector)
    }
    return movementVector.multiplyScalar(this.speed)
  }

  /**
   * Starts the clock for the given key
   * @param {string} key
   */
  startKeyClock (key) {
    const clock = this.keyClocks[key]
    if (clock) {
      clock.start()
    }
  }

  /**
   * Stops the clock for the given key and adds newest delta to counters
   * @param {string} key
   */
  stopKeyClock (key) {
    const clock = this.keyClocks[key]
    if (clock && this.keyDurations[key] !== undefined) {
      clock.stop()
      this.keyDurations[key] += clock.getDelta()
    }
  }
}

KeyControls.keyVectors = {
  w: new Vector3(0, 0, -1), // forward
  s: new Vector3(0, 0, 1), // backward
  a: new Vector3(-1, 0, 0), // left
  d: new Vector3(1, 0, 0), // right
  e: new Vector3(0, -1, 0), // down
  q: new Vector3(0, 1, 0) // up
}
