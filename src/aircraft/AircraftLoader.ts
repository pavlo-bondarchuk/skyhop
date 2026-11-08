import { AnimationMixer, Group, Object3D } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import type { AircraftConfig } from '../config/aircraft';
interface CachedModel { scene: Group; animations: import('three').AnimationClip[] }
const cache = new Map<string, Promise<CachedModel>>();
export interface AircraftInstance { root: Group; visualPivot: Group; mixer: AnimationMixer; update(dt: number): void }
export class AircraftLoader {
  private loader = new GLTFLoader();
  async load(config: AircraftConfig): Promise<AircraftInstance> {
    if (!config.modelPath.startsWith('/models/aircraft/') || !config.modelPath.endsWith('.glb')) throw new Error('Aircraft must be a local GLB in public/models/aircraft.');
    let model = cache.get(config.modelPath);
    if (!model) {
      model = this.loader.loadAsync(config.modelPath).then(gltf => ({ scene: gltf.scene, animations: gltf.animations }));
      cache.set(config.modelPath, model); model.catch(() => cache.delete(config.modelPath));
    }
    const asset = await model;
    const root = new Group(); root.name = `${config.id}-physical-root`;
    const pivot = new Group(); pivot.name = `${config.id}-visual-pivot`; pivot.rotation.y = config.correctionDegrees * Math.PI / 180;
    const visual = asset.scene.clone(true);
    visual.scale.setScalar(2.1);
    pivot.add(visual); root.add(pivot);
    const mixer = new AnimationMixer(visual);
    for (const clip of asset.animations) mixer.clipAction(clip).play();
    const propellers: Object3D[] = [];
    visual.traverse(node => { if (config.propellerNodes.includes(node.name)) propellers.push(node); });
    return { root, visualPivot: pivot, mixer, update: dt => { mixer.update(dt); for (const prop of propellers) prop.rotateX(dt * 35); } };
  }
}
