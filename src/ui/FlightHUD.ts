import { Fuel, Pause, Play, Square, createElement } from 'lucide';
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
    this.element.innerHTML = `<div class="instrument-panel"><svg class="panel-shell" viewBox="0 0 1600 270" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="shell-face" x1="0" y1="0" x2="0.2" y2="1"><stop stop-color="#35585d"/><stop offset=".42" stop-color="#24464c"/><stop offset="1" stop-color="#112f37"/></linearGradient><linearGradient id="shell-bevel" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#789497"/><stop offset=".35" stop-color="#3d6469"/><stop offset="1" stop-color="#172f35"/></linearGradient><linearGradient id="shell-side" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#59797b"/><stop offset="1" stop-color="#203e44"/></linearGradient></defs><path d="M0 270V119L49 119 163 52 603 52 680 18H920L997 52H1437L1551 119H1600V270Z" fill="#0c262c"/><path d="M0 263V123L54 123 170 58H608L688 24H912L992 58H1430L1546 123H1600V263Z" fill="url(#shell-bevel)"/><path d="M0 139 61 139 180 75H617L697 39H903L983 75H1420L1539 139H1600V253H0Z" fill="url(#shell-face)"/><path d="M0 139 61 139 180 75 165 52 49 119 0 119Z" fill="url(#shell-side)"/><path d="M1600 139 1539 139 1420 75 1437 52 1551 119 1600 119Z" fill="url(#shell-side)"/><path d="M180 75 617 75 697 39 688 24 608 58 170 58Z" fill="#89a4a1" opacity=".48"/><path d="M920 18 997 52H1437L1420 75H983L903 39Z" fill="#789394" opacity=".48"/><path d="M0 221 142 172 153 183 40 235Z" fill="#ed7547"/><path d="M1600 221 1458 172 1447 183 1560 235Z" fill="#ed7547"/><path d="M624 69 675 34 693 40 650 70Z" fill="#f18a54"/><path d="M976 69 925 34 907 40 950 70Z" fill="#f18a54"/><path d="M64 246H1536" stroke="#86a2a0" stroke-width="2" opacity=".46"/><g fill="#cabd9b" stroke="#203a3e" stroke-width="4"><path d="m42 166 9-7 10 7-2 12-9 4-9-6z"/><path d="m1538 166 9-7 10 7-2 12-9 4-9-6z"/><path d="m188 235 9-7 10 7-2 12-9 4-9-6z"/><path d="m1404 235 9-7 10 7-2 12-9 4-9-6z"/></g><g fill="#f4e7c6"><circle cx="49" cy="167" r="2"/><circle cx="1546" cy="167" r="2"/><circle cx="195" cy="236" r="2"/><circle cx="1411" cy="236" r="2"/></g></svg><div class="instrument-row"><div class="gauge"><small>AIRSPEED</small><div class="dial-ticks" aria-hidden="true"></div><i class="gauge-needle speed-needle"></i><i class="needle-hub"></i><div class="dial-reading"><strong data-speed>0</strong><span>M/S</span></div></div><div class="gauge"><small>ALTITUDE</small><div class="dial-ticks" aria-hidden="true"></div><i class="gauge-needle altitude-needle"></i><i class="needle-hub"></i><div class="dial-reading"><strong data-altitude>0</strong><span>M</span></div></div><div class="gauge fuel-gauge"><small>FUEL</small><span class="fuel-icon"></span><div class="dial-ticks" aria-hidden="true"></div><i class="gauge-needle fuel-needle"></i><i class="needle-hub"></i><div class="dial-reading"><strong data-fuel></strong><span>L</span></div><div class="fuel-track"><i></i></div></div><div class="throttle-module"><svg class="module-shape" viewBox="0 0 320 150" preserveAspectRatio="none" aria-hidden="true"><path d="M18 2H302L318 18V132L302 148H18L2 132V18Z" fill="#8b958d"/><path d="M20 7H300L311 19V130L299 141H20L9 130V20Z" fill="#f3e7c9"/><path d="M20 7H300L311 19H9Z" fill="#fff5df"/><path d="M9 20 20 7V141L9 130Z" fill="#c8b998"/></svg><label class="lever"><small>THROTTLE</small><input aria-label="Throttle" type="range" min="0" max="100" value="65"><span><b>0%</b><i></i><b>100%</b></span></label></div><div class="flaps-module"><svg class="module-shape" viewBox="0 0 150 150" preserveAspectRatio="none" aria-hidden="true"><path d="M18 2H132L148 18V132L132 148H18L2 132V18Z" fill="#8b958d"/><path d="M19 8H131L142 19V131L131 142H19L8 131V19Z" fill="#f1e5c6"/><path d="M19 8H131L142 19H8Z" fill="#fff5df"/></svg><div class="flaps-content"><small>FLAPS</small><button class="flaps-lever" aria-label="Toggle flaps"><strong>UP</strong></button></div></div></div></div><button class="pause-button" aria-label="Pause flight"></button><div class="pause-overlay" hidden><div class="pause-card"><small>FLIGHT PAUSED</small><h2>Take a breather.</h2><button class="resume">Resume</button><button class="stop-flight">Stop flight</button></div></div><div class="fuel-warning" role="alert" hidden>FUEL EMPTY · GLIDE TO A SAFE LANDING</div>`;
    this.speed = this.element.querySelector('[data-speed]')!;
    this.element.querySelectorAll<HTMLElement>('.dial-ticks').forEach(ticks => { for (let index = 0; index <= 20; index++) { const tick = document.createElement('i'); tick.className = index % 2 === 0 ? 'major' : ''; tick.style.setProperty('--tick-angle', `${-135 + index * 13.5}deg`); ticks.append(tick); } });
    this.element.querySelector('.fuel-icon')!.append(createElement(Fuel, { width: 17, height: 17 }));
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
    this.element.querySelector<HTMLElement>('.speed-needle')!.style.transform = `rotate(${Math.max(-130, Math.min(130, body.speed / 45 * 130 - 65))}deg)`;
    this.element.querySelector<HTMLElement>('.altitude-needle')!.style.transform = `rotate(${Math.max(-130, Math.min(130, body.altitude / 60 * 130 - 65))}deg)`;
    this.element.querySelector<HTMLElement>('.fuel-needle')!.style.transform = `rotate(${Math.max(-130, Math.min(130, body.fuel / 100 * 260 - 130))}deg)`;
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
