import { BoxGeometry, ConeGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
export class Aircraft extends Group {
  constructor() {
    super();
    const orange = new MeshStandardMaterial({ color: '#f07440', flatShading: true });
    const cream = new MeshStandardMaterial({ color: '#fff1cd', flatShading: true });
    const dark = new MeshStandardMaterial({ color: '#254757', roughness: 0.3 });
    const part = (size: [number, number, number], position: [number, number, number], material = orange) => {
      const mesh = new Mesh(new BoxGeometry(...size), material);
      mesh.position.set(...position); this.add(mesh);
    };
    part([0.9, 0.8, 3.7], [0, 0, 0]);
    part([5.8, 0.16, 1.1], [0, 0.05, -0.4], cream);
    part([2.4, 0.13, 0.65], [0, 0.3, 1.5], cream);
    part([0.15, 1.1, 0.8], [0, 0.7, 1.4]);
    part([0.65, 0.48, 1.1], [0, 0.55, -0.25], dark);
    const nose = new Mesh(new ConeGeometry(0.49, 0.9, 6), orange);
    nose.rotation.x = -Math.PI / 2; nose.position.z = -2.25; this.add(nose);
    part([1.8, 0.12, 0.12], [0, 0, -2.75], dark);
  }
}
