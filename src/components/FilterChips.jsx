// Cliquer sur l'option active la désactive
export default function FilterChips({ options, value, onChange }) {
  return (
    <div className="chips">
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={String(o.value)}
            type="button"
            className={`chip ${active ? 'active' : ''}`}
            onClick={() => onChange(active ? undefined : o.value)}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}