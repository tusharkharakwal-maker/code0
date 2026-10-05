'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionSettings } from './motion-settings';

gsap.registerPlugin(ScrollTrigger);

// A genuine animated 3D line sculpture: geometry is projected into a 2D canvas.
// No image sequence, per-frame React updates, or heavyweight WebGL dependency.
export function GenerativeVisual({ mode = 'hero', className = '' }: { mode?: 'hero' | 'story'; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { paused, reduced } = useMotionSettings();
  useEffect(() => {
    const node = canvas.current;
    const host = node?.parentElement;
    if (!node || !host) return;
    const ctx = node.getContext('2d');
    if (!ctx) return;
    const staticMode = paused || reduced || matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = matchMedia('(max-width: 767px)').matches;
    const strands = mobile ? 32 : 52;
    const steps = mobile ? 116 : 164;
    const shapes: Float32Array[][] = [[], [], []];
    // Continuous ribbon, ordered spherical network, and expanding orbital paths.
    for (let shape = 0; shape < 3; shape++) {
      for (let line = 0; line < strands; line++) {
        const points = new Float32Array((steps + 1) * 3);
        const v = line / strands * Math.PI * 2;
        for (let j = 0; j <= steps; j++) {
          const u = j / steps * Math.PI * 2;
          const k = j * 3;
          if (shape === 0) {
            const r = 1.8 + .56 * Math.cos(3 * u) + .28 * Math.cos(v);
            points[k] = r * Math.cos(2 * u);
            points[k+1] = r * Math.sin(2 * u);
            points[k+2] = .84 * Math.sin(3 * u) + .28 * Math.sin(v);
          } else if (shape === 1) {
            const latitude = (line / (strands - 1) - .5) * Math.PI;
            points[k] = 2.35 * Math.cos(latitude) * Math.cos(u);
            points[k+1] = 2.35 * Math.sin(latitude);
            points[k+2] = 2.35 * Math.cos(latitude) * Math.sin(u);
          } else {
            const twist = v * .45;
            const radius = 1.55 + line / strands * .95;
            points[k] = radius * Math.cos(u);
            points[k+1] = radius * Math.sin(u) * Math.cos(twist);
            points[k+2] = radius * Math.sin(u) * Math.sin(twist);
          }
        }
        shapes[shape].push(points);
      }
    }
    const pose = { phase: 0, scroll: 0, pointerX: 0, pointerY: 0 };
    let width = 0, height = 0, visible = true, time = 0;
    const screen = new Float32Array((steps + 1) * 2);
    function draw() {
      if (!ctx || !node || !width || !height) return;
      ctx.clearRect(0, 0, width, height);
      const a = time * .12 + pose.scroll * .9 + pose.pointerX * .22;
      const b = -.46 + Math.sin(time * .09) * .18 + pose.pointerY * .18;
      const c = -.25 + pose.scroll * .16;
      const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b), cc = Math.cos(c), sc = Math.sin(c);
      const phase = Math.max(0, Math.min(2, pose.phase));
      const from = Math.floor(phase), to = Math.min(2, from + 1), mix = phase - from;
      const scale = Math.min(width, height) * .148;
      for (let line = 0; line < strands; line++) {
        const start = shapes[from][line], end = shapes[to][line];
        let depth = 0;
        for (let j = 0; j <= steps; j++) {
          const k = j * 3;
          const x = start[k] + (end[k] - start[k]) * mix;
          const y = start[k+1] + (end[k+1] - start[k+1]) * mix;
          const z = start[k+2] + (end[k+2] - start[k+2]) * mix;
          const rx = x * ca + z * sa, rz = z * ca - x * sa;
          const ry = y * cb - rz * sb, dz = y * sb + rz * cb;
          const perspective = 7 / (7 - dz);
          screen[j*2] = width/2 + (rx*cc-ry*sc)*scale*perspective;
          screen[j*2+1] = height/2 + (rx*sc+ry*cc)*scale*perspective;
          depth += dz;
        }
        const highlight = .45 + .45 * Math.sin(line / strands * Math.PI);
        ctx.strokeStyle = line % 7 < 3 ? `rgba(211,245,134,${highlight})` : `rgba(233,236,225,${.2+highlight*.4})`;
        ctx.lineWidth = mobile ? .8 : .85 + Math.max(0,depth/(steps+1))*.12;
        ctx.beginPath();
        for (let j=0;j<=steps;j++) { if(j===0)ctx.moveTo(screen[0],screen[1]); else ctx.lineTo(screen[j*2],screen[j*2+1]); }
        ctx.stroke();
      }
    }
    function resize() {
      if (!node || !ctx || !host) return;
      width = host.clientWidth; height = host.clientHeight;
      const dpr = Math.min(devicePixelRatio || 1, mobile ? 1.5 : 2);
      node.width = Math.round(width*dpr); node.height = Math.round(height*dpr);
      ctx.setTransform(dpr,0,0,dpr,0,0); draw();
    }
    const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host);
    const intersection = new IntersectionObserver(([entry]) => { visible=entry.isIntersecting; }, { rootMargin:'100px' }); intersection.observe(host);
    const tick = (_time:number, delta:number) => { if (!visible || document.hidden || staticMode) return; time+=Math.min(delta,40)/1000; draw(); };
    if (!staticMode) gsap.ticker.add(tick);
    const context = gsap.context(() => {
      if (staticMode) return;
      gsap.to(pose,{scroll:1,ease:'none',scrollTrigger:{trigger:mode==='hero'?'.hero':'.motion-story',start:'top bottom',end:'bottom top',scrub:1}});
      if(mode==='story') gsap.to(pose,{phase:2,ease:'none',scrollTrigger:{trigger:'.motion-story',start:'top top',end:()=>`+=${innerHeight*1.8}`,scrub:.8,invalidateOnRefresh:true}});
    });
    const pointer=(event:PointerEvent)=>{
      if(staticMode || event.pointerType==='touch')return;
      const bounds=host.getBoundingClientRect();
      gsap.to(pose,{pointerX:(event.clientX-bounds.left)/bounds.width-.5,pointerY:(event.clientY-bounds.top)/bounds.height-.5,duration:.8,overwrite:'auto'});
    };
    host.addEventListener('pointermove',pointer,{passive:true});
    resize();
    return()=>{context.revert();gsap.killTweensOf(pose);gsap.ticker.remove(tick);resizeObserver.disconnect();intersection.disconnect();host.removeEventListener('pointermove',pointer);};
  },[mode,paused,reduced]);
  return <canvas ref={canvas} className={`generative-canvas ${className}`} aria-hidden="true"/>;
}

export function MotionStory() {
  return <section className="motion-story" aria-labelledby="motion-story-title">
    <div className="motion-stage shell">
      <div className="motion-stage-heading"><p className="eyebrow">A little code. A lot of character.</p><h2 id="motion-story-title">Ideas in <span>motion.</span></h2></div>
      <div className="motion-stage-visual"><GenerativeVisual mode="story"/></div>
      <div className="motion-chapters">
        <div className="motion-chapter"><span className="chapter-label">Imagine</span><h3>Start with<br/>a spark.</h3><p>A different perspective.<br/>An idea worth exploring.</p></div>
        <div className="motion-chapter"><span className="chapter-label">Make</span><h3>Give it<br/>a system.</h3><p>Design and development,<br/>working as one.</p></div>
        <div className="motion-chapter"><span className="chapter-label">Move</span><h3>Put it into<br/>the world.</h3><p>Built to connect.<br/>Ready to make an impact.</p></div>
      </div>
      <div className="motion-chapter-track" aria-hidden="true"><span>Imagine</span><span>Make</span><span>Move</span><i/></div>
    </div>
  </section>;
}
