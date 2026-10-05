'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useMotionSettings } from './motion-settings';

gsap.registerPlugin(ScrollTrigger);

export default function MotionExperience() {
  const { paused, reduced } = useMotionSettings();
  useEffect(() => {
    const mm = gsap.matchMedia();
    if (paused || reduced) return;
    const root = document.querySelector('.codies-site');
    if (!root) return;
    const select = (selector:string) => Array.from(root.querySelectorAll<HTMLElement>(selector));
    mm.add({ motion:'(prefers-reduced-motion: no-preference)', desktop:'(min-width: 1024px)', fine:'(pointer: fine)' }, context => {
      if(!context.conditions?.motion) return;
      const {desktop,fine}=context.conditions;
      const disposers:Array<()=>void>=[];
      // Entrance establishes hierarchy immediately, without a blocking loader.
      gsap.timeline({defaults:{ease:'power4.out'}})
        .from(select('.hero-title .glyph'),{yPercent:115,rotate:8,opacity:0,duration:1.05,stagger:.025},.08)
        .from(select('.hero-visual'),{scale:.74,rotate:-18,opacity:0,duration:1.6},.12)
        .from(select('.hero-bottom > *'),{y:22,opacity:0,duration:.8,stagger:.1},.55);
      // Desktop gets a gentle smooth wheel. Touch scrolling stays native.
      if(desktop && fine){
        const lenis=new Lenis({duration:.8,anchors:{offset:-96},prevent:node=>node.hasAttribute('data-lenis-prevent')});
        lenis.on('scroll',ScrollTrigger.update);
        const tick=(time:number)=>lenis.raf(time*1000);gsap.ticker.add(tick);
        disposers.push(()=>{gsap.ticker.remove(tick);lenis.destroy();});
      }
      gsap.to(select('.hero-title'),{y:desktop?-65:-20,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
      gsap.to(select('.hero-visual'),{y:desktop?110:25,rotation:12,scale:.88,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:1}});
      // Typography masks reveal each statement in readable units.
      select('[data-reveal-lines]').forEach((el:HTMLElement)=>{
        gsap.from(el.querySelectorAll('.line-inner'),{yPercent:105,rotate:2,duration:.95,stagger:.09,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}});
      });
      select('.reveal').forEach((el:HTMLElement)=>gsap.from(el,{y:26,opacity:0,duration:.7,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 93%',once:true}}));
      // Projects expand from inset framing and reveal image detail as they enter.
      select('.project-image').forEach((el:HTMLElement)=>{
        gsap.from(el,{clipPath:desktop?'inset(10% 7% 10% 7%)':'inset(5% 0% 5% 0%)',ease:'none',scrollTrigger:{trigger:el,start:'top 95%',end:'top 22%',scrub:.7}});
        gsap.fromTo(el.querySelector('img'),{scale:1.16,yPercent:4},{scale:1,yPercent:-3,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:.8}});
      });
      if(desktop){
        const cards=select('.project');
        cards.slice(0,-1).forEach((card:HTMLElement,i:number)=>{
          ScrollTrigger.create({trigger:card,start:'top top',endTrigger:cards[cards.length-1],end:'top top',pin:true,pinSpacing:false});
          gsap.to(card.querySelector('.project-frame'),{scale:.93,opacity:.4,ease:'none',scrollTrigger:{trigger:cards[i+1],start:'top bottom',end:'top top',scrub:true}});
        });
      }
      const words=select('.manifesto-word');
      gsap.fromTo(words,{opacity:.17},{opacity:1,stagger:.12,ease:'none',scrollTrigger:{trigger:'.manifesto',start:'top 80%',end:'bottom 48%',scrub:.7}});
      // Pin one concise three-part film. Every chapter is controlled by scroll.
      const chapters=select('.motion-chapter');
      if(desktop){
        gsap.set(chapters.slice(1),{autoAlpha:0,y:45});
        const story=gsap.timeline({scrollTrigger:{trigger:'.motion-story',start:'top top',end:()=>`+=${innerHeight*1.8}`,pin:'.motion-stage',scrub:.7,invalidateOnRefresh:true}});
        story.to(chapters[0],{autoAlpha:0,y:-40,duration:.25},.6)
          .to(chapters[1],{autoAlpha:1,y:0,duration:.35},.75)
          .to(chapters[1],{autoAlpha:0,y:-40,duration:.25},1.45)
          .to(chapters[2],{autoAlpha:1,y:0,duration:.35},1.6)
          .to(select('.motion-chapter-track i'),{scaleX:1,duration:2.1,ease:'none'},0);
      }else{
        chapters.forEach((el:HTMLElement)=>gsap.from(el,{y:30,opacity:.2,duration:.7,scrollTrigger:{trigger:el,start:'top 90%',end:'top 58%',scrub:.5}}));
      }
      // Process steps build a single connected path rather than six repeated fades.
      gsap.from(select('.process-path'),{scaleY:0,transformOrigin:'top',ease:'none',scrollTrigger:{trigger:'.process-list',start:'top 70%',end:'bottom 70%',scrub:.4}});
      gsap.to(select('.process-orbit'),{rotation:360,ease:'none',scrollTrigger:{trigger:'.process-list',start:'top 70%',end:'bottom 70%',scrub:.6}});
      select('.process-step').forEach((el:HTMLElement)=>{
        ScrollTrigger.create({trigger:el,start:'top 70%',end:'bottom 45%',toggleClass:'is-current'});
        gsap.from(el.querySelector('.process-step-copy'),{x:desktop?34:16,opacity:.35,duration:.65,scrollTrigger:{trigger:el,start:'top 86%',once:true}});
      });
      gsap.from(select('.contact-title .glyph'),{yPercent:110,rotate:6,stagger:.02,duration:.9,ease:'power4.out',scrollTrigger:{trigger:'.contact',start:'top 78%',once:true}});
      gsap.from(select('.footer-wordmark img'),{yPercent:38,ease:'none',scrollTrigger:{trigger:'.footer-wordmark',start:'top bottom',end:'bottom bottom',scrub:1}});
      // Layout changes from accordions must update every later scroll boundary.
      const refresh=gsap.delayedCall(.2,()=>ScrollTrigger.refresh()).pause();
      const resizeObserver=new ResizeObserver(()=>refresh.restart(true));
      const services=document.querySelector('.services-list');
      const faq=document.querySelector('.faq-list');
      if(services)resizeObserver.observe(services);if(faq)resizeObserver.observe(faq);
      let alive=true;
      document.fonts.ready.then(()=>{if(alive)ScrollTrigger.refresh();});
      ScrollTrigger.refresh();
      return()=>{alive=false;refresh.kill();resizeObserver.disconnect();disposers.forEach(dispose=>dispose());};
    }, root);
    return()=>mm.revert();
  },[paused,reduced]);
  return null;
}
