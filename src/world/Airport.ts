import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
export class Airport extends Group {
  constructor(radius: number) {
    super(); this.position.set(0, radius + 0.4, 0);
    const shoulder = new Mesh(new BoxGeometry(12, 0.42, 120), new MeshStandardMaterial({ color: '#777a70', flatShading: true }));
    shoulder.position.y = -0.12; this.add(shoulder);
    const runway = new Mesh(new BoxGeometry(8, 0.38, 112), new MeshStandardMaterial({ color: '#33464a', flatShading: true, roughness: 1 })); this.add(runway);
    for (let i = -3; i <= 3; i++) {
      const stripe = new Mesh(new BoxGeometry(0.3, 0.045, 2.1), new MeshStandardMaterial({ color: '#fff1cd', flatShading: true }));
      stripe.position.set(0, 0.22, i * 5); this.add(stripe);
    }
    for (const x of [-3.15, 3.15]) {
      const edge = new Mesh(new BoxGeometry(0.16, 0.05, 110), new MeshStandardMaterial({ color: '#f4edcf', flatShading: true }));
      edge.geometry.dispose();
      const runwayEdge = new Mesh(new BoxGeometry(0.16, 0.05, 110), edge.material);
      runwayEdge.position.set(x, 0.22, 0); this.add(runwayEdge);
    }
  }
}
