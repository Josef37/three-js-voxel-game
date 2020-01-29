import { Vector3 } from "three";
import { Chunk } from "./chunk";

export class World {
  constructor() {
    this.visibilityRange = 200;
    this.chunkSize = new Vector3(16, 32, 16);
    this.chunks = {};

    this.chunksInDirection = new Vector3()
      .setScalar(this.visibilityRange)
      .divide(this.chunkSize)
      .ceil();
  }

  /**
   * @param {Vector3} worldPosition
   */
  placeBlock(worldPosition) {
    const chunk = this.getChunk(worldPosition);
    chunk.placeBlock(worldPosition);
  }

  /**
   * @param {Vector3} worldPosition
   */
  removeBlock(worldPosition) {
    const chunk = this.getChunk(worldPosition);
    chunk.removeBlock(worldPosition);
  }

  /**
   * Returns all computed meshes around position
   * and starts computing missing ones
   * @param {Vector3} position
   */
  getAvailableMeshes(position) {
    const availableMeshes = [];
    const chunkPosition = this.getChunkPosition(position);
    for (
      let chunkX = chunkPosition.x - this.chunksInDirection.x;
      chunkX <= chunkPosition.x + this.chunksInDirection.x;
      chunkX++
    ) {
      for (
        let chunkZ = chunkPosition.z - this.chunksInDirection.z;
        chunkZ <= chunkPosition.z + this.chunksInDirection.z;
        chunkZ++
      ) {
        const currentChunkPosition = new Vector3(chunkX, 0, chunkZ);
        const currentChunkId = this.getChunkId(currentChunkPosition);
        if (!this.chunks[currentChunkId]) {
          this.chunks[currentChunkId] = new Chunk(
            this.chunkSize,
            this.getWorldPosition(currentChunkPosition)
          );
        }
        const chunk = this.chunks[currentChunkId];
        if (chunk.hasMesh()) {
          const mesh = chunk.getMesh();
          availableMeshes.push(mesh);
        } else if (!chunk.isComputingMesh) {
          chunk.isComputingMesh = true;
          setTimeout(() => {
            chunk.computeMesh();
            chunk.isComputingMesh = false;
          }, 0);
        }
      }
    }
    return availableMeshes;
  }

  getChunkPosition(worldPosition) {
    return worldPosition
      .clone()
      .divide(this.chunkSize)
      .floor();
  }

  getWorldPosition(chunkPosition) {
    return chunkPosition.clone().multiply(this.chunkSize);
  }

  getChunkId(chunkPosition) {
    return `${chunkPosition.x},${chunkPosition.y},${chunkPosition.z}`;
  }

  getChunk(worldPosition) {
    const chunkPosition = this.getChunkPosition(worldPosition);
    const chunkId = this.getChunkId(chunkPosition);
    if (!this.chunks[chunkId]) {
      this.chunks[chunkId] = new Chunk(
        this.chunkSize,
        this.getWorldPosition(chunkPosition)
      );
      this.chunks[chunkId].computeMesh();
    }
    return this.chunks[chunkId];
  }
}
