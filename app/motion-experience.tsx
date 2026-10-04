'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export default function MotionExperience() {
  const cursor = useRef<HTMLDivElement>(null);
  const loader = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      let seen = false;
      try { seen = sessionStorage.getItem('codies-intro') === 'seen'; sessionStorage.setItem('codies-intro','seen'); } catch { /* Storage can be disabled; animation remains optional. */ }
      const intro = gsap.timeline();
      if (!seen && loader.current) {
        gsap.set(loader.current,{visibility:'visible'});
        const progress={value:0};
        intro.to(progress,{value:100,duration:1.0,ease:'power2.inOut',onUpdate:()=>{if(counter.current)counter.current.textContent=String(Math.round(progress.value)).padStart(2,'0');}})
          .to(loader.current,{yPercent:-100,duration:.7,ease:'power4.inOut'})
          .set(loader.current,{visibility:'hidden'});
      }
      intro.from('.hero-line',{yPercent:110,duration:1.1,stagger:.12,ease:'power4.out'},seen?0:'-=.4')
        .from('.hero-art',{opacity:0,scale:1.07,duration:1.5,ease:'power2.out'},'<')
        .from('.hero-bottom',{opacity:0,y:16,duration:.7},'-=.9');
      const lenis = new Lenis({duration:1.05,smoothWheel:true,anchors:true,prevent:node=>node.hasAttribute('data-lenis-prevent')});
      lenis.on('scroll', ScrollTrigger.update);
      const tick=(time:number)=>lenis.raf(time*1000);
      gsap.ticker.add(tick);
      gsap.utils.toArray<HTMLElement>('.reveal').forEach(el=>gsap.from(el,{y:38,opacity:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 94%',once:true}}));
      gsap.fromTo('.word-reveal span',{color:'#5a5d53'},{color:'#d0f475',scrollTrigger:{trigger:'.about',start:'top 75%',end:'center 55%',scrub:true}});
      const desktop = gsap.matchMedia();
      desktop.add('(min-width: 1024px)',()=>{
        gsap.to('.hero-art',{y:80,rotate:5,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
        gsap.to('.project-1',{y:-60,ease:'none',scrollTrigger:{trigger:'.projects-grid',start:'top 85%',end:'bottom 25%',scrub:1}});
      });
      return ()=>{desktop.revert();lenis.destroy();gsap.ticker.remove(tick);};
    });
    mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)',()=>{
      const node=cursor.current;
      if(!node)return;
      const xTo=gsap.quickTo(node,'x',{duration:.2,ease:'power3'});
      const yTo=gsap.quickTo(node,'y',{duration:.2,ease:'power3'});
      const move=(e:PointerEvent)=>{const target=(e.target as HTMLElement).closest('[data-cursor]') as HTMLElement|null;node.textContent=target?.dataset.cursor||'';node.classList.toggle('is-active',!!target);xTo(e.clientX);yTo(e.clientY);};
      const leave=()=>node.classList.remove('is-active');
      window.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerleave',leave);
      return()=>{window.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',leave);};
    });
    return()=>mm.revert();
  },[]);
  return <><div className="project-cursor" ref={cursor} aria-hidden="true"/><div className="intro-loader" ref={loader} aria-hidden="true"><span>CODIES</span><div><p>IDEAS INTO IMPACT.</p><span ref={counter}>00</span></div></div></>;
}
