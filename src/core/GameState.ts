export type GameMode = 'selection' | 'transitioning' | 'takeoff' | 'flying' | 'paused' | 'returning';
export class GameState {
  mode: GameMode = 'selection';
  private beforePause: 'takeoff' | 'flying' = 'flying';
  beginStart() { if (this.mode !== 'selection') return false; this.mode = 'transitioning'; return true; }
  beginTakeoff() { if (this.mode !== 'transitioning') return false; this.mode = 'takeoff'; return true; }
  beginFlight() { if (this.mode !== 'takeoff') return false; this.mode = 'flying'; return true; }
  pause() { if (this.mode !== 'flying' && this.mode !== 'takeoff') return false; this.beforePause = this.mode; this.mode = 'paused'; return true; }
  resume() { if (this.mode !== 'paused') return false; this.mode = this.beforePause; return true; }
  beginReturn() { if (!['takeoff', 'flying', 'paused'].includes(this.mode)) return false; this.mode = 'returning'; return true; }
  finishReturn() { if (this.mode !== 'returning') return false; this.mode = 'selection'; return true; }
}
