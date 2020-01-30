import { Vector3, Mesh } from 'three'
import { Chunk } from './chunk'
import { vectorToString } from './utils'

/**
 * Represents the games world.
 * It is split up into smaller chunks for efficient rendering.
 */
export class World {
  /**
   * Creates a new world object with empty chunk information.
   * (It doesn't calculate anything on creation)
   */
  constructor () {
    /** Minimum distance to render in every direction. */
    this.visibilityRange = 200

    /** The size of all chunk in all directions. */
    this.chunkSize = new Vector3(16, 32, 16)

    /**
     * Dictionary of all chunks.
     * Each chunk is identified by its chunk-coordinates,
     * which are its world-position divided by the chunk-size
     * (so all integer coordinates get used exactly once).
     * @type {Object.<string, Chunk>}
     */
    this.chunks = {}

    /** How many chunks have to be rendered in each dimension */
    this.chunksInDirection = new Vector3()
      .setScalar(this.visibilityRange)
      .divide(this.chunkSize)
      .ceil()
  }

  /**
   * Places a block in the given chunk.
   * It there is no block information in the chunk, it gets computed before.
   * @param {Vector3} worldPosition the global coordinates of the block
   */
  placeBlock (worldPosition) {
    const chunk = this.getChunk(worldPosition)
    if (!chunk.blockTypes) chunk.computeBlockTypes()
    chunk.placeBlock(worldPosition)
  }

  /**
   * Removes the given block, if there is one.
   * It there is no block information in the chunk, it gets computed before.
   * @param {Vector3} worldPosition the global coordinates of the block
   */
  removeBlock (worldPosition) {
    const chunk = this.getChunk(worldPosition)
    if (!chunk.blockTypes) chunk.computeBlockTypes()
    chunk.removeBlock(worldPosition)
  }

  /**
   * Returns all computed meshes around position and starts computing missing ones.
   * @todo respect y coordinate: it is currently assumed to be 0 always
   * @param {Vector3} worldPosition the global position to get the meshes for
   * @returns {Mesh[]} all meshes that were already computed
   */
  getAvailableMeshes (worldPosition) {
    const availableMeshes = []
    const { x, z } = this.getChunkCoordinates(worldPosition)
    const { x: dx, z: dz } = this.chunksInDirection

    for (let chunkX = x - dx; chunkX <= x + dx; chunkX++) {
      for (let chunkZ = z - dz; chunkZ <= z + dz; chunkZ++) {
        const chunkCoordinates = new Vector3(chunkX, 0, chunkZ)
        const chunk = this.getChunk(this.getWorldPosition(chunkCoordinates))
        if (chunk.hasMesh()) {
          const mesh = chunk.getMesh()
          availableMeshes.push(mesh)
        } else if (!chunk.isComputingMesh) {
          // Async call to compute mesh to not block rendering
          chunk.isComputingMesh = true
          setTimeout(() => {
            chunk.computeMesh()
            chunk.isComputingMesh = false
          }, 0)
        }
      }
    }
    return availableMeshes
  }

  /**
   * For a given world position determines the matching chunk coordinates.
   * Chunks and integer coordinates have a one-to-one relation.
   * @param {Vector3} worldPosition the global position vector
   * @returns {Vector3} the chunk coordinates
   */
  getChunkCoordinates (worldPosition) {
    return worldPosition
      .clone()
      .divide(this.chunkSize)
      .floor()
  }

  /**
   * @param {Vector3} chunkCoordinates
   * @returns {Vector3} the world position of the identifying corner of the chunk
   * (with smallest coordinate values)
   */
  getWorldPosition (chunkCoordinates) {
    return chunkCoordinates.clone().multiply(this.chunkSize)
  }

  /**
   * Returns the chunk for the given global position.
   * If the chunk doesn't exist, it will be created.
   * The chunk can have no information computed.
   * @param {Vector3} worldPosition
   * @returns {Chunk} the chunk including worldPosition
   */
  getChunk (worldPosition) {
    const chunkCoordinates = this.getChunkCoordinates(worldPosition)
    const chunkId = vectorToString(chunkCoordinates)
    if (!this.chunks[chunkId]) {
      this.chunks[chunkId] = new Chunk(
        this.chunkSize,
        this.getWorldPosition(chunkCoordinates)
      )
    }
    return this.chunks[chunkId]
  }
}
