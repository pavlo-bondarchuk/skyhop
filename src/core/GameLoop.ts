export class GameLoop {
  private frame = 0;
  private previous = 0;
  constructor(private update: (dt: number) => void) {}
  start() { if (!this.frame) { this.previous = performance.now(); this.frame = requestAnimationFrame(this.tick); } }
  private tick = (now: number) => {
    this.update(Math.min((now - this.previous) / 1000, 0.05)); this.previous = now;
    this.frame = requestAnimationFrame(this.tick);
  };
  stop() { cancelAnimationFrame(this.frame); this.frame = 0; }
}
