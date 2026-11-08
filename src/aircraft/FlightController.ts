import type { AircraftInstance } from './AircraftLoader';
import type { FlightPhysics } from '../physics/FlightPhysics';
import type { FlightInput } from '../input/InputManager';
export class FlightController {
  constructor(readonly physics: FlightPhysics, readonly aircraft: AircraftInstance) { this.sync(); }
  update(dt: number, input: FlightInput) { this.physics.step(dt, input); this.sync(); this.aircraft.update(dt); }
  sync() { this.aircraft.root.position.copy(this.physics.position); this.aircraft.root.quaternion.copy(this.physics.orientation); }
}
