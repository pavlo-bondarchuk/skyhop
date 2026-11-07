export type GameMode = 'menu' | 'flying' | 'paused';
export class GameState {
  mode: GameMode = 'menu';
  start() { this.mode = 'flying'; }
  togglePause() { if (this.mode !== 'menu') this.mode = this.mode === 'flying' ? 'paused' : 'flying'; }
}
