import {
  Mesh,
  Vector3,
  MeshPhongMaterial,
  Box3,
  BufferGeometry,
  BufferAttribute
} from "three";

export class Chunk {
  constructor(chunkSize, worldPosition) {
    this.chunkSize = chunkSize;
    this.worldPosition = worldPosition;
    this.blocks = null;
    this.geometry = null;
    this.material = new MeshPhongMaterial({
      color: "green",
      emissive: 0x003000
    });
    this.mesh = null;
  }

  /**
   * @param {Vector3} worldPosition
   */
  placeBlock(worldPosition) {
    this.updateBlock(worldPosition, 1);
  }

  /**
   * @param {Vector3} worldPosition
   */
  removeBlock(worldPosition) {
    this.updateBlock(worldPosition, 0);
  }

  /**
   * @param {Vector3} worldPosition
   * @param {number} blockType the code for a block type
   */
  updateBlock(worldPosition, blockType) {
    const chunkPosition = worldPosition.clone().sub(this.worldPosition);
    const { x, y, z } = chunkPosition;
    this.setBlock(blockType, x, y, z);
    // Reset Mesh and Geometry to force recalculation on next render
    this.geometry = null;
    this.mesh = null;
    this.computeMesh();
  }

  getMesh() {
    if (!this.hasMesh()) this.computeMesh();
    return this.mesh;
  }

  hasMesh() {
    return !!this.mesh;
  }

  computeMesh() {
    const geometry = this.getGeometry();

    this.mesh = new Mesh(geometry, this.material);
    this.mesh.position.copy(this.worldPosition);
  }

  getGeometry() {
    if (!this.geometry) this.computeGeometry();
    return this.geometry;
  }

  computeGeometry() {
    const blocks = this.getBlocks();

    const allVertices = [];
    const allNormals = [];
    const allUvs = [];
    const allIndices = [];

    let index = 0;
    for (let z = 0; z < this.chunkSize.z; z++) {
      for (let y = 0; y < this.chunkSize.y; y++) {
        for (let x = 0; x < this.chunkSize.x; x++) {
          if (blocks[index++] === 0) continue;
          for (const {
            normal,
            vertices,
            normals,
            uvs,
            indices
          } of Chunk.directions) {
            const neighbor = new Vector3(x, y, z).add(normal);
            const { x: nX, y: nY, z: nZ } = neighbor;
            if (
              !this.isOutsideOfChunk(neighbor) &&
              this.getBlock(nX, nY, nZ) !== 0
            ) {
              continue;
            }

            const firstIndex = allVertices.length / 3;
            allVertices.push(
              ...vertices.map((v, i) => {
                switch (i % 3) {
                  case 0:
                    return v + x;
                  case 1:
                    return v + y;
                  case 2:
                    return v + z;
                }
              })
            );
            allNormals.push(...normals);
            allUvs.push(...uvs);
            allIndices.push(...indices.map(i => i + firstIndex));
          }
        }
      }
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(allVertices), 3)
    );
    geometry.setAttribute(
      "normal",
      new BufferAttribute(new Float32Array(allNormals), 3)
    );
    geometry.setAttribute(
      "uv",
      new BufferAttribute(new Float32Array(allUvs), 2)
    );
    geometry.setIndex(allIndices);
    geometry.boundingBox = new Box3(new Vector3(0, 0, 0), this.chunkSize);

    this.geometry = geometry;
  }

  getBlocks() {
    if (!this.blocks) this.computeBlocks();
    return this.blocks;
  }

  computeBlocks() {
    const length = this.chunkSize.x * this.chunkSize.y * this.chunkSize.z;
    this.blocks = new Uint8Array(length);
    let index = 0;
    for (let z = 0; z < this.chunkSize.z; z++) {
      for (let y = 0; y < this.chunkSize.y; y++) {
        for (let x = 0; x < this.chunkSize.x; x++) {
          this.blocks[index++] = this.computeBlock(
            new Vector3(x, y, z).add(this.worldPosition)
          );
        }
      }
    }
  }

  getBlock(x, y, z) {
    const blockIndex = this.getBlockIndex(x, y, z);
    return this.blocks[blockIndex];
  }

  getBlockIndex(x, y, z) {
    return x + y * this.chunkSize.x + z * this.chunkSize.x * this.chunkSize.y;
  }

  setBlock(value, x, y, z) {
    const blockIndex = this.getBlockIndex(x, y, z);
    this.blocks[blockIndex] = value;
  }

  computeBlock(position) {
    const { x, y, z } = position;
    const height =
      5 * Math.sin((2 * x + z) / 10) +
      5 * Math.sin(x / 10) +
      5 * Math.sin(z / 10);
    return y <= height || y === 0 ? 1 : 0;
  }

  isOutsideOfChunk({ x, y, z }) {
    return (
      x < 0 ||
      this.chunkSize.x <= x ||
      y < 0 ||
      this.chunkSize.y <= y ||
      z < 0 ||
      this.chunkSize.z <= z
    );
  }
}

Chunk.directions = [
  {
    normal: new Vector3(1, 0, 0),
    vertices: [1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1],
    normals: [...Array(4)].flatMap(() => [1, 0, 0]),
    uvs: [0, 0, 0, 1, 1, 0, 1, 1],
    indices: [0, 1, 3, 0, 3, 2]
  },
  {
    normal: new Vector3(-1, 0, 0),
    vertices: [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1],
    normals: [...Array(4)].flatMap(() => [-1, 0, 0]),
    uvs: [0, 0, 0, 1, 1, 0, 1, 1],
    indices: [0, 1, 3, 0, 3, 2]
  },
  {
    normal: new Vector3(0, 1, 0),
    vertices: [0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1],
    normals: [...Array(4)].flatMap(() => [0, 1, 0]),
    uvs: [0, 0, 0, 1, 1, 0, 1, 1],
    indices: [0, 1, 3, 0, 3, 2]
  },
  {
    normal: new Vector3(0, -1, 0),
    vertices: [0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1],
    normals: [...Array(4)].flatMap(() => [0, -1, 0]),
    uvs: [0, 0, 0, 1, 1, 0, 1, 1],
    indices: [0, 1, 3, 0, 3, 2]
  },
  {
    normal: new Vector3(0, 0, 1),
    vertices: [0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1],
    normals: [...Array(4)].flatMap(() => [0, 0, 1]),
    uvs: [0, 0, 0, 1, 1, 0, 1, 1],
    indices: [0, 1, 3, 0, 3, 2]
  },
  {
    normal: new Vector3(0, 0, -1),
    vertices: [0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0],
    normals: [...Array(4)].flatMap(() => [0, 0, -1]),
    uvs: [0, 0, 0, 1, 1, 0, 1, 1],
    indices: [0, 1, 3, 0, 3, 2]
  }
];
