export default function TouroMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 27" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="12" cy="24.2" rx="7" ry="1.7" fill="#0f9f75" opacity="0.22" />
      <path
        d="M12 1C7.58 1 4 4.58 4 9c0 5.7 6.4 13 7.28 13.98a.98.98 0 0 0 1.44 0C13.6 22 20 14.7 20 9c0-4.42-3.58-8-8-8Z"
        fill="url(#touro-mark-grad)"
      />
      <path d="M8 6.6h8v1.9h-2.9V15h-2.2V8.5H8V6.6Z" fill="#fff" />
      <defs>
        <linearGradient id="touro-mark-grad" x1="4" y1="1" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22c55e" />
          <stop offset="1" stopColor="#0e7a4d" />
        </linearGradient>
      </defs>
    </svg>
  );
}
