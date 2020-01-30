import { PerspectiveCamera, Object3D, DirectionalLight } from 'three'
import { KeyControls } from './key-controls'
import { MouseControls } from './mouse-controls'

/** The Player object, which has a camera and light source attatched */
export class Player extends Object3D {
  constructor (domElement, { x, y, z }) {
    super()
    this.position.set(x, y, z)
    /** Rotates around y-axis (horizontal mouse movement) + has camera attached */
    this.rotationHelper = new Object3D()
    this.add(this.rotationHelper)
    this.camera = new PerspectiveCamera(75, 2, 0.1, 2000)
    this.camera.lookAt(0, -1, -5)
    this.rotationHelper.add(this.camera)

    this.camera.add(MouseControls.loadCursorSprite())
    this.keyControls = new KeyControls(domElement, { speed: 20 })
    this.mouseControls = new MouseControls(domElement, { sensitivity: 0.01 })

    this.light = new DirectionalLight()
    this.light.position.set(-10, 30, -15)
    this.light.target = this
    this.add(this.light)
  }

  getCamera () {
    return this.camera
  }

  /** Updates the player objects position accourding to key input */
  updatePosition () {
    this.translateOnAxis(
      this.keyControls.getMovementDelta().applyMatrix4(this.rotationHelper.matrix),
      1
    )
  }

  /**
   * Updates the rotation according to mouse input.
   * Turns the rotation helper left/right (y-axis), and the camera up/down (x-axis)
   */
  updateRotation () {
    const mouseMovement = this.mouseControls.getDelta()
    this.rotationHelper.rotateY(-mouseMovement.x)
    this.camera.rotateX(-mouseMovement.y)
    this.clampCameraRotationX()
  }

  /**
   * Clamps the cameras rotation to [-pi/2, pi/2]
   */
  clampCameraRotationX () {
    const cameraRotation = this.camera.rotation.x // always in [-pi, pi]
    if (Math.PI / 2 < cameraRotation) {
      this.camera.rotation.x = Math.PI / 2
    } else if (cameraRotation < -Math.PI / 2) {
      this.camera.rotation.x = -Math.PI / 2
    }
  }
}
