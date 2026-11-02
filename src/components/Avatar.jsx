const initials = (name = '') =>
  name.split(/\s+/).filter((w) => w.length > 1 || /[A-Z]/.test(w)).slice(0, 2)
    .map((w) => w[0]).join('').toUpperCase();

const hue = (name = '') => [...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);

export default function Avatar({ name, large }) {
  return (
    <div className={`avatar ${large ? 'lg' : ''}`}
      style={{ background: `hsl(${hue(name)} 65% 45%)` }}>
      {initials(name)}
    </div>
  );
}