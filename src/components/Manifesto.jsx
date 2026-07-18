import Reveal from './Reveal';

export default function Manifesto() {
  return (
    <section className="band manifesto" id="ethos" style={{ '--band': '#e8e8f2' }}>
      <Reveal className="band-label">
        <span className="band-lambda">recombination</span>
        <h2 className="band-name">Ethos</h2>
        <span className="band-rule" />
      </Reveal>

      <Reveal as="p" i={1} className="manifesto-title">
        Engineering is the discipline that translates
      </Reveal>

      <div className="manifesto-body">
        <Reveal as="p" i={2}>
          Somewhere in a thermodynamics problem I noticed every subject I study is quietly
          connected — physics leans on chemistry, maths describes physics, even English
          teaches you to reason about a problem. That pushed me toward the field that sits at
          the intersection of all of them: it takes an abstract law, an algorithm, a model,
          and <strong>turns it into something the world can actually use</strong>.
        </Reveal>
        <Reveal as="p" i={3}>
          Working on LinkerFlow made it concrete. Even the most powerful model still depends on
          physical infrastructure and human-built interfaces to reach anyone. A model can't
          conceive an original need, design the thing that meets it, and ship it — a person
          must. That's why I don't want to only study computer science, or only physics.
          <strong> I want to hold both the vision and the means to build it.</strong>
        </Reveal>
        <Reveal as="p" i={4}>
          The rest I learned by leading: aligning people who don't agree, deciding with too
          little information and too little time, and shipping on Fridays anyway. Domain
          knowledge earns trust; how you communicate moves everyone forward. I like building,
          breaking, learning, and rebuilding — I'm here to get better at all four.
        </Reveal>
      </div>
    </section>
  );
}
