export interface AircraftConfig {
  name: string;
  cruiseSpeed: number;
  acceleration: number;
  turnRate: number;
  modelPath?: string;
}
export const scout: AircraftConfig = { name: 'Sparrow / 01', cruiseSpeed: 18, acceleration: 8, turnRate: 0.8 };
export const planetRadius = 100;
