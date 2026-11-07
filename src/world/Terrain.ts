import { Group, IcosahedronGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';
export class Terrain extends Group {
  constructor(radius: number) {
    super();
    const material = new MeshStandardMaterial({ color: '#91b57e', flatShading: true });
    for (let i = 0; i < 65; i++) {
      const direction = new Vector3(Math.sin(i * 7.3), Math.cos(i * 2.7), Math.sin(i * 3.9)).normalize();
      const island = new Mesh(new IcosahedronGeometry(6 + (i % 5), 0), material);
      island.scale.set(1, 0.25, 1); island.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), direction);
      island.position.copy(direction.multiplyScalar(radius)); this.add(island);
    }
  }
}
