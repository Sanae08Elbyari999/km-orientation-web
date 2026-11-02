export default function Skeleton({ count = 6 }) {
  return (
    <div className="grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card">
          <div className="sk sk-title" />
          <div className="sk sk-line" />
          <div className="sk sk-line short" />
        </div>
      ))}
    </div>
  );
}