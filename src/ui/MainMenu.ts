import { ArrowUpRight, Plane, createElement } from 'lucide';
export class MainMenu {
  readonly element = document.createElement('section');
  constructor(onStart: () => void) {
    this.element.className = 'menu';
    this.element.innerHTML = `<div class="eyebrow">A SMALL PLANE. A WHOLE WORLD.</div><h1>Take the<br>scenic route<span>.</span></h1><p>Leave the everyday behind.<br>Find your own way around a little blue world.</p><button class="launch">Let's fly</button><div class="aircraft-card"><span class="plane-icon"></span><div><small>YOUR AIRCRAFT</small><strong>Sparrow / 01</strong></div><span class="tag">READY</span></div>`;
    this.element.querySelector('button')!.append(createElement(ArrowUpRight, { width: 19 }));
    this.element.querySelector('.plane-icon')!.append(createElement(Plane, { width: 24 }));
    this.element.querySelector('button')!.addEventListener('click', onStart);
  }
  hide() { this.element.hidden = true; }
}
