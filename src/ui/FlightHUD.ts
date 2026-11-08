import { Pause, Play, Square, createElement } from 'lucide';
import type { FlightPhysics } from '../physics/FlightPhysics';

export class FlightHUD {
  readonly element = document.createElement('section');
  private speed: HTMLElement;
  private altitude: HTMLElement;
  private fuel: HTMLElement;
  private throttle: HTMLInputElement;
  private flaps: HTMLElement;
  private modal: HTMLElement;
  private menuIndex = 0;
  private menuKeydown = (event: KeyboardEvent) => {
    if (this.modal.hidden) return;
    if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
      event.preventDefault();
      this.menuIndex = this.menuIndex === 0 ? 1 : 0;
      this.updateMenuSelection();
    } else if (event.code === 'Enter') {
      event.preventDefault();
      this.modal.querySelectorAll<HTMLButtonElement>('.pause-card button')[this.menuIndex]?.click();
    }
  };
  constructor(onPause: () => void, onResume: () => void, onStop: () => void, onThrottle: (value: number) => void, onFlaps: (value: number) => void) {
    this.element.className = 'hud';
    this.element.innerHTML = `<div class="instrument-panel"><div class="gauge"><small>AIRSPEED</small><strong data-speed>0</strong><span>M/S</span><i class="gauge-needle speed-needle"></i></div><div class="gauge"><small>ALTITUDE</small><strong data-altitude>0</strong><span>M</span><i class="gauge-needle altitude-needle"></i></div><div class="fuel-gauge"><small>FUEL</small><strong data-fuel></strong><span>L</span><div class="fuel-track"><i></i></div></div><label class="lever throttle-lever"><small>THROTTLE</small><input aria-label="Throttle" type="range" min="0" max="100" value="65"><span>0 — 100%</span></label><button class="flaps-lever" aria-label="Toggle flaps"><small>FLAPS</small><strong>UP</strong></button></div><button class="pause-button" aria-label="Pause flight"></button><div class="pause-overlay" hidden><div class="pause-card"><small>FLIGHT PAUSED</small><h2>Take a breather.</h2><button class="resume">Resume</button><button class="stop-flight">Stop flight</button></div></div><div class="fuel-warning" role="alert" hidden>FUEL EMPTY · GLIDE TO A SAFE LANDING</div>`;
    this.speed = this.element.querySelector('[data-speed]')!;
    this.altitude = this.element.querySelector('[data-altitude]')!;
    this.fuel = this.element.querySelector('[data-fuel]')!;
    this.throttle = this.element.querySelector('[aria-label="Throttle"]')!;
    this.flaps = this.element.querySelector('.flaps-lever strong')!;
    this.modal = this.element.querySelector('.pause-overlay')!;
    this.element.querySelector('.pause-button')!.append(createElement(Pause));
    this.element.querySelector('.resume')!.append(createElement(Play));
    this.element.querySelector('.stop-flight')!.append(createElement(Square));
    this.element.querySelector('.pause-button')!.addEventListener('click', onPause);
    this.element.querySelector('.resume')!.addEventListener('click', onResume);
    this.element.querySelector('.stop-flight')!.addEventListener('click', onStop);
    window.addEventListener('keydown', this.menuKeydown);
    this.throttle.addEventListener('input', () => onThrottle(Number(this.throttle.value) / 100));
    this.element.querySelector('.flaps-lever')!.addEventListener('click', () => onFlaps(this.flaps.textContent === 'UP' ? 1 : 0));
  }
  update(body: FlightPhysics) {
    this.speed.textContent = body.speed.toFixed(0);
    this.altitude.textContent = body.altitude.toFixed(0);
    this.fuel.textContent = body.fuel.toFixed(1);
    if (document.activeElement !== this.throttle) this.throttle.value = String(Math.round(body.throttleLevel * 100));
    this.flaps.textContent = body.flaps ? 'DOWN' : 'UP';
    this.element.querySelector<HTMLElement>('.fuel-track i')!.style.transform = `scaleX(${body.fuel / 100})`;
    this.element.querySelector<HTMLElement>('.fuel-warning')!.hidden = body.fuel > 0;
  }
  private updateMenuSelection() {
    this.modal.querySelectorAll<HTMLButtonElement>('.pause-card button').forEach((button, index) => {
      button.classList.toggle('selected', index === this.menuIndex);
      button.setAttribute('aria-pressed', String(index === this.menuIndex));
    });
  }
  setPaused(paused: boolean) { this.modal.hidden = !paused; this.menuIndex = 0; if (paused) this.updateMenuSelection(); }
  setVisible(visible: boolean) { this.element.classList.toggle('visible', visible); }
}
