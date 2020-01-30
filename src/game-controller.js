import { World } from './world'
import { Player } from './player'
import { GameView } from './game-view'
import { MouseFocus } from './mouse-focus'
import { Vector3 } from 'three'

const infoBox = document.querySelector('#info')

/** Central Controller coordinating all other pieces */
export class GameController {
  /**
   * Sets up all other parts (player, controls, event handlers)
   * @param {HTMLCanvasElement} canvas the canvas to render to
   */
  constructor (canvas) {
    this.world = new World()
    this.player = new Player(canvas, new Vector3(0, 20, 50))

    /**
     * Keeps track of all currently rendered meshes
     * @type {Array<Mesh>}
     */
    this.currentMeshes = []
    this.view = new GameView(canvas, this.player)
    this.mouseFocus = new MouseFocus()
    this.initMouseEventHandler(canvas)
    this.addResizeHandler()
  }

  /**
   * Request Pointer Lock on Click.
   * When Poniter Lock is active, place or remove blocks.
   * @param {HTMLCanvasElement} canvas the canvas to request the pointer lock for
   */
  initMouseEventHandler (canvas) {
    document.addEventListener('click', e => {
      if (!document.pointerLockElement) {
        canvas.requestPointerLock()
        return
      }
      switch (e.button) {
        case 0: // main / left mouse button
          this.removeBlock()
          break
        case 2: // secondary / right mouse button
          this.placeBlock()
          break
      }
    })
  }

  /**
   * Resize view to match canvas
   */
  addResizeHandler () {
    window.addEventListener('resize', () =>
      this.view.resize(this.player.getCamera())
    )
  }

  /**
   * Updates all elements and draws them.
   * Calls requestAnimationFrame in the end.
   */
  animate () {
    this.player.updatePosition()
    this.player.updateRotation()
    this.updateMeshes()
    this.view.draw(this.player.getCamera())

    const pos = this.mouseFocus.getNewBlockPosition()
    infoBox.textContent = pos
      ? `${pos.x}, ${pos.y}, ${pos.z}`
      : 'Nö, einfach nö!'

    requestAnimationFrame(() => this.animate())
  }

  /**
   * Gets all currently available meshes and tells the view which meshes to add and remove.
   *
   * Note: By calling getAvailableMeshes() calculating missing meshes is requested asynchronously.
   * So they are not available on this render, which is ok for distant meshes.
   */
  updateMeshes () {
    const availableMeshes = this.world.getAvailableMeshes(this.player.position)
    const objectsToAdd = availableMeshes.filter(mesh => !this.currentMeshes.includes(mesh))
    const objectsToRemove = this.currentMeshes.filter(mesh => !availableMeshes.includes(mesh))
    this.currentMeshes = availableMeshes
    this.view.updateObjects({ objectsToAdd, objectsToRemove })
  }

  /**
   * Places a block at the current mouse focus point (if there is one)
   */
  placeBlock () {
    this.mouseFocus.updateFocus(this.player.getCamera(), this.currentMeshes)
    const newBlockPosition = this.mouseFocus.getNewBlockPosition()
    if (newBlockPosition) this.world.placeBlock(newBlockPosition)
  }

  /**
   * Removes a block from the current mouse focus point (if there is one)
   */
  removeBlock () {
    this.mouseFocus.updateFocus(this.player.getCamera(), this.currentMeshes)
    const blockPosition = this.mouseFocus.getBlockPosition()
    if (blockPosition) this.world.removeBlock(blockPosition)
  }
}
