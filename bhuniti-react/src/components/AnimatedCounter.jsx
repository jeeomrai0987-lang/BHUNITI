import { useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n";

/**
 * Reimplements the original inline <script> on the Features page: counts up
 * from 0 to `target` over ~50 frames once the element scrolls into view,
 * using an IntersectionObserver exactly like the original.
 *
 * The number itself goes through formatNumber, so a large target is grouped the
 * Indian way in both languages. `suffix` is a plain string rather than a catalog
 * key so the caller can pass a unit it already translated.
 *
 * @param {number} target the value to count up to
 * @param {string} [suffix] appended once the digits are rendered, e.g. "%"
 * @param {string} [className]
 * @param {string} [label] accessible description of what is being counted
 */
export default function AnimatedCounter({ target, suffix, className, label }) {
  const { formatNumber } = useI18n();
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

  const digits = formatNumber(
    value,
    isDecimal ? { minimumFractionDigits: 1, maximumFractionDigits: 1 } : undefined
  );

  return (
    <span
      ref={ref}
      className={className}
      // The count-up animation would otherwise be read out on every tick.
      aria-label={label ? `${digits}${suffix || ""} ${label}` : undefined}
      aria-live="off"
    >
      {digits}
      {suffix || ""}
    </span>
  );
}
