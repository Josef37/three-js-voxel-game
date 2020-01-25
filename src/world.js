import { Vector3 } from "three";
import { Chunk } from "./chunk";

export class World {
  constructor() {
    this.visibilityRange = 1000;
    this.chunkSize = new Vector3(32, 128, 32);
    this.chunks = {};

    this.chunksInDirection = new Vector3()
      .setScalar(this.visibilityRange)
      .divide(this.chunkSize)
      .ceil();
  }

  /**
   * @param {Vector3} position
   */
  getMeshes(position) {
    const meshes = [];
    const chunkPosition = position
      .clone()
      .divide(this.chunkSize)
      .floor();
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
        const chunkId = `${chunkX},0,${chunkZ}`;
        if (!this.chunks[chunkId]) {
          this.chunks[chunkId] = new Chunk(this.chunkSize);
        }
        const mesh = this.chunks[chunkId].getMesh();
        mesh.position.copy(
          new Vector3(chunkX, 0, chunkZ).multiply(this.chunkSize)
        );
        meshes.push(mesh);
      }
    }
    return meshes;
  }
}
