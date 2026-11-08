import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three';

export class Airport extends Group {
  constructor(radius: number) {
    super();
    const shoulderMaterial = new MeshStandardMaterial({ color: '#777a70', flatShading: true });
    const runwayMaterial = new MeshStandardMaterial({ color: '#33464a', flatShading: true, roughness: 1 });
    const markingMaterial = new MeshStandardMaterial({ color: '#fff1cd', flatShading: true });
    const sectionLength = 4;
    const halfLength = 56;
    const placeOnSurface = (mesh: Mesh, z: number, surfaceOffset: number, length: number) => {
      const y = Math.sqrt(Math.max(0, radius * radius - z * z));
      const normalAngle = Math.asin(z / radius);
      mesh.position.set(0, y + surfaceOffset, z);
      mesh.rotation.x = normalAngle;
      mesh.scale.z = length / sectionLength;
      this.add(mesh);
    };
    for (let z = -halfLength + sectionLength / 2; z < halfLength; z += sectionLength) {
      const shoulder = new Mesh(new BoxGeometry(12, 0.42, sectionLength + 0.04), shoulderMaterial);
      placeOnSurface(shoulder, z, 0.21, sectionLength + 0.04);
      const runway = new Mesh(new BoxGeometry(8, 0.38, sectionLength + 0.04), runwayMaterial);
      placeOnSurface(runway, z, 0.4, sectionLength + 0.04);
    }
    for (let z = -52; z <= 52; z += 10) {
      const stripe = new Mesh(new BoxGeometry(0.3, 0.045, 2), markingMaterial);
      placeOnSurface(stripe, z, 0.61, 2);
    }
    for (const x of [-3.15, 3.15]) {
      for (let z = -54; z < 54; z += sectionLength) {
        const edge = new Mesh(new BoxGeometry(0.16, 0.05, sectionLength + 0.04), markingMaterial);
        placeOnSurface(edge, z + sectionLength / 2, 0.62, sectionLength + 0.04);
        edge.position.x = x;
      }
    }
  }
}
