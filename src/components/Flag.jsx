// Renders a country flag via flag-icons. `code` is an ISO 3166-1 alpha-2 code (e.g. 'TG').
export default function Flag({ code, squared = false, className = '' }) {
  if (!code) return null;
  return (
    <span
      className={`fi fi-${code.toLowerCase()} ${squared ? 'fis' : ''} ${className}`.trim()}
      aria-hidden="true"
    />
  );
}
