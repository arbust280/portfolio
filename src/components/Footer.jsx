import { Mail, GitBranch, Phone, ArrowUpRight } from './icons';
import Reveal from './Reveal';

const LINKS = [
  { href: 'mailto:dinu.petre.andrei@gmail.com', label: 'Email', Icon: Mail },
  { href: 'https://github.com/arbust280', label: 'GitHub', Icon: GitBranch },
  { href: 'tel:+40752572760', label: 'Call', Icon: Phone },
  { href: 'https://dinu-cas.vercel.app/', label: 'CAS portfolio', Icon: ArrowUpRight },
];

export default function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-inner">
        {/* the recombined white line from LightSpine terminates here */}
        <Reveal as="h2" className="footer-cta">
          Let&rsquo;s build something
        </Reveal>

        <Reveal className="footer-contact" i={1}>
          {LINKS.map((link) => {
            const Icon = link.Icon;
            const external = link.href.startsWith('http');
            return (
              <a
                key={link.label}
                className="btn"
                href={link.href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
              >
                <Icon size={15} />
                {link.label}
              </a>
            );
          })}
        </Reveal>

        <Reveal as="blockquote" className="footer-quote" i={2}>
          &ldquo;There is no dark side of the moon really. Matter of fact, it&rsquo;s all dark.&rdquo;
          <cite>Gerry O&rsquo;Driscoll · Abbey Road, 1973</cite>
        </Reveal>

        <Reveal as="p" className="footer-copy" i={3}>
          dinu · Bucharest · {new Date().getFullYear()}
        </Reveal>
      </div>
    </footer>
  );
}
