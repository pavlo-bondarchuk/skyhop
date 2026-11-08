import { Quaternion, Vector3 } from 'three';
import type { AircraftConfig } from '../config/aircraft';
import type { FlightInput } from '../input/InputManager';
export class FlightPhysics {
  readonly position: Vector3;
  readonly orientation = new Quaternion();
  speed: number;
  private throttle = 0.65;
  private altitudeTarget: number | null = null;
  private previousAltitude: number | undefined;
  private bankAngle = 0;
  fuel = 100;
  flaps = 0;
  constructor(private config: AircraftConfig, private radius: number) {
    this.position = new Vector3(0, radius + 2, 0);
    this.speed = config.cruiseSpeed;
  }
  step(dt: number, input: FlightInput) {
    if (!Number.isFinite(dt) || dt <= 0) return;
    dt = Math.min(dt, 0.05);
    this.throttle = Math.max(0, Math.min(1, this.throttle + input.throttle * dt * 0.3));
    const engineAvailable = this.fuel > 0;
    const effectiveThrottle = engineAvailable ? this.throttle : 0;
    const targetSpeed = this.config.cruiseSpeed * (0.5 + effectiveThrottle) * (1 - this.flaps * 0.18);
    this.speed += (targetSpeed - this.speed) * (1 - Math.exp(-(engineAvailable ? this.config.acceleration : 0.7) * dt));
    const altitude = this.altitude;
    const verticalSpeed = (altitude - (this.previousAltitude ?? altitude)) / dt;
    this.previousAltitude = altitude;
    const holdPitch = this.altitudeTarget === null || !engineAvailable ? 0 : Math.max(-0.32, Math.min(0.32, (this.altitudeTarget - altitude) * 0.025 - verticalSpeed * 0.12));
    const pitch = Math.max(-0.55, Math.min(0.55, (engineAvailable ? input.pitch : -0.28) + holdPitch));
    if (engineAvailable) this.fuel = Math.max(0, this.fuel - dt * (0.03 + effectiveThrottle * 0.08));
    const previousUp = this.position.clone().normalize();
    const rotation = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), pitch * this.config.turnRate * dt);
    this.orientation.multiply(rotation);
    const targetBank = input.roll * 0.62;
    const bankDelta = (targetBank - this.bankAngle) * (1 - Math.exp(-3.5 * dt));
    this.bankAngle += bankDelta;
    this.orientation.multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), bankDelta));
    const coordinatedTurn = -Math.sin(this.bankAngle) * 9.81 / Math.max(this.speed, 8);
    this.orientation.multiply(new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), coordinatedTurn * dt));
    this.position.addScaledVector(new Vector3(0, 0, -1).applyQuaternion(this.orientation), this.speed * dt);
    const nextUp = this.position.clone().normalize();
    this.orientation.premultiply(new Quaternion().setFromUnitVectors(previousUp, nextUp)).normalize();
    if (this.position.length() < this.radius + 2) this.position.setLength(this.radius + 2);
  }
  reset() { this.position.set(0, this.radius + 2, 0); this.orientation.identity(); this.speed = this.config.cruiseSpeed; this.throttle = 0.65; this.fuel = 100; this.flaps = 0; this.altitudeTarget = null; this.previousAltitude = undefined; this.bankAngle = 0; }
  setAltitudeHold(altitude: number | null) { this.altitudeTarget = altitude; this.previousAltitude = this.altitude; }
  setThrottle(value: number) { this.throttle = Math.max(0, Math.min(1, value)); }
  setFlaps(value: number) { this.flaps = Math.max(0, Math.min(1, value)); }
  get throttleLevel() { return this.throttle; }
  get altitude() { return this.position.length() - this.radius; }
}
