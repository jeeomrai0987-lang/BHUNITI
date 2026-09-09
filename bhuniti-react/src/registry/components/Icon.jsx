/**
 * Material Symbols Outlined helper. Replaces the repeated
 * `<span class="material-symbols-outlined">name</span>` markup.
 *
 * `fill` maps to the original inline `style="font-variation-settings: 'FILL' 1;"`.
 */
export default function Icon({ name, className = '', fill = false, style, ...rest }) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined ${className}`.trim()}
      style={fill ? { fontVariationSettings: "'FILL' 1", ...style } : style}
      {...rest}
    >
      {name}
    </span>
  )
}
