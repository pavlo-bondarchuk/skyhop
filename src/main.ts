import './style.css';
import { Game } from './core/Game';
const root=document.querySelector<HTMLDivElement>('#app')!;
root.innerHTML=`<header><a class="brand" href="/">SKYHOP<span>®</span></a><span class="edition">THE EXPLORER SERIES <b> / 001</b></span><span class="build">EARLY FLIGHT <i></i></span></header><footer><span>W / S <b>Pitch</b> &nbsp; A / D <b>Turn</b> &nbsp; SHIFT / CTRL <b>Throttle</b> &nbsp; ESC <b>Pause</b></span><span>NO DESTINATION REQUIRED ↗</span></footer>`;
try{const game=new Game(root);if(import.meta.hot)import.meta.hot.dispose(()=>game.dispose())}catch(error){const message=document.createElement('p');message.className='error';message.textContent='SKYHOP needs WebGL. Please enable hardware acceleration and reload.';root.append(message);console.error(error)}
