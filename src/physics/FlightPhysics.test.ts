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
});
