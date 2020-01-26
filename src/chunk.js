import { Mesh, BoxGeometry, MeshNormalMaterial } from "three";

export class Chunk {
  constructor(chunkSize, worldPosition) {
    this.chunkSize = chunkSize;
    this.worldPosition = worldPosition;
    this.mesh = null;
  }

  getMesh() {
    if (!this.mesh) this.generateMesh();
    return this.mesh;
  }

  generateMesh() {
    this.mesh = new Mesh(
      new BoxGeometry(this.chunkSize.x, 1, this.chunkSize.z),
      new MeshNormalMaterial()
    );
    this.mesh.position.copy(this.worldPosition);
  }
}
