import { PerspectiveCamera, Object3D, DirectionalLight, Vector3 } from 'three'
import { KeyControls } from './key-controls'
import { MouseControls } from './mouse-controls'
import { CollisionObject } from './collision-object'

/** The Player object, which has a camera and light source attatched */
export class Player extends CollisionObject {
  constructor (domElement, position) {
    super(position)
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

  /**
   * Updates the player objects position according to key input
   * @param {Array<Object3D>} objects objects to collide with
   */
  updatePosition (timeDelta, objects) {
    const keyVector = this.keyControls.getMovementDelta().applyMatrix4(this.rotationHelper.matrix)
    const gravity = new Vector3(0, 1, 0).multiplyScalar(timeDelta)
    this.move(
      keyVector.add(gravity),
      objects
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
