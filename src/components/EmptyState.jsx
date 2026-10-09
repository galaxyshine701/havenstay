import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { btnPrimary, cardClass } from '../lib/ui';

/**
 * Friendly "nothing here" message with one clear action.
 * Give either actionTo (a link) or onAction (a button handler).
 */
export default function EmptyState({
  icon: Icon = SearchX,
  title,
  message,
  actionLabel,
  actionTo,
  onAction,
}) {
  return (
    <div className={`${cardClass} p-8 text-center md:p-12`}>
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-haven-50">
        <Icon aria-hidden="true" className="h-6 w-6 text-haven-700" />
      </span>
      <h2 className="mt-4 text-xl font-semibold text-haven-900">{title}</h2>
      {message && <p className="mx-auto mt-2 max-w-md text-base text-ink-500">{message}</p>}

      {actionLabel && actionTo && (
        <Link to={actionTo} className={`${btnPrimary} mt-6`}>
          {actionLabel}
        </Link>
      )}
      {actionLabel && !actionTo && onAction && (
        <button type="button" onClick={onAction} className={`${btnPrimary} mt-6`}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
