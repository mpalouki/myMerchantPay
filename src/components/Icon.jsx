const PATHS = {
  dashboard: 'M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6V11h-6v9zm0-16v5h6V4h-6z',
  shop: 'M4 4h16l-1.5 6a2 2 0 0 1-2 1.6H7.5a2 2 0 0 1-2-1.6L4 4zm0 0-1 0M6 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM7 10.6 8 21h8l1-10.4',
  send: 'M2 12l19-9-9 19-2-8-8-2z',
  request: 'M9 5l7 7-7 7M4 12h12',
  collect: 'M3 7h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7zm0 0 2-3h14l2 3M12 12v4m-2-2h4',
  disburse: 'M3 17h18M3 17l4-4M3 17l4 4M21 7H3M21 7l-4-4M21 7l-4 4',
  qr: 'M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 2h2v2h-2v-2zm4 0h2v4h-4v-2h2v-2zm-4 4h2',
  api: 'M14.7 3.3a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4l-1.6 1.6-6-6 1.6-1.6zM13 4.7l6 6-8.3 8.3a2 2 0 0 1-.9.5l-4 1 1-4a2 2 0 0 1 .5-.9L13 4.7z',
  roles: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-3.3 0-6 1.6-6 3.6V19h12v-2.4c0-2-2.7-3.6-6-3.6zm8-5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm1.2 2.4a5.6 5.6 0 0 1 2.8 3.3V16h-3',
  withdraw: 'M12 2v4m0 0a6 6 0 0 1 6 6c0 4-6 10-6 10S6 16 6 12a6 6 0 0 1 6-6z',
  plus: 'M12 5v14M5 12h14',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm0-11v6m0-9.5v.5',
  edit: 'M4 20h4L19 9l-4-4L4 16v4zm9-13 4 4',
  trash: 'M4 7h16M10 11v6m4-6v6M9 7V4h6v3M6 7l1 13h10l1-13',
  close: 'M6 6l12 12M18 6 6 18',
  book: 'M4 19.5V5a2 2 0 0 1 2-2h14v15H6.5a2.5 2.5 0 0 0 0 5H20M8 7h8',
  settings:
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.4-3a7.4 7.4 0 0 0-.1-1.3l2-1.6-2-3.4-2.4 1a7.5 7.5 0 0 0-2.2-1.3L14.3 3h-4l-.4 2.4a7.5 7.5 0 0 0-2.2 1.3l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.6l-2 1.6 2 3.4 2.4-1a7.5 7.5 0 0 0 2.2 1.3l.4 2.4h4l.4-2.4a7.5 7.5 0 0 0 2.2-1.3l2.4 1 2-3.4-2-1.6c.1-.4.1-.9.1-1.3z',
  bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9zM13.7 21a2 2 0 0 1-3.4 0',
  chevronDown: 'M6 9l6 6 6-6',
  chevronRight: 'M9 6l6 6-6 6',
  eye: 'M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7zm11 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  copy: 'M9 9h10v10H9V9zM5 15V5h10',
  check: 'M5 12.5l4.5 4.5L19 7',
  shield: 'M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6l8-3zm-3.5 9 2.5 2.5 4.5-5',
};

export default function Icon({ name, size = 18, className = '' }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={d} />
    </svg>
  );
}
