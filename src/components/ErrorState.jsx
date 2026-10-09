import { TriangleAlert } from 'lucide-react';
import { btnPrimary, cardClass } from '../lib/ui';

// Readable error message plus a "Try again" button.
export default function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load this right now. Please check your connection and try again.',
  onRetry,
}) {
  return (
    <div role="alert" className={`${cardClass} p-8 text-center md:p-12`}>
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-haven-50">
        <TriangleAlert aria-hidden="true" className="h-6 w-6 text-danger" />
      </span>
      <h2 className="mt-4 text-xl font-semibold text-haven-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-base text-ink-500">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className={`${btnPrimary} mt-6`}>
          Try again
        </button>
      )}
    </div>
  );
}
