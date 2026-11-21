import { useEffect, useRef } from 'react';

// Fades a block up the first time it scrolls into view. CSS handles reduced motion.
export default function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in');
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`.trim()} style={{ '--reveal-delay': `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}
