import { useEffect, useRef, useState } from "react";

/**
 * Reimplements the original inline <script> on the Features page: counts up
 * from 0 to `target` over ~50 frames once the element scrolls into view,
 * using an IntersectionObserver exactly like the original.
 */
export default function AnimatedCounter({ target, className }) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const isDecimal = target % 1 !== 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                setValue(target);
                clearInterval(timer);
              } else {
                setValue(isDecimal ? Number(current.toFixed(1)) : Math.floor(current));
              }
            }, 30);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return (
    <span ref={ref} className={className}>
      {value}
      {isDecimal ? "%" : ""}
    </span>
  );
}
