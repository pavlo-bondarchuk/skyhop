import { expect, it } from 'vitest';
import { AircraftLoader } from './AircraftLoader';
it('rejects remote URLs and paths outside the local model directory', async () => {
  for (const path of ['https://example.com/plane.glb', '/models/../plane.glb', '/plane.glb']) await expect(new AircraftLoader().load({modelPath:path} as import('../config/aircraft').AircraftConfig)).rejects.toThrow('local');
});
