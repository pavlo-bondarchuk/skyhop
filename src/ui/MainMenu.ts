import { ArrowLeft, ArrowRight, ArrowUpRight, Plane, createElement } from 'lucide';
export class MainMenu {
  readonly element = document.createElement('section');
  readonly title: HTMLElement;
  readonly description: HTMLElement;
  readonly legend: HTMLElement;
  private name: HTMLElement;
  private number: HTMLElement;
  private details: HTMLElement;
  private dots: HTMLElement;
  private onKey = (event: KeyboardEvent) => {
    if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') { event.preventDefault(); this.onSelect(event.code === 'ArrowRight' ? 1 : -1); }
    if (event.code === 'Enter') { event.preventDefault(); this.onStart(); }
  };
  private pointerStart: { x: number; y: number; id: number } | null = null;
  constructor(private onStart: () => void, private onSelect: (direction: number) => void, private selection: () => { name: string; description: string; index: number; count: number }) {
    this.element.className = 'menu';
    this.element.innerHTML = `<div class="eyebrow">A SMALL PLANE. A WHOLE WORLD.</div><h1>Take the<br>scenic route<span>.</span></h1><p>Leave the everyday behind.<br>Find your own way around a little blue world.</p><div class="selector"><button class="select-arrow previous" aria-label="Previous aircraft"></button><div class="aircraft-legend"><div class="aircraft-name"></div><div class="aircraft-number"></div><p class="aircraft-description"></p><div class="aircraft-dots"></div><small class="enter-hint">ENTER TO FLY</small></div><button class="select-arrow next" aria-label="Next aircraft"></button></div><button class="launch">Let's fly</button><div class="aircraft-card"><span class="plane-icon"></span><div><small>SELECTED AIRCRAFT</small><strong class="card-name"></strong></div></div>`;
    this.title = this.element.querySelector('h1')!; this.description = this.element.querySelector('.menu > p')!; this.legend = this.element.querySelector('.selector')!;
    this.name = this.element.querySelector('.aircraft-name')!; this.number = this.element.querySelector('.aircraft-number')!; this.details = this.element.querySelector('.aircraft-description')!; this.dots = this.element.querySelector('.aircraft-dots')!;
    this.element.querySelector('.launch')!.append(createElement(ArrowUpRight, { width: 19 })); this.element.querySelector('.plane-icon')!.append(createElement(Plane, { width: 24 }));
    this.element.querySelector('.previous')!.append(createElement(ArrowLeft)); this.element.querySelector('.next')!.append(createElement(ArrowRight));
    this.element.querySelector('.launch')!.addEventListener('click', this.onStart);
    this.element.querySelector('.previous')!.addEventListener('click', () => this.onSelect(-1)); this.element.querySelector('.next')!.addEventListener('click', () => this.onSelect(1));
    this.element.addEventListener('pointerdown', this.pointerDown); this.element.addEventListener('pointerup', this.pointerUp);
    window.addEventListener('keydown', this.onKey); this.renderSelection();
  }
  private pointerDown = (event: PointerEvent) => { if (event.target instanceof Element && event.target.closest('button')) return; this.pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId }; };
  private pointerUp = (event: PointerEvent) => { const start = this.pointerStart; this.pointerStart = null; if (!start || start.id !== event.pointerId) return; const dx = event.clientX - start.x; if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(event.clientY - start.y) * 1.2) this.onSelect(dx < 0 ? 1 : -1); };
  renderSelection() { const s = this.selection(); this.name.textContent = s.name; this.number.textContent = `${String(s.index + 1).padStart(2, '0')} / ${String(s.count).padStart(2, '0')}`; this.details.textContent = s.description; this.element.querySelector('.card-name')!.textContent = s.name; this.dots.innerHTML = Array.from({ length: s.count }, (_, i) => `<i class="${i === s.index ? 'active' : ''}"></i>`).join(''); }
  transition(direction: number, done: () => void) { this.element.dataset.direction = String(direction); this.element.classList.add('switching'); window.setTimeout(() => { this.renderSelection(); this.element.classList.remove('switching'); this.element.dataset.direction = '0'; done(); }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 420); }
  enterFlight() { this.element.classList.add('leaving'); }
  returnToSelection() { this.element.classList.remove('leaving'); this.element.dataset.direction = '0'; }
  setBusy(busy: boolean) { this.element.querySelectorAll<HTMLButtonElement>('button').forEach(button => { button.disabled = busy; }); }
  dispose() { window.removeEventListener('keydown', this.onKey); this.element.removeEventListener('pointerdown', this.pointerDown); this.element.removeEventListener('pointerup', this.pointerUp); }
}
