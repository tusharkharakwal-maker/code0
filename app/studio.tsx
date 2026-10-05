'use client';

import Image from 'next/image';
import { useRef, useState, type FormEvent } from 'react';
import { Plus, Menu, Code2, Shapes, Search, Check, Copy, Mail, Asterisk } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import MotionExperience from './motion-experience';
import { GenerativeVisual, MotionStory } from './motion-graphics';
import { MotionProvider, MotionToggle, useMotionSettings } from './motion-settings';

const email = 'tusharkharakwal@gmail.com';
const navigation = [['Work', 'work'], ['Services', 'services'], ['Studio', 'about'], ['Process', 'process']];
const services = [
  { title: 'Development', icon: Code2, subtitle: 'Beautiful on the surface. Powerful underneath.', description: 'Fast, intuitive digital experiences, built with the right foundations. From your first website to the systems that keep your business moving.', items: ['Website Development', '3D Websites', 'Full Backend Development', 'Login Page Development', 'Database Management'] },
  { title: 'Creative & Design', icon: Shapes, subtitle: 'A distinctive point of view. In every frame.', description: 'Visual identities, imagery, and motion that make people stop and pay attention. Made to feel like your brand, wherever it shows up.', items: ['Graphics Designing', 'Photo Editing', 'Video Editing', 'Video Creation'] },
  { title: 'Marketing & SEO', icon: Search, subtitle: 'Get found. Stay relevant. Keep growing.', description: 'Make your brand easier to discover across traditional search and AI-powered answers. Clear content, technical foundations, and a strategy shaped around your audience.', items: ['SEO', 'AI SEO'] },
];
const projects = [
  { name: 'Forma', line: 'Everyday care. Uncommon character.', category: 'Brand direction / Digital commerce', image: '/forma.webp', alt: 'Sculptural skincare products arranged on warm orange platforms', body: 'A visual concept for an independent skincare brand. Warm color, sculptural product photography, and a clean shopping journey bring everyday rituals into focus.', scope: ['Visual identity', 'Art direction', 'Ecommerce concept'], challenge: 'Give a considered skincare brand an expressive digital identity without getting in the way of the products.', approach: 'A warm, tactile palette meets crisp typography. Product stories lead into a direct, considered shopping experience.' },
  { name: 'Orbit Audio', line: 'Designed to tune everything else out.', category: 'Art direction / Web experience', image: '/orbit.webp', alt: 'Premium silver headphones photographed on a saturated blue studio surface', body: 'An exploratory digital direction for a premium audio brand. Bold product imagery, immersive storytelling, and considered motion put the listening experience first.', scope: ['Website concept', 'Product storytelling', 'Motion direction'], challenge: 'Make a physical listening experience feel tangible in a digital space.', approach: 'Oversized imagery and deliberate pacing give each product detail room to speak. A focused interface keeps discovery simple.' },
];
const process = [
  ['Discover', 'We ask the right questions. Your goals, your audience, and the opportunity ahead.'],
  ['Define', 'A clear brief, an agreed scope, and a direction everyone believes in.'],
  ['Design', 'We explore, prototype, and refine until the experience feels distinctly yours.'],
  ['Build', 'Thoughtful development turns the design into a fast, reliable digital experience.'],
  ['Launch', 'We check the details across devices, resolve the rough edges, and go live.'],
  ['Grow', 'We use feedback, search insights, and fresh creative to keep moving forward.'],
];

function ProjectEnquiry({ className = 'button', children = 'Start a project' }: { className?: string; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [prepared, setPrepared] = useState(false);
  const [mailto, setMailto] = useState('');
  const [copyState, setCopyState] = useState(false);
  const [brief, setBrief] = useState('');
  const [fields, setFields] = useState({name:'',email:'',brief:''});
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = `Hi Codies,\n\nI'm ${data.get('name')}.\nEmail: ${data.get('email')}\nInterested in: ${selected.join(', ') || 'Let’s figure it out together'}\n\nProject brief:\n${data.get('brief')}\n\nLooking forward to talking.`;
    const url = `mailto:${email}?subject=${encodeURIComponent(`Project enquiry from ${data.get('name')}`)}&body=${encodeURIComponent(body)}`;
    setBrief(body); setMailto(url); setPrepared(true);

  };
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild><button className={className}>{children}</button></DialogTrigger>
    <DialogContent className="enquiry-dialog" data-lenis-prevent>
      <DialogTitle className="dialog-title">Good things start<br/>with a conversation.</DialogTitle>
      <DialogDescription className="dialog-description">Tell us what you have in mind. We’ll help shape what comes next.</DialogDescription>
      {prepared ? <div className="enquiry-ready" role="status">
        <span className="ready-mark"><Check size={26}/></span><h3>Your brief is ready.</h3><p>Open your email draft to send it. Nothing has been sent automatically.</p>
        <a className="button" href={mailto}>Open email draft <Mail size={16}/></a>
        <button className="text-link" onClick={async () => { try { await navigator.clipboard.writeText(brief); setCopyState(true); } catch { setCopyState(false); } }}>{copyState ? 'Brief copied' : 'Copy project brief'}<Copy size={15}/></button>
        <p className="email-fallback">Send to <a href={`mailto:${email}`}>{email}</a></p>
        <button className="subtle-button" onClick={() => setPrepared(false)}>Edit your brief</button>
      </div> : <form onSubmit={submit} className="enquiry-form">
        <div className="form-grid"><label>Your name<input autoComplete="name" name="name" value={fields.name} onChange={e=>setFields({...fields,name:e.target.value})} required maxLength={100} placeholder="Alex Morgan"/></label><label>Email address<input autoComplete="email" type="email" name="email" value={fields.email} onChange={e=>setFields({...fields,email:e.target.value})} required maxLength={254} placeholder="you@company.com"/></label></div>
        <fieldset><legend>What can we help with?</legend><div className="service-choices">{services.map(s => <label key={s.title} className="choice"><Checkbox checked={selected.includes(s.title)} onCheckedChange={checked => setSelected(prev => checked ? [...prev,s.title] : prev.filter(t => t !== s.title))}/>{s.title}</label>)}</div></fieldset>
        <label>A little about your project<textarea name="brief" value={fields.brief} onChange={e=>setFields({...fields,brief:e.target.value})} required minLength={10} maxLength={3000} rows={4} placeholder="The idea, the challenge, the big ambition..."/></label>
        <div className="form-footer"><p>Prepare a draft to send in your email app.</p><button type="submit" className="button">Prepare enquiry</button></div>
      </form>}
    </DialogContent>
  </Dialog>;
}

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuDestination = useRef<string | null>(null);
  function followMenuLink(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    menuDestination.current = id;
    setMenuOpen(false);
  }
  function restoreMenuFocus(event: Event) {
    const id = menuDestination.current;
    if (!id) return;
    event.preventDefault();
    menuDestination.current = null;
    requestAnimationFrame(() => {
      const section = document.getElementById(id);
      if (!section) return;
      section.tabIndex = -1;
      section.focus({ preventScroll: true });
      section.scrollIntoView({ block: 'start' });
      history.replaceState(null, '', `#${id}`);
      section.addEventListener('blur', () => section.removeAttribute('tabindex'), { once: true });
    });
  }
  return <header className="header-wrap"><div className="site-header shell">
    <a className="brand" href="#top" aria-label="Codies home"><Image src="/codies-logo.svg" width={130} height={32} alt="Codies" priority /></a>
    <nav aria-label="Main navigation">{navigation.map(([label,id]) => <a key={id} href={`#${id}`}><span>{label}</span></a>)}</nav>
    <div className="header-actions"><MotionToggle/><ProjectEnquiry className="button button-small"/>
      <Dialog open={menuOpen} onOpenChange={setMenuOpen}><DialogTrigger asChild><button className="menu-toggle" aria-label="Open navigation"><Menu size={23}/></button></DialogTrigger>
        <DialogContent className="mobile-navigation" data-lenis-prevent onCloseAutoFocus={restoreMenuFocus}><DialogTitle className="sr-only">Navigation</DialogTitle><DialogDescription className="sr-only">Explore Codies studio</DialogDescription><Image src="/codies-logo.svg" width={125} height={30} alt="Codies"/>
          <nav aria-label="Mobile navigation">{navigation.map(([label,id],i) => <a href={`#${id}`} key={id} onClick={event => followMenuLink(event, id)}><span>0{i+1}</span>{label}</a>)}<a href="#contact" onClick={event => followMenuLink(event, 'contact')}><span>05</span>Contact</a></nav>
          <a className="mobile-email" href={`mailto:${email}`}>{email}</a>
        </DialogContent>
      </Dialog>
    </div>
  </div></header>;
}

function ProjectCard({ project, index }: { project: typeof projects[number]; index: number }) {
  return <Dialog>
    <article className={`project project-${index}`}>
      <div className="project-frame"><DialogTrigger asChild><button className="project-button" aria-label={`Explore ${project.name} concept`}>
        <div className="project-copy"><p className="project-category">{project.category}</p><h3>{project.name}</h3><p className="project-caption">{project.line}</p><span className="project-explore">Explore concept <Plus size={20}/></span></div>
        <div className="project-image"><Image src={project.image} alt={project.alt} width={1200} height={900} sizes="(max-width: 767px) 100vw, 65vw"/></div>
      </button></DialogTrigger></div>
    </article>
    <DialogContent className="project-dialog" data-lenis-prevent><Image src={project.image} alt={project.alt} width={1200} height={900}/><div className="project-dialog-copy"><p className="eyebrow">Independent concept</p><DialogTitle className="dialog-title">{project.name}</DialogTitle><DialogDescription className="dialog-description">{project.body}</DialogDescription><div className="project-detail-grid"><div><h4>The challenge</h4><p>{project.challenge}</p></div><div><h4>The direction</h4><p>{project.approach}</p></div></div><div className="tags">{project.scope.map(s => <span key={s}>{s}</span>)}</div><p className="concept-note">A self-initiated exploration of what’s possible. This is concept work, not a client commission.</p></div></DialogContent>
  </Dialog>;
}

function KineticText({text}:{text:string}) {
  return <>{text.split(' ').map((word,index)=><span className="kinetic-word" key={`${word}-${index}`}>{index>0 && <span className="glyph-space"> </span>}{[...word].map((letter,i)=><span className="glyph" key={i}>{letter}</span>)}</span>)}</>;
}
function Lines({lines,className=''}:{lines:string[];className?:string}) {
  return <h2 className={className} data-reveal-lines>{lines.map(line=><span className="line-mask" key={line}><span className="line-inner">{line}</span></span>)}</h2>;
}
export default function Codies() { return <MotionProvider><Studio/></MotionProvider>; }

function Studio() {
  const {paused,reduced}=useMotionSettings();
  return <div className={`codies-site ${paused || reduced ? "motion-disabled" : ""}`}>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div id="top"/>
    <Navigation/>
    <main id="main-content">
      <section className="hero shell" aria-labelledby="hero-title">
        <div className="hero-top"><p className="eyebrow">Independent digital studio</p><span className="hero-discipline">Development / Design / Growth</span></div>
        <div className="hero-visual"><GenerativeVisual/><div className="visual-caption" aria-hidden="true">Ideas, taking shape.</div></div>
        <h1 id="hero-title" className="hero-title" aria-label="Digital. With impact."><span className="hero-title-line" aria-hidden="true"><KineticText text="Digital."/></span><span className="hero-title-line" aria-hidden="true"><KineticText text="With impact."/></span></h1>
        <div className="hero-bottom"><p>We bring ambitious brands to life.<br/>Through code, creativity, and a little audacity.</p><a href="#work" className="text-link">Explore our work <Plus size={18}/></a></div>
      </section>
      <div className="discipline-band" aria-label="Design, develop, create, grow"><span>Design</span><Asterisk aria-hidden="true"/><span>Develop</span><Asterisk aria-hidden="true"/><span>Create</span><Asterisk aria-hidden="true"/><span>Grow</span></div>
      <section id="work" className="work section shell">
        <div className="work-heading"><p className="eyebrow">Selected explorations</p><Lines lines={["Good ideas.","Great execution."]}/><p className="section-description">Independent concepts exploring the intersection of brand, design, and technology.</p></div>
        <div className="project-stack">{projects.map((p,i)=><ProjectCard key={p.name} project={p} index={i}/>)}</div>
      </section>
      <section id="about" className="about section shell"><div className="about-head"><p className="eyebrow">The Codies mindset</p><Asterisk className="about-asterisk" size={54} strokeWidth={1}/></div><h2 className="manifesto">{['Big','on','ideas.','Obsessed','with','the','details.'].map((word,i)=><span className={`manifesto-word ${i>3?'accent':''}`} key={word}>{word}{' '}</span>)}</h2><div className="about-bottom"><div className="studio-facts"><div><strong>11</strong><span>Specialist services</span></div><div><strong>03</strong><span>Connected disciplines</span></div></div><div className="about-copy reveal"><p>We’re a creative development studio connecting what your brand says with what it can do.</p><p>From the first sketch to the final line of code, we bring design, development, and growth into one conversation. Less back and forth. More moving forward.</p></div></div></section>
      <section id="services" className="services section shell"><div className="services-heading"><Lines lines={["From the first pixel","to the next big thing."]}/><p className="section-description">Everything your digital presence needs. Thoughtfully connected.</p></div>
        <Accordion type="single" collapsible defaultValue="Development" className="services-list">{services.map((s,i)=><AccordionItem className="service-row" value={s.title} key={s.title}><AccordionTrigger className="service-trigger"><span className="service-number">0{i+1}</span><span className="service-title">{s.title}<span>{s.subtitle}</span></span><span className="service-sign" aria-hidden="true"><Plus size={24}/></span></AccordionTrigger><AccordionContent className="service-content"><div className="service-description"><s.icon size={31} strokeWidth={1.25}/><p>{s.description}</p></div><ul>{s.items.map(item=><li key={item}>{item}<span aria-hidden="true">+</span></li>)}</ul></AccordionContent></AccordionItem>)}</Accordion>
      </section>
      <MotionStory/>
      <section id="process" className="process section shell"><div className="process-intro"><p className="eyebrow">Good work takes a good process</p><Lines lines={["Clear direction.","At every step."]}/><div className="process-orbit" aria-hidden="true"><span/><span/><span/><Asterisk size={36} strokeWidth={1}/></div><p className="section-description">You bring the ambition. We bring a plan to make it happen, with you in the loop from day one.</p></div><div className="process-list-wrap"><span className="process-path" aria-hidden="true"/><ol className="process-list">{process.map(([title,body],i)=><li key={title} className="process-step"><span className="process-number">0{i+1}</span><div className="process-step-copy"><h3>{title}</h3><p>{body}</p></div></li>)}</ol></div></section>
      <section className="faq section shell"><Lines lines={["A few things you","might be wondering."]}/><Accordion type="single" collapsible className="faq-list"><AccordionItem value="scope"><AccordionTrigger>Can you take care of the whole project?</AccordionTrigger><AccordionContent>Yes. We can bring development, creative design, and search strategy together, or work on one specific part alongside your existing team. We agree on the scope before starting.</AccordionContent></AccordionItem><AccordionItem value="timing"><AccordionTrigger>How long does a project take?</AccordionTrigger><AccordionContent>It depends on the scope, content, and technical requirements. Once we understand your brief, we’ll outline the milestones and a realistic timeline before you commit.</AccordionContent></AccordionItem><AccordionItem value="start"><AccordionTrigger>What do you need to get started?</AccordionTrigger><AccordionContent>A little context goes a long way: what you’re building, who it’s for, and what you want to achieve. Bring any brand assets or references you have. We’ll work through the rest together.</AccordionContent></AccordionItem></Accordion></section>
      <section id="contact" className="contact section shell"><p className="eyebrow reveal">Your next chapter starts here</p><h2 className="contact-title" aria-label="Let’s make an impact."><span aria-hidden="true"><KineticText text="Let’s make"/></span><span aria-hidden="true"><KineticText text="an impact."/></span></h2><div className="contact-bottom reveal"><p>Tell us what you’re thinking.<br/>Let’s make something worth putting out there.</p><ProjectEnquiry className="button button-large">Let’s make it happen <Plus size={21}/></ProjectEnquiry></div></section>
    </main>
    <footer className="footer shell"><div className="footer-top"><a className="footer-email" href={`mailto:${email}`}>{email}</a><a href="#top" className="text-link">Back to top <Plus size={15}/></a></div><a href="#top" aria-label="Codies home" className="footer-wordmark"><Image src="/codies-logo.svg" alt="Codies" width={1330} height={320} sizes="100vw"/></a><div className="footer-bottom"><p>© {new Date().getFullYear()} Codies. Built with intent.</p><nav aria-label="Footer navigation">{navigation.slice(0,3).map(([label,id])=><a key={id} href={`#${id}`}>{label}</a>)}<a href="#contact">Contact</a></nav><span>Code. Create. Connect.</span></div></footer>
    <MotionExperience/>
  </div>;
}
