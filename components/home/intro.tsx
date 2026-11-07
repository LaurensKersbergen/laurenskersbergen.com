import Image from "next/image";
import type { CSSProperties } from "react";

function Company({ href, logo, name, index }: { href: string; logo: string; name: string; index: number }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="intro__company">
      <span className="intro__slot" style={{ "--j": index } as CSSProperties}>
        <span className="intro__slot-inner">
          <Image src={logo} alt="" width={64} height={64} className="intro__logo" priority />
        </span>
      </span>
      <span className="intro__name">{name}</span>
    </a>
  );
}

/* Each word in a plain inline span (it lays out and reads exactly like the text), so the check
   below can break the line before any word without changing the page's structure. */
function Words({ text }: { text: string }) {
  return text.split(/(\s+)/).map((part, i) => (/\s/.test(part) || !part ? part : <span key={i} className="intro__w">{part}</span>));
}

/*
 * Runs as the page is parsed, before the first paint, so opening the logo slots never moves a word
 * to another line. The headline wraps rather than breaking by hand, so it lays the line
 * out with the slots open, notes which word (or company) starts each line, and breaks the closed
 * layout before those same ones: every line is then the open layout's line, only
 * shorter while the slots are closed, and opening them can't push anything down. It checks the
 * result; if anything would still move, <html data-intro-held> starts the slots open and only the
 * logos bloom. The breaks equal the open layout at this width, so they come out once the logos
 * have landed (or on a resize), and the line wraps freely again. They live in a <style> of their
 * own in <head>, never as attributes on the words, so React's hydration finds its markup as it
 * left it.
 */
const keepLinesStill = `(function(){var h=document.currentScript&&document.currentScript.previousElementSibling;if(!h||!h.classList.contains('intro'))return;var line=h.querySelector('.intro__muted');if(!line)return;var kids=[].slice.call(line.children);function top(e){return Math.round(e.getBoundingClientRect().top)}function tops(state){h.setAttribute('data-measure',state);return kids.map(top)}var open=tops('open');if(open.join()!==tops('closed').join()){var css='';kids.forEach(function(e,i){if(i&&open[i]>open[i-1]+2)css+='.intro__muted>:nth-child('+(i+1)+')::before{content:"\\\\A";white-space:pre}'});var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);function clear(){st.remove()}var o=tops('open').join(),c=tops('closed').join();if(o!==c||o!==open.join()){clear();document.documentElement.setAttribute('data-intro-held','')}else{setTimeout(clear,2400);addEventListener('resize',clear,{once:true})}}h.removeAttribute('data-measure')})()`;

/**
 * Who Laurens is in two lines, the second quieter, with the headline's own motion: the words
 * are there from the first frame and hold still; after 1.4s each company's slot opens from a word
 * space and its logo blooms into it (site.css). The slot is the space between "at" and the name,
 * so there is no space character around it.
 */
export function Intro() {
  return (
    <section aria-label="Introduction" className="shell">
      <h1 className="intro">
        <span className="intro__line">Laurens Kersbergen, product manager in Amsterdam.</span>{" "}
        <span className="intro__line intro__muted">
          <Words text="Databases and AI at" />
          <Company href="https://miro.com/" logo="/logos/miro.png" name="Miro" index={0} />
          <Words text=". Before that, growth at" />
          <Company href="https://www.kpn.com/" logo="/logos/kpn.png" name="KPN" index={1} />
          <Words text=" and a company of my own." />
        </span>
      </h1>
      <script dangerouslySetInnerHTML={{ __html: keepLinesStill }} />
    </section>
  );
}
