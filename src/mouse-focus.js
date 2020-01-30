import { Raycaster } from 'three'

/** Tracks where the mouse looks */
export class MouseFocus {
  /**
   * @param {number} near closest focus distance
   * @param {number} far furthest focus distance
   */
  constructor (near = 0.1, far = 10) {
    this.intersection = null
    this.blockPosition = this.raycaster = new Raycaster()
    this.raycaster.near = near
    this.raycaster.far = far
  }

  /**
   * Looks through camera at meshes and stores the intersection
   */
  updateFocus (camera, meshes) {
    this.raycaster.setFromCamera({ x: 0, y: 0 }, camera)
    const intersects = this.raycaster.intersectObjects(meshes)
    if (intersects.length) {
      this.intersection = intersects[0]
    } else {
      this.intersection = null
    }
  }

  getFocusedPosition () {
    return this.intersection ? this.intersection.point : null
  }

  /**
   * @returns {null|Vector3} null, if there is no intersection,
   * else it gives the position of the focused block
   */
  getBlockPosition () {
    if (!this.intersection) return null
    return this.followNormal(-0.5).floor()
  }

  /**
   * @returns {null|Vector3} null, if there is no intersection,
   * else it gives the position where a new block would be placed
   */
  getNewBlockPosition () {
    if (!this.intersection) return null
    return this.followNormal(0.5).floor()
  }

  /**
   * Following normal from point with given length.
   * (helps with computing which block was clicked by moving inside it)
   * @param {number} length length of vector
   * @returns {Vector3} intersectionPoint + intersectionNormal*length
   */
  followNormal (length) {
    const normal = this.intersection.face.normal.clone()
    const position = this.intersection.point.clone()
    // Follow half the face normal to land inside the block
    return position.add(normal.multiplyScalar(length))
  }
}
