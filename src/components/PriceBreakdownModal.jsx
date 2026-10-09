import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { calculatePrice } from '../lib/pricing';
import { cancellationText, formatPKR, pluralize } from '../lib/formatters';
import { btnPrimary } from '../lib/ui';

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * "Price breakdown" transparency popup (CLAUDE.md section 7).
 * Render it only while it is open: {open && <PriceBreakdownModal ... onClose={...} />}
 *
 * Keyboard: focus moves into the dialog, Tab is trapped inside, Esc closes it,
 * and focus returns to the button that opened it.
 */
export default function PriceBreakdownModal({
  title = 'Price details',
  pricePerNight,
  nights,
  taxPercent,
  serviceFeePercent,
  freeCancellation,
  cancellationHours,
  onClose,
}) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = dialogRef.current?.querySelectorAll(FOCUSABLE);
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  const price = calculatePrice({ pricePerNight, nights, taxPercent, serviceFeePercent });

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/60 p-4 sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="max-h-full w-full max-w-md overflow-y-auto rounded-2xl border border-haven-900/10 bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-2xl font-semibold text-haven-900">
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close price details"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-ink-500 transition-colors hover:bg-haven-50 hover:text-haven-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <dl className="mt-4 space-y-3 text-base">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">
              {formatPKR(pricePerNight)} &times; {nights} {pluralize(nights, 'night')}
            </dt>
            <dd className="font-medium text-ink-900">{formatPKR(price.base)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">Taxes ({Number(taxPercent)}%)</dt>
            <dd className="font-medium text-ink-900">{formatPKR(price.tax)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-500">Service fee ({Number(serviceFeePercent)}%)</dt>
            <dd className="font-medium text-ink-900">{formatPKR(price.serviceFee)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-haven-900/10 pt-3 text-xl">
            <dt className="font-semibold text-haven-900">Total</dt>
            <dd className="font-semibold text-haven-900">{formatPKR(price.total)}</dd>
          </div>
        </dl>

        <p className="mt-4 rounded-xl bg-haven-50 p-4 text-sm text-ink-900">
          {cancellationText(freeCancellation, cancellationHours)}
        </p>
        <p className="mt-3 text-sm font-semibold text-haven-700">
          The price you see is the price you pay.
        </p>

        <button type="button" onClick={onClose} className={`${btnPrimary} mt-6 w-full`}>
          Got it
        </button>
      </div>
    </div>,
    document.body,
  );
}
