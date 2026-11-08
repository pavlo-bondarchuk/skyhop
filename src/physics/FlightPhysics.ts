import { Quaternion, Vector3 } from 'three';
import type { AircraftConfig } from '../config/aircraft';
import type { FlightInput } from '../input/InputManager';
export class FlightPhysics {
  readonly position: Vector3;
  readonly orientation = new Quaternion();
  speed: number;
  private throttle = 0.65;
  constructor(private config: AircraftConfig, private radius: number) {
    this.position = new Vector3(0, radius + 2, 0);
    this.speed = config.cruiseSpeed;
  }
  step(dt: number, input: FlightInput) {
    if (!Number.isFinite(dt) || dt <= 0) return;
    dt = Math.min(dt, 0.05);
    this.throttle = Math.max(0, Math.min(1, this.throttle + input.throttle * dt * 0.3));
    const targetSpeed = this.config.cruiseSpeed * (0.5 + this.throttle);
    this.speed += (targetSpeed - this.speed) * (1 - Math.exp(-this.config.acceleration * dt));
    const previousUp = this.position.clone().normalize();
    const rotation = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), input.pitch * this.config.turnRate * dt);
    this.orientation.multiply(rotation);
    this.orientation.multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), input.roll * this.config.turnRate * dt));
    this.position.addScaledVector(new Vector3(0, 0, -1).applyQuaternion(this.orientation), this.speed * dt);
    const nextUp = this.position.clone().normalize();
    this.orientation.premultiply(new Quaternion().setFromUnitVectors(previousUp, nextUp)).normalize();
    if (this.position.length() < this.radius + 2) this.position.setLength(this.radius + 2);
  }
  reset() { this.position.set(0, this.radius + 2, 0); this.orientation.identity(); this.speed = this.config.cruiseSpeed; this.throttle = 0.65; }
  get altitude() { return this.position.length() - this.radius; }
}
