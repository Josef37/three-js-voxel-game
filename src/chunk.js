import {
  Mesh,
  Vector3,
  MeshPhongMaterial,
  Box3,
  BufferGeometry,
  BufferAttribute
} from "three";

/** Represents a cuboidal (brick-shaped) part of the world. All vertices have integer coordinates */
export class Chunk {
  /**
   * Creates a new empty chunk. To fill it, call computeMesh.
   * @param {Vector3} chunkSize size of the chunk in x,y,z dimensions
   * @param {Vector3} worldPosition the position of the corner with the smallest coordinates (minimal x,y,z)
   */
  constructor(chunkSize, worldPosition) {
    /**
     * The size of the chunk in x,y,z dimensions
     * @type {Vector3}
     */
    this.chunkSize = chunkSize;

    /**
     * The position of the corner with the smallest coordinates (minimal x,y,z)
     * @type {Vector3}
     */
    this.worldPosition = worldPosition;

    /**
     * All block codes of this chunk
     * @type {Uint8Array}
     */
    this.blockTypes = null;

    /**
     * The Geometry for this chunk.
     * @type {BufferGeometry}
     */
    this.geometry = null;

    /**
     * The Material for this chunk.
     * @type {MeshPhongMaterial}
     */
    this.material = new MeshPhongMaterial({
      color: "green",
      emissive: 0x003000
    });

    /**
     * The Mesh computed for this chunk.
     * @type {Mesh}
     */
    this.mesh = null;
  }

  /**
   * Places a block at the given world coordinates. Assumes that the position lies inside the chunk.
   * @param {Vector3} worldPosition the global/world position to place the block
   */
  placeBlock(worldPosition) {
    this.updateBlock(worldPosition, 1);
  }

  /**
   * Removes a block at the given world coordinates. Assumes that the position lies inside the chunk.
   * @param {Vector3} worldPosition the global/world position to place the block
   */
  removeBlock(worldPosition) {
    this.updateBlock(worldPosition, 0);
  }

  /**
   * Updates a block value in the data and recomputes the mesh immediately
   * @param {Vector3} worldPosition the global/world position to place the block
   * @param {number} blockType the code for a block type
   */
  updateBlock(worldPosition, blockType) {
    const chunkPosition = worldPosition.clone().sub(this.worldPosition);
    const { x, y, z } = chunkPosition;
    this.setBlockType(blockType, x, y, z);
    // Reset Mesh and Geometry to force recalculation on next render
    this.geometry = null;
    this.mesh = null;
    this.computeMesh();
  }

  /**
   * Gets the mesh. Only recomputes, when there is none.
   * Note that **manually updating the data doesn't recompute the mesh**.
   * @returns {Mesh} the current mesh
   */
  getMesh() {
    if (!this.hasMesh()) this.computeMesh();
    return this.mesh;
  }

  /**
   * @returns {boolean} if there is a mesh computed
   */
  hasMesh() {
    return !!this.mesh;
  }

  /**
   * Computes the mesh for this chunk. Sets this.mesh.
   */
  computeMesh() {
    const geometry = this.getGeometry();
    this.mesh = new Mesh(geometry, this.material);
    this.mesh.position.copy(this.worldPosition);
  }

  /**
   * Gets the geometry. Only recomputes, when there is none.
   * Note that **manually updating the data doesn't recompute the geometry**.
   * @returns {BufferGeometry} the current geometry
   */
  getGeometry() {
    if (!this.geometry) this.computeGeometry();
    return this.geometry;
  }

  /**
   * Computes the geometry for this chunk. Sets this.geometry.
   * It only adds faces, when there is no neighboring block.
   */
  computeGeometry() {
    const blockTypes = this.getBlockTypes();

    const allVertices = [];
    const allNormals = [];
    const allUvs = [];
    const allIndices = [];

    let index = 0;
    for (let z = 0; z < this.chunkSize.z; z++) {
      for (let y = 0; y < this.chunkSize.y; y++) {
        for (let x = 0; x < this.chunkSize.x; x++) {
          if (blockTypes[index++] === 0) continue;
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
              this.getBlockType(nX, nY, nZ) !== 0
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

  /**
   * Gets the block. Only recomputes, when there are none.
   * @returns {Uint8Array} the current block types data
   */
  getBlockTypes() {
    if (!this.blockTypes) this.computeBlockTypes();
    return this.blockTypes;
  }

  /**
   * Overwrites the existing data and computes all block types.
   */
  computeBlockTypes() {
    const length = this.chunkSize.x * this.chunkSize.y * this.chunkSize.z;
    this.blockTypes = new Uint8Array(length);
    let index = 0;
    for (let z = 0; z < this.chunkSize.z; z++) {
      for (let y = 0; y < this.chunkSize.y; y++) {
        for (let x = 0; x < this.chunkSize.x; x++) {
          this.blockTypes[index++] = this.computeBlockType(
            new Vector3(x, y, z).add(this.worldPosition)
          );
        }
      }
    }
  }

  /**
   * Computes the block type for the given position
   * @param {Vector3} worldPosition the global coordinates
   * @returns {number} the block type
   */
  computeBlockType(worldPosition) {
    const { x, y, z } = worldPosition;
    const height =
      5 * Math.sin((2 * x + z) / 10) +
      5 * Math.sin(x / 10) +
      5 * Math.sin(z / 10);
    return y <= height || y === 0 ? 1 : 0;
  }

  /**
   * Gets the block type for chunk relative coordinates
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {number} the block type
   */
  getBlockType(x, y, z) {
    const blockIndex = this.getBlockIndex(x, y, z);
    return this.blockTypes[blockIndex];
  }

  /**
   * Gets the index of the block with chunk-relative coordinates x,y,z in the array this.blockTypes
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {number} the index in the array
   */
  getBlockIndex(x, y, z) {
    return x + y * this.chunkSize.x + z * this.chunkSize.x * this.chunkSize.y;
  }

  /**
   * Sets the block type of the given chunk-relative position in the data array (this.blockTypes).
   *
   * **Note**: This recomputes neither the geometry nor the mesh!
   * @param {number} blockType the block type to set
   * @param {number} x
   * @param {number} y
   * @param {number} z
   */
  setBlockType(blockType, x, y, z) {
    const blockIndex = this.getBlockIndex(x, y, z);
    this.blockTypes[blockIndex] = blockType;
  }

  /**
   * Checks if the given chunk-relative coordiantes are inside the chunk
   * @param {Object} param0 the chunk-relative coordinates
   * @param {number} param0.x
   * @param {number} param0.y
   * @param {number} param0.z
   * @returns {boolean} if the given position lies inside this chunk
   */
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

/** Data for each direction a face can be oriented. Used to construct the BufferGeometry. */
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
