import { SearchX } from 'lucide-react';

export default function EmptyState({ title, text, action }) {
  return (
    <div className="empty">
      <SearchX size={40} />
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}