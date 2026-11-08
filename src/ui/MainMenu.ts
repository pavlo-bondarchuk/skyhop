import { AircraftSelector, type AircraftSelection } from './AircraftSelector';

export class MainMenu {
  readonly element = document.createElement('section');
  readonly title: HTMLElement;
  readonly description: HTMLElement;
  readonly selector: AircraftSelector;

  constructor(onStart: () => void, onSelect: (direction: number) => void, selection: () => AircraftSelection) {
    this.element.className = 'menu';
    this.element.innerHTML = `<div class="intro"><div class="eyebrow">A SMALL PLANE. A WHOLE WORLD.</div><h1>Take the<br>scenic route<span>.</span></h1><p>Leave the everyday behind.<br>Find your own way around a little blue world.</p></div>`;
    this.title = this.element.querySelector('h1')!;
    this.description = this.element.querySelector('.intro > p')!;
    this.selector = new AircraftSelector(selection, onSelect, onStart);
    this.element.append(this.selector.element);
  }
  transition(direction: number, done: () => void) { this.selector.transition(direction, done); }
  enterFlight() { this.element.classList.add('leaving'); this.selector.enterFlight(); }
  returnToSelection() { this.element.classList.remove('leaving'); this.selector.returnToSelection(); }
  setBusy(busy: boolean) { this.selector.setBusy(busy); }
  dispose() { this.selector.dispose(); }
}
