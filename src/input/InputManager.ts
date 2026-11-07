export interface FlightInput { pitch: number; roll: number; throttle: number }
export class InputManager {
  private keys = new Set<string>();
  private down = (event: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) event.preventDefault();
    this.keys.add(event.code);
  };
  private up = (event: KeyboardEvent) => { this.keys.delete(event.code); };
  private onBlur = () => { this.keys.clear(); };
  constructor() {
    window.addEventListener('keydown', this.down);
    window.addEventListener('keyup', this.up);
    window.addEventListener('blur', this.onBlur);
  }
  clear() { this.keys.clear(); }
  read(): FlightInput {
    const pressed = (...codes: string[]) => Number(codes.some(code => this.keys.has(code)));
    return { pitch: pressed('KeyW', 'ArrowUp') - pressed('KeyS', 'ArrowDown'), roll: pressed('KeyD', 'ArrowRight') - pressed('KeyA', 'ArrowLeft'), throttle: pressed('ShiftLeft', 'ShiftRight') - pressed('ControlLeft', 'ControlRight') };
  }
  dispose() {
    window.removeEventListener('keydown', this.down);
    window.removeEventListener('keyup', this.up);
    window.removeEventListener('blur', this.onBlur);
  }
}
