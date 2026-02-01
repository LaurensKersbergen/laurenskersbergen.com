import Link from "next/link";

export default function Home() {
  return (
    <div className="mt-16">
      <h1 className="text-xl md:text-2xl font-medium mb-1" style={{ lineHeight: "3.25rem" }}>Laurens Kersbergen</h1>
      <p className="my-5" style={{ color: "var(--text-copy)" }}>
        {"I'm a product manager in Amsterdam, currently working at "}
        <a href="https://miro.com/" target="_blank" rel="noopener noreferrer">Miro</a>
        {" on databases and AI for visual collaboration."}
      </p>
      <p className="my-5" style={{ color: "var(--text-copy)" }}>
        {"Before Miro, I founded a B2B SaaS company where I learned to build products with extreme constraints and no playbook. After that, I scaled products to millions of users at "}
        <a href="https://www.kpn.com/" target="_blank" rel="noopener noreferrer">KPN</a>
        {", learning how to ship at enterprise quality. That combination of 0\u21921 founder speed and enterprise scale discipline shapes how I work today."}
      </p>
      <p className="my-5" style={{ color: "var(--text-copy)" }}>
        {"As a product manager, I get energy from solving technically complex problems that create simple user experiences. I believe in the importance of craft, sweating the details that make products feel right, while moving fast enough to learn. I thrive on small, convicted teams that move fast and think big. I'm currently interested in how AI changes collaboration tools, how structure enables creativity instead of constraining it, and how products can feel both powerful and approachable."}
      </p>
      <p className="my-5" style={{ color: "var(--text-copy)" }}>
        {"I live in Amsterdam with my partner, our two-year-old daughter, and our cat Dries. In my free time, you can find me doing CrossFit, competing in HYROX races, or cooking for friends (I've gone deep on technique, probably semi-professional at this point). I'm also down the barista rabbit hole, pulling god-shot double espressos every morning. On weekends, I game with friends (recently Arc Raiders), tinker with side projects (just built a hyper-personalized meal planning app), or ski in the Alps if it's winter. I'm a bit of a biohacker and always have a book or podcast going about product, health, or productivity."}
      </p>
      <p className="my-5" style={{ color: "var(--text-copy)" }}>
        You can <Link href="/writing">read my writing</Link>,{" "}
        <a href="https://linkedin.com/in/lvkersbergen" target="_blank" rel="noopener noreferrer">follow me online</a>,{" "}
        {"or "}
        <a href="mailto:hey@laurenskersbergen.com">reach out</a>
        {" if you want to discuss product opportunities, collaboration tools, or 0\u21921 development."}
      </p>
    </div>
  );
}
