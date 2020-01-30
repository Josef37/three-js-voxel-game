import { WebGLRenderer, Scene } from 'three'
import { resizeRendererToDisplaySize, resizeCameraToRenderSize } from './utils'

/** Responsible for drawing the game scene */
export class GameView {
  /**
   * @param {HTMLCanvasElement} canvas where to render
   * @param {Player} player the player from which to render
   */
  constructor (canvas, player) {
    this.renderer = new WebGLRenderer({ canvas })
    this.scene = new Scene()
    this.scene.add(player)
    this.resize(player.getCamera())
  }

  /**
   * Adds and remove Object3Ds from the scene
   */
  updateObjects ({ objectsToAdd, objectsToRemove }) {
    if (objectsToRemove.length) this.scene.remove(...objectsToRemove)
    if (objectsToAdd.length) this.scene.add(...objectsToAdd)
  }

  /** Draws a scene seen from the given camera */
  draw (camera) {
    this.renderer.render(this.scene, camera)
  }

  /** Resizes the renderer and camera to the canvas dimensions */
  resize (camera) {
    if (resizeRendererToDisplaySize(this.renderer)) {
      resizeCameraToRenderSize(this.renderer, camera)
    }
  }
}
