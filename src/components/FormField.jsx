// Visible label + control + inline error. Used by the booking form and the auth form.
// The control must use the same `id`, and should spread fieldProps(id, error) from
// lib/ui.js so screen readers announce the error.
export default function FormField({ id, label, error, optional = false, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-ink-900">
        {label}
        {optional && <span className="ml-1 font-normal text-ink-500">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
