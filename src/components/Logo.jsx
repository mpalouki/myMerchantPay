export default function Logo({ variant = 'color', size = 26 }) {
  const color = variant === 'white' ? '#ffffff' : '#1e88e5';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif",
        fontWeight: 700,
        fontSize: size,
        color,
        letterSpacing: '-0.5px',
      }}
    >
      merchant<span style={{ fontWeight: 400 }}>pay</span>
    </span>
  );
}
