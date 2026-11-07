export interface AircraftConfig { id: string; name: string; description: string; modelPath: string; cruiseSpeed: number; acceleration: number; turnRate: number; correctionDegrees: number; propellerNodes: string[] }
export const aircraft: AircraftConfig[] = [
  { id: 'explorer', name: 'The Explorer', description: 'A nimble single-engine companion for the long way around.', modelPath: '/models/aircraft/single-engine-light-aircraft-24478f.glb', cruiseSpeed: 18, acceleration: 8, turnRate: 0.8, correctionDegrees: 0, propellerNodes: ['propeller', 'propeller_1', 'Propeller', 'Propeller001'] },
  { id: 'voyager', name: 'The Voyager', description: 'Twin-engine comfort for journeys beyond the horizon.', modelPath: '/models/aircraft/twin-engine-piston-light-f417c7.glb', cruiseSpeed: 23, acceleration: 6, turnRate: 0.62, correctionDegrees: 0, propellerNodes: ['propeller', 'propeller_1', 'propeller_2', 'Propeller', 'Propeller001', 'Propeller002'] }
];
export const planetRadius = 100;
