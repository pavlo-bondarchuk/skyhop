import type { Object3D } from 'three';
import type { FlightPhysics } from '../physics/FlightPhysics';
import type { FlightInput } from '../input/InputManager';
export class FlightController {
  constructor(readonly physics: FlightPhysics, private visual: Object3D) { this.sync(); }
  update(dt: number, input: FlightInput) { this.physics.step(dt, input); this.sync(); }
  private sync() { this.visual.position.copy(this.physics.position); this.visual.quaternion.copy(this.physics.orientation); }
}
