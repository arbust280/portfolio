import { motion } from 'framer-motion';

const base = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

/** Scroll-triggered reveal. `as` lets it wrap li/article/etc. */
export default function Reveal({ children, i = 0, as = 'div', className, ...rest }) {
  const M = motion[as] || motion.div;
  return (
    <M
      className={className}
      variants={base}
      custom={i}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      {...rest}
    >
      {children}
    </M>
  );
}
