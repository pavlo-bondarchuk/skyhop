import type { FlightPhysics } from '../physics/FlightPhysics';
export class FlightHUD {
  readonly element = document.createElement('section');
  private speed: HTMLElement;
  private altitude: HTMLElement;
  private status: HTMLElement;
  constructor() {
    this.element.className = 'hud'; this.element.hidden = true;
    this.element.innerHTML = `<div class="flight-status">FREE FLIGHT <span>● LIVE</span></div><div class="instruments"><div><small>AIRSPEED</small><strong data-speed></strong><span>m/s</span></div><div><small>ALTITUDE</small><strong data-altitude></strong><span>m</span></div></div><div class="pause-status" role="status"></div>`;
    this.speed = this.element.querySelector('[data-speed]')!;
    this.altitude = this.element.querySelector('[data-altitude]')!;
    this.status = this.element.querySelector('.pause-status')!;
  }
  update(body: FlightPhysics, paused: boolean) {
    this.speed.textContent = body.speed.toFixed(0); this.altitude.textContent = body.altitude.toFixed(0);
    this.status.textContent = paused ? 'Paused · press Esc to resume' : '';
  }
}
