import { expect, it } from 'vitest';
import { GameState } from './GameState';
it('starts in the menu and toggles pause only in flight', () => {
  const state = new GameState(); state.togglePause(); expect(state.mode).toBe('menu');
  state.start(); expect(state.mode).toBe('flying'); state.togglePause(); expect(state.mode).toBe('paused'); state.togglePause(); expect(state.mode).toBe('flying');
});
