// Shared Tailwind class strings, so buttons, inputs and cards look identical everywhere.

export const containerClass = 'mx-auto w-full max-w-6xl px-4 sm:px-6';

export const cardClass = 'rounded-2xl border border-haven-900/10 bg-white shadow-sm';

const buttonBase =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-6 text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

export const btnPrimary = `${buttonBase} bg-haven-900 text-white hover:bg-haven-700`;

export const btnSecondary = `${buttonBase} border border-haven-900/20 bg-white text-haven-900 hover:bg-haven-50`;

export const linkButton =
  'inline-flex min-h-[44px] items-center rounded text-sm font-semibold text-haven-700 underline underline-offset-4 hover:text-haven-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500';

// Props that connect a control to its inline error message (accessibility).
export const fieldProps = (id, error) => ({
  id,
  'aria-invalid': error ? 'true' : undefined,
  'aria-describedby': error ? `${id}-error` : undefined,
});

export const inputClass = (hasError) =>
  `min-h-[44px] w-full rounded-xl border bg-white px-4 text-base text-ink-900 placeholder:text-ink-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${
    hasError ? 'border-danger' : 'border-haven-900/20'
  }`;
