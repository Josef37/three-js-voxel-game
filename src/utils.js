/**
 * @param {WebGLRenderer} renderer
 * @returns {boolean} if the canvas got updated
 */
export function resizeRendererToDisplaySize (renderer) {
  const canvas = renderer.domElement
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  const needUpdate = canvas.width !== width || canvas.height !== height
  if (needUpdate) renderer.setSize(width, height, false)
  return needUpdate
}

/**
 * @param {WebGLRenderer} renderer
 * @param {Camera} camera
 */
export function resizeCameraToRenderSize (renderer, camera) {
  const canvas = renderer.domElement
  camera.aspect = canvas.clientWidth / canvas.clientHeight
  camera.updateProjectionMatrix()
}

/**
 * Approximating sin with two parabolas
 * @param {number} x inside [-pi, pi]
 */
export function fastSin (x) {
  const doublePi = 2 * Math.PI
  x = (((x % doublePi) + doublePi) % doublePi) - Math.PI
  return (4 * x) / Math.PI - (4 * x * Math.abs(x)) / Math.PI ** 2
}

/**
 * @param {Vector3} vector
 * @returns {string} e.g. "1,2,3"
 */
export function vectorToString (vector) {
  return `${vector.x},${vector.y},${vector.z}`
}
