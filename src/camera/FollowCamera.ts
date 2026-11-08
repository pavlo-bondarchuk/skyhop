import { PerspectiveCamera, Vector3 } from 'three';
import type { FlightPhysics } from '../physics/FlightPhysics';
export class FollowCamera extends PerspectiveCamera {
  constructor() { super(62, window.innerWidth / window.innerHeight, 0.1, 1500); }
  follow(body: FlightPhysics, dt: number, immediate = false) {
    const offset = new Vector3(0, 9, 25).applyQuaternion(body.orientation).add(body.position);
    this.position.lerp(offset, immediate ? 1 : 1 - Math.exp(-5 * dt));
    this.up.copy(body.position).normalize();
    this.lookAt(new Vector3(0, 0, -8).applyQuaternion(body.orientation).add(body.position));
  }
  resize() { this.aspect = window.innerWidth / window.innerHeight; this.updateProjectionMatrix(); }
}
