import { Raycaster, Object3D } from 'three'

export class CollisionObject extends Object3D {
  /**
   * @param {Vector3} position
   */
  constructor (position) {
    super()
    this.position.copy(position)
    this.raycaster = new Raycaster()
    this.raycaster.near = 0
    this.clearance = 0.5
  }

  /**
   * Follows the movement until collision.
   * Subtracts the normal component and moves in that direction.
   * @param {Vector3} movementVector
   */
  move (movementVector, objects) {
    const distance = movementVector.length()
    this.raycaster.far = distance + this.clearance
    this.raycaster.set(this.position, movementVector.clone().normalize())
    const intersections = this.raycaster.intersectObjects(objects)
    if (intersections.length) {
      const normal = intersections[0].face.normal
      const clearance = normal.clone().multiplyScalar(this.clearance)
      this.position.copy(intersections[0].point.add(clearance))
      movementVector.setLength(distance - intersections[0].distance)
      movementVector.sub(normal.multiplyScalar(movementVector.dot(normal)))
      this.move(movementVector, objects)
    } else {
      this.position.add(movementVector)
    }
  }
}
