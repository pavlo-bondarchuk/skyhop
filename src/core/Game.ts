import { AmbientLight, Color, DirectionalLight, FogExp2, Scene, WebGLRenderer, Mesh, type Object3D } from 'three';
import { Aircraft } from '../aircraft/Aircraft';
import { AircraftLoader } from '../aircraft/AircraftLoader';
import { FlightController } from '../aircraft/FlightController';
import { FollowCamera } from '../camera/FollowCamera';
import { planetRadius, scout } from '../config/aircraft';
import { InputManager } from '../input/InputManager';
import { FlightPhysics } from '../physics/FlightPhysics';
import { FlightHUD } from '../ui/FlightHUD';
import { MainMenu } from '../ui/MainMenu';
import { Airport } from '../world/Airport';
import { Clouds } from '../world/Clouds';
import { Planet } from '../world/Planet';
import { Terrain } from '../world/Terrain';
import { GameLoop } from './GameLoop';
import { GameState } from './GameState';
export class Game {
  private scene = new Scene();
  private renderer = new WebGLRenderer({ antialias: true });
  private camera = new FollowCamera();
  private input = new InputManager();
  private state = new GameState();
  private physics = new FlightPhysics(scout, planetRadius);
  private controller: FlightController;
  private hud = new FlightHUD();
  private loop = new GameLoop(dt => this.update(dt));
  private resize = () => { this.camera.resize(); this.renderer.setSize(window.innerWidth, window.innerHeight); };
  private keydown = (event: KeyboardEvent) => { if (event.code === 'Escape') this.state.togglePause(); };
  constructor(private root: HTMLElement) {
    this.scene.background = new Color('#b9d9d7'); this.scene.fog = new FogExp2('#b9d9d7', 0.0014);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.domElement.setAttribute('aria-label', 'SKYHOP 3D world');
    this.root.append(this.renderer.domElement);
    this.scene.add(new AmbientLight('#fff5dc', 2));
    const sun = new DirectionalLight('#fff0d3', 3); sun.position.set(-60, 150, 70); this.scene.add(sun);
    this.scene.add(new Planet(planetRadius), new Terrain(planetRadius), new Clouds(planetRadius), new Airport(planetRadius));
    const aircraft = new Aircraft(); this.scene.add(aircraft);
    this.controller = new FlightController(this.physics, aircraft);
    if (scout.modelPath) void this.replaceModel(aircraft, scout.modelPath);
    const menu = new MainMenu(() => { this.state.start(); menu.hide(); this.hud.element.hidden = false; });
    this.root.append(menu.element, this.hud.element);
    this.camera.follow(this.physics, 0, true); this.resize();
    window.addEventListener('resize', this.resize); window.addEventListener('keydown', this.keydown);
    this.loop.start(); this.root.dataset.ready = 'true';
  }
  private async replaceModel(fallback: Object3D, path: string) {
    try {
      const model = await new AircraftLoader().load(path);
      if (!this.renderer.domElement.isConnected) return;
      this.scene.remove(fallback); this.scene.add(model); this.controller = new FlightController(this.physics, model);
    } catch (error) { console.warn('Local aircraft model unavailable; using procedural aircraft.', error); }
  }
  private update(dt: number) {
    if (this.state.mode === 'flying') this.controller.update(dt, this.input.read());
    this.camera.follow(this.physics, dt); this.hud.update(this.physics, this.state.mode === 'paused');
    this.renderer.render(this.scene, this.camera);
  }
  dispose() {
    this.loop.stop(); this.input.dispose(); window.removeEventListener('resize', this.resize); window.removeEventListener('keydown', this.keydown);
    this.scene.traverse(object => { if (object instanceof Mesh) { object.geometry.dispose(); const materials = Array.isArray(object.material) ? object.material : [object.material]; materials.forEach(material => material.dispose()); } });
    this.renderer.dispose(); this.root.replaceChildren();
  }
}
