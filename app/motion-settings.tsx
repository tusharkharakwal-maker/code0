'use client';
import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react';
import { Pause, Play } from 'lucide-react';

const MotionContext = createContext({ paused: false, reduced: false, toggle: () => {} });
let pausedFallback = false;
const serverSnapshot = () => false;
const pauseSnapshot = () => {
  try { return localStorage.getItem('codies-motion-paused') === 'true'; }
  catch { return pausedFallback; }
};
const subscribePause = (notify: () => void) => {
  window.addEventListener('storage', notify);
  window.addEventListener('codies-motion-change', notify);
  return () => {
    window.removeEventListener('storage', notify);
    window.removeEventListener('codies-motion-change', notify);
  };
};
const reducedSnapshot = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const subscribeReduced = (notify: () => void) => {
  const query = matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
};
export function MotionProvider({ children }: { children: ReactNode }) {
  const paused = useSyncExternalStore(subscribePause, pauseSnapshot, serverSnapshot);
  const reduced = useSyncExternalStore(subscribeReduced, reducedSnapshot, serverSnapshot);
  function toggle() {
    pausedFallback = !paused;
    try { localStorage.setItem('codies-motion-paused', String(pausedFallback)); } catch {}
    window.dispatchEvent(new Event('codies-motion-change'));
  }
  return <MotionContext.Provider value={{ paused, reduced, toggle }}>{children}</MotionContext.Provider>;
}
export const useMotionSettings = () => useContext(MotionContext);
export function MotionToggle() {
  const { paused, reduced, toggle } = useMotionSettings();
  return <button className="motion-toggle" onClick={toggle} disabled={reduced} aria-pressed={paused || reduced} aria-label={reduced ? 'Reduced motion enabled by your device' : paused ? 'Resume site animations' : 'Pause site animations'} title={reduced ? 'Reduced motion enabled' : paused ? 'Resume motion' : 'Pause motion'}>{paused || reduced ? <Play size={15}/> : <Pause size={15}/>}</button>;
}
