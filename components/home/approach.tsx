import type { CSSProperties } from "react";

/* Draft principles, from the work on the about page (a company of his own, KPN, Miro): Laurens to
   rewrite in his own words. No dashes in the copy. */
const principles = [
  { title: "Start with the problem", text: "Time with the people who have it comes before anything gets built." },
  { title: "Ship small, learn early", text: "A rough version in real hands teaches more than a polished plan." },
  { title: "Numbers and conversations", text: "Data shows what is happening; talking to people shows why." },
  { title: "In the work, not above it", text: "Close to design and engineering, from the first sketch to the launch." },
];

/**
 * How Laurens works: four short principles side by side, each a title and a quieter sentence, in
 * the timeline's name and role styles. Four across on wide screens, two on tablets, one on phones.
 */
export function Approach() {
  return (
    <section aria-labelledby="approach-title" className="shell">
      <div className="section-head" data-reveal>
        <h2 id="approach-title" className="section-title">
          How I work
        </h2>
      </div>
      <ul className="approach">
        {principles.map((principle, i) => (
          <li key={principle.title} className="approach__item" data-reveal style={{ "--reveal-delay": `${i * 80}ms` } as CSSProperties}>
            <h3 className="approach__title">{principle.title}</h3>
            <p className="approach__text">{principle.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
