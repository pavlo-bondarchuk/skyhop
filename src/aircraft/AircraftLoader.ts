import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
export class AircraftLoader {
  async load(path: string) {
    if (!path.startsWith('/models/') || path.includes('..') || !path.endsWith('.glb')) throw new Error('Use a local /models/*.glb asset');
    const gltf = await new GLTFLoader().loadAsync(path);
    return gltf.scene;
  }
}
