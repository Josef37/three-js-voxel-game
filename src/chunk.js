import {
  Mesh,
  Vector3,
  Geometry,
  Face3,
  MeshBasicMaterial,
  MeshPhongMaterial,
  Box3
} from "three";

export class Chunk {
  constructor(chunkSize, worldPosition) {
    this.chunkSize = chunkSize;
    this.worldPosition = worldPosition;
    this.blocks = null;
    this.geometry = null;
    this.material = new MeshPhongMaterial({ color: "green" });
    this.mesh = null;
  }

  getMesh() {
    if (!this.mesh) this.computeMesh();
    return this.mesh;
  }

  computeMesh() {
    const geometry = this.computeGeometry();

    this.mesh = new Mesh(geometry, this.material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.position.copy(this.worldPosition);
  }

  computeGeometry() {
    // TODO: Make BufferGeometry (merge PlaneBufferGeo with BufferGeoUtils)
    this.computeBlocks();

    const geometry = new Geometry();
    for (let x = 0; x < this.chunkSize.x; x++) {
      for (let y = 0; y < this.chunkSize.y; y++) {
        for (let z = 0; z < this.chunkSize.z; z++) {
          if (this.blocks[x][y][z] === 0) continue;
          for (const { normal, vertices, facesVertices } of Chunk.directions) {
            const neighbor = new Vector3(x, y, z).add(normal);
            const { x: nX, y: nY, z: nZ } = neighbor;
            if (
              !this.isOutsideOfChunk(neighbor) &&
              this.blocks[nX][nY][nZ] !== 0
            ) {
              continue;
            }

            const vertexIndex = geometry.vertices.length;
            geometry.vertices.push(
              ...vertices.map(vertex => new Vector3(x, y, z).add(vertex))
            );
            const faces = facesVertices.map(vertices => {
              const indices = vertices.map(index => index + vertexIndex);
              return new Face3(...indices, normal);
            });
            geometry.faces.push(...faces);
          }
        }
      }
    }
    geometry.boundingBox = new Box3(new Vector3(), this.chunkSize);

    return geometry;
  }

  computeBlocks() {
    this.blocks = [];
    for (let x = 0; x < this.chunkSize.x; x++) {
      this.blocks[x] = [];
      for (let y = 0; y < this.chunkSize.y; y++) {
        this.blocks[x][y] = [];
        for (let z = 0; z < this.chunkSize.z; z++) {
          this.blocks[x][y][z] = this.computeBlock(
            new Vector3(x, y, z).add(this.worldPosition)
          );
        }
      }
    }
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
    vertices: [
      new Vector3(1, 0, 0),
      new Vector3(1, 1, 0),
      new Vector3(1, 0, 1),
      new Vector3(1, 1, 1)
    ],
    facesVertices: [
      [0, 1, 3],
      [0, 3, 2]
    ]
  },
  {
    normal: new Vector3(-1, 0, 0),
    vertices: [
      new Vector3(0, 0, 0),
      new Vector3(0, 1, 0),
      new Vector3(0, 0, 1),
      new Vector3(0, 1, 1)
    ],
    facesVertices: [
      [0, 2, 3],
      [0, 3, 1]
    ]
  },
  {
    normal: new Vector3(0, 1, 0),
    vertices: [
      new Vector3(0, 1, 0),
      new Vector3(1, 1, 0),
      new Vector3(0, 1, 1),
      new Vector3(1, 1, 1)
    ],
    facesVertices: [
      [0, 2, 3],
      [0, 3, 1]
    ]
  },
  {
    normal: new Vector3(0, -1, 0),
    vertices: [
      new Vector3(0, 0, 0),
      new Vector3(1, 0, 0),
      new Vector3(0, 0, 1),
      new Vector3(1, 0, 1)
    ],
    facesVertices: [
      [0, 1, 3],
      [0, 3, 2]
    ]
  },
  {
    normal: new Vector3(0, 0, 1),
    vertices: [
      new Vector3(0, 0, 1),
      new Vector3(1, 0, 1),
      new Vector3(0, 1, 1),
      new Vector3(1, 1, 1)
    ],
    facesVertices: [
      [0, 1, 3],
      [0, 3, 2]
    ]
  },
  {
    normal: new Vector3(0, 0, -1),
    vertices: [
      new Vector3(0, 0, 0),
      new Vector3(1, 0, 0),
      new Vector3(0, 1, 0),
      new Vector3(1, 1, 0)
    ],
    facesVertices: [
      [0, 2, 3],
      [0, 3, 1]
    ]
  }
];
