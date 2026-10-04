import { useState } from 'react';
import { useLocation } from 'react-router-dom';

// Open state of a header's mobile menu panel. It remembers the page it was opened on, so
// navigating to another page closes it without an effect.
export function useMobileMenu() {
  const { pathname } = useLocation();
  const [openOn, setOpenOn] = useState(null);
  const open = openOn === pathname;

  return { open, toggle: () => setOpenOn(open ? null : pathname) };
}
