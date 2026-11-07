import { Mesh, IcosahedronGeometry, MeshStandardMaterial } from 'three';
export class Planet extends Mesh {
  constructor(radius: number) { super(new IcosahedronGeometry(radius, 4), new MeshStandardMaterial({ color: '#4eada6', flatShading: true, roughness: 0.95 })); }
}
