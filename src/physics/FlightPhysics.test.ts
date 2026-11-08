import { describe, expect, it } from 'vitest';
import { FlightPhysics } from './FlightPhysics';
import { aircraft } from '../config/aircraft';
const scout = aircraft[0]!;
import { Vector3 } from 'three';
const neutral = { pitch: 0, roll: 0, throttle: 0 };
describe('FlightPhysics', () => {
  it('moves forward along local -Z and maintains spherical altitude', () => {
    const body = new FlightPhysics(scout, 100);
    for (let i = 0; i < 600; i++) body.step(1 / 60, neutral);
    expect(body.position.z).toBeLessThan(0);
    expect(body.altitude).toBeCloseTo(2, 0);
    expect(new Vector3(0, 1, 0).applyQuaternion(body.orientation).dot(body.position.clone().normalize())).toBeCloseTo(1, 3);
  });
  it('changes altitude with pitch without entering the planet', () => {
    const body = new FlightPhysics(scout, 100);
    for (let i = 0; i < 60; i++) body.step(1 / 60, { ...neutral, pitch: 1 });
    expect(body.altitude).toBeGreaterThan(2);
    for (let i = 0; i < 3000; i++) body.step(1 / 60, { ...neutral, pitch: -1 });
    expect(body.altitude).toBeGreaterThanOrEqual(2 - 1e-10);
  });
  it('ignores invalid time and bounds long frame advances', () => {
    const body = new FlightPhysics(scout, 100);
    const start = body.position.clone();
    body.step(NaN, neutral); body.step(-1, neutral);
    expect(body.position.equals(start)).toBe(true);
    body.step(10, neutral);
    expect(body.position.distanceTo(start)).toBeLessThan(2);
  });
  it('accelerates when throttle increases', () => {
    const body = new FlightPhysics(scout, 100);
    for (let i = 0; i < 300; i++) body.step(1 / 60, { ...neutral, throttle: 1 });
    expect(body.speed).toBeCloseTo(scout.cruiseSpeed * 1.5, 1);
  });
  it('climbs to the selected altitude and then holds near it', () => {
    const body = new FlightPhysics(scout, 100);
    body.setAltitudeHold(30);
    for (let i = 0; i < 2400; i++) body.step(1 / 60, neutral);
    expect(body.altitude).toBeGreaterThan(27);
    expect(body.altitude).toBeLessThan(33);
    const heldAltitude = body.altitude;
    for (let i = 0; i < 600; i++) body.step(1 / 60, neutral);
    expect(Math.abs(body.altitude - heldAltitude)).toBeLessThan(2);
  });
  it('consumes fuel and loses engine power when fuel is exhausted', () => {
    const body = new FlightPhysics(scout, 100);
    const startingFuel = body.fuel;
    for (let i = 0; i < 600; i++) body.step(1 / 60, neutral);
    expect(body.fuel).toBeLessThan(startingFuel);
    body.fuel = 0;
    const speed = body.speed;
    for (let i = 0; i < 600; i++) body.step(1 / 60, neutral);
    expect(body.speed).toBeLessThan(speed);
    expect(body.altitude).toBeLessThan(30);
  });
  it('banks into coordinated turns instead of yawing flat', () => {
    const left = new FlightPhysics(scout, 100);
    const right = new FlightPhysics(scout, 100);
    for (let i = 0; i < 120; i++) {
      left.step(1 / 60, { ...neutral, roll: -1 });
      right.step(1 / 60, { ...neutral, roll: 1 });
    }
    expect(left.position.x).toBeLessThan(0);
    expect(right.position.x).toBeGreaterThan(0);
    expect(new Vector3(0, 1, 0).applyQuaternion(left.orientation).x).toBeGreaterThan(0);
    expect(new Vector3(0, 1, 0).applyQuaternion(right.orientation).x).toBeLessThan(0);
  });
});
