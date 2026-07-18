import { Mail, GitBranch, Phone } from 'lucide-react';
import Reveal from './Reveal';

const LINKS = [
  { href: 'mailto:dinu.petre.andrei@gmail.com', label: 'Email', Icon: Mail },
  { href: 'https://github.com/arbust280', label: 'GitHub', Icon: GitBranch },
  { href: 'tel:+40752572760', label: 'Call', Icon: Phone },
];

export default function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-inner">
        {/* the recombined white line from LightSpine points here */}
        <Reveal as="h2" className="footer-cta">
          Let&rsquo;s build something
        </Reveal>

        <Reveal className="footer-contact" i={1}>
          {LINKS.map((link) => {
            const Icon = link.Icon;
            return (
              <a
                key={link.label}
                className="btn"
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
              >
                <Icon size={15} strokeWidth={1.9} aria-hidden />
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
          aethrex · Bucharest · {new Date().getFullYear()}
        </Reveal>
      </div>
    </footer>
  );
}
