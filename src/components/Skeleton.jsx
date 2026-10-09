// A pulsing grey block. Compose several of these to mimic the final layout.
export default function Skeleton({ className = '' }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-xl bg-haven-900/10 ${className}`} />;
}
