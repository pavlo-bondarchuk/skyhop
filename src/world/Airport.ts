import { BoxGeometry, Group, Mesh, MeshStandardMaterial } from 'three';
export class Airport extends Group {
  constructor(radius: number) {
    super(); this.position.set(0, radius + 0.4, 0);
    const runway = new Mesh(new BoxGeometry(5, 0.3, 18), new MeshStandardMaterial({ color: '#344f54' })); this.add(runway);
    for (let i = -3; i <= 3; i++) {
      const stripe = new Mesh(new BoxGeometry(0.18, 0.04, 1), new MeshStandardMaterial({ color: '#fff1cd' }));
      stripe.position.set(0, 0.18, i * 2); this.add(stripe);
    }
  }
}
