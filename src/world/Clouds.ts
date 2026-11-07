import { Group, IcosahedronGeometry, Mesh, MeshStandardMaterial, Vector3 } from 'three';
export class Clouds extends Group {
  constructor(radius: number) {
    super();
    const material = new MeshStandardMaterial({ color: '#fff9e9', flatShading: true });
    for (let i = 0; i < 35; i++) {
      const cloud = new Mesh(new IcosahedronGeometry(3, 1), material);
      cloud.scale.set(2.4, 0.65, 1);
      cloud.position.copy(new Vector3(Math.sin(i * 4.1), Math.cos(i * 1.7), Math.cos(i * 3.3)).normalize().multiplyScalar(radius + 18 + i % 6));
      this.add(cloud);
    }
  }
}
