import Band from './Band';
import Reveal from './Reveal';

/**
 * Recombination — the five wavelengths become white light again, so the
 * section takes no band colour of its own. Set as a single measure of
 * running text: this is the one place on the page to slow down.
 */
export default function Manifesto() {
  return (
    <Band
      id="ethos"
      band="white"
      lambda="recombination"
      name="Ethos"
      className="manifesto"
    >
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
          physical infrastructure and human-built interfaces to reach anyone. A model can&rsquo;t
          conceive an original need, design the thing that meets it, and ship it — a person
          must. That&rsquo;s why I don&rsquo;t want to only study computer science, or only physics.
          <strong> I want to hold both the vision and the means to build it.</strong>
        </Reveal>
        <Reveal as="p" i={4}>
          The rest I learned by leading: aligning people who don&rsquo;t agree, deciding with too
          little information and too little time, and shipping on Fridays anyway. Domain
          knowledge earns trust; how you communicate moves everyone forward. I like building,
          breaking, learning, and rebuilding — I&rsquo;m here to get better at all four.
        </Reveal>
      </div>
    </Band>
  );
}
