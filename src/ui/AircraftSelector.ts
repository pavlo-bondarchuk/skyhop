import { ArrowLeft, ArrowRight, ArrowUpRight, createElement } from 'lucide';

export interface AircraftSelection { name: string; description: string; index: number; count: number }

export class AircraftSelector {
  readonly element = document.createElement('section');
  private name: HTMLElement;
  private counter: HTMLElement;
  private description: HTMLElement;
  private dots: HTMLElement;
  private pointer: { x: number; y: number; id: number } | null = null;
  private onKey = (event: KeyboardEvent) => {
    if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
      event.preventDefault();
      this.onSelect(event.code === 'ArrowRight' ? 1 : -1);
    }
    if (event.code === 'Enter') { event.preventDefault(); this.onStart(); }
  };

  constructor(private selection: () => AircraftSelection, private onSelect: (direction: number) => void, private onStart: () => void) {
    this.element.className = 'aircraft-selector';
    this.element.innerHTML = `<div class="selector-content"><div class="selector-copy"><div class="aircraft-name"></div><div class="aircraft-counter"></div><p class="aircraft-description"></p><div class="aircraft-dots" role="tablist" aria-label="Aircraft"></div></div><button class="select-arrow previous" aria-label="Previous aircraft"></button><button class="select-arrow next" aria-label="Next aircraft"></button><div class="selector-actions"><button class="launch">Let's fly</button><small class="enter-hint">OR PRESS ENTER</small></div></div>`;
    this.name = this.element.querySelector('.aircraft-name')!;
    this.counter = this.element.querySelector('.aircraft-counter')!;
    this.description = this.element.querySelector('.aircraft-description')!;
    this.dots = this.element.querySelector('.aircraft-dots')!;
    this.element.querySelector('.previous')!.append(createElement(ArrowLeft));
    this.element.querySelector('.next')!.append(createElement(ArrowRight));
    this.element.querySelector('.launch')!.append(createElement(ArrowUpRight, { width: 19 }));
    this.element.querySelector('.launch')!.addEventListener('click', onStart);
    this.element.querySelector('.previous')!.addEventListener('click', () => onSelect(-1));
    this.element.querySelector('.next')!.addEventListener('click', () => onSelect(1));
    this.element.addEventListener('pointerdown', this.onPointerDown);
    this.element.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('keydown', this.onKey);
    this.render();
  }

  private onPointerDown = (event: PointerEvent) => {
    if (event.target instanceof Element && event.target.closest('button')) return;
    this.pointer = { x: event.clientX, y: event.clientY, id: event.pointerId };
  };
  private onPointerUp = (event: PointerEvent) => {
    const pointer = this.pointer;
    this.pointer = null;
    if (!pointer || pointer.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(event.clientY - pointer.y) * 1.2) this.onSelect(dx < 0 ? 1 : -1);
  };
  render() {
    const selection = this.selection();
    this.name.textContent = selection.name;
    this.counter.textContent = `${String(selection.index + 1).padStart(2, '0')} / ${String(selection.count).padStart(2, '0')}`;
    this.description.textContent = selection.description;
    this.dots.replaceChildren(...Array.from({ length: selection.count }, (_, index) => {
      const dot = document.createElement('i');
      dot.className = index === selection.index ? 'active' : '';
      dot.setAttribute('aria-label', `Aircraft ${index + 1}`);
      return dot;
    }));
  }
  transition(direction: number, done: () => void) {
    this.element.dataset.direction = String(direction);
    this.element.classList.add('switching');
    window.setTimeout(() => { this.render(); this.element.classList.remove('switching'); this.element.dataset.direction = '0'; done(); }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 420);
  }
  enterFlight() { this.element.classList.add('leaving'); }
  returnToSelection() { this.element.classList.remove('leaving'); this.element.dataset.direction = '0'; }
  setBusy(busy: boolean) { this.element.querySelectorAll<HTMLButtonElement>('button').forEach(button => { button.disabled = busy; }); }
  dispose() { window.removeEventListener('keydown', this.onKey); this.element.removeEventListener('pointerdown', this.onPointerDown); this.element.removeEventListener('pointerup', this.onPointerUp); }
}
