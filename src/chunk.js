import { Mesh, BoxGeometry, MeshNormalMaterial } from "three";

export class Chunk {
  constructor(chunkSize) {
    this.chunkSize = chunkSize;
    this.mesh = new Mesh(
      new BoxGeometry(chunkSize.x, 1, chunkSize.z),
      new MeshNormalMaterial()
    );
  }

  getMesh() {
    return this.mesh;
  }
}
