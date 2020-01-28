import { Vector3 } from "three";
import { Chunk } from "./chunk";

export class World {
  constructor() {
    this.visibilityRange = 100;
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
   * @param {Vector3} position
   */
  getMeshes(position) {
    const meshes = [];
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
        // TODO: Iterate y
        const currentChunkPosition = new Vector3(chunkX, 0, chunkZ);
        const currentChunkId = this.getChunkId(currentChunkPosition);
        if (!this.chunks[currentChunkId]) {
          this.chunks[currentChunkId] = new Chunk(
            this.chunkSize,
            this.getWorldPosition(currentChunkPosition)
          );
        }
        const mesh = this.chunks[currentChunkId].getMesh();
        meshes.push(mesh);
      }
    }
    return meshes;
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
    }
    return this.chunks[chunkId];
  }
}
