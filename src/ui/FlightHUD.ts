import { Pause, Play, Square, createElement } from 'lucide';
import type { FlightPhysics } from '../physics/FlightPhysics';
export class FlightHUD {
 readonly element=document.createElement('section'); private speed:HTMLElement; private altitude:HTMLElement; private modal:HTMLElement;
 constructor(onPause:()=>void,onResume:()=>void,onStop:()=>void){this.element.className='hud';this.element.innerHTML=`<div class="instruments"><div><small>AIRSPEED</small><strong data-speed></strong><span>m/s</span></div><div><small>ALTITUDE</small><strong data-altitude></strong><span>m</span></div></div><button class="pause-button" aria-label="Pause flight"></button><div class="pause-overlay" hidden><div class="pause-card"><small>FLIGHT PAUSED</small><h2>Take a breather.</h2><button class="resume">Resume</button><button class="stop-flight">Stop flight</button></div></div>`;this.speed=this.element.querySelector('[data-speed]')!;this.altitude=this.element.querySelector('[data-altitude]')!;this.modal=this.element.querySelector('.pause-overlay')!;this.element.querySelector('.pause-button')!.append(createElement(Pause));this.element.querySelector('.resume')!.append(createElement(Play));this.element.querySelector('.stop-flight')!.append(createElement(Square));this.element.querySelector('.pause-button')!.addEventListener('click',onPause);this.element.querySelector('.resume')!.addEventListener('click',onResume);this.element.querySelector('.stop-flight')!.addEventListener('click',onStop);}
 update(body:FlightPhysics){this.speed.textContent=body.speed.toFixed(0);this.altitude.textContent=body.altitude.toFixed(0)}
 setPaused(paused:boolean){this.modal.hidden=!paused}
 setVisible(visible:boolean){this.element.classList.toggle('visible',visible)}
}
