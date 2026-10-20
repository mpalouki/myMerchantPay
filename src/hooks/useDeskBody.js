import { useEffect } from 'react';

// Marks <body> with .desk while the component is mounted: the merchant portal's look
// (styles/_desk.scss) for the logged-in space and the login/registration pages, including the
// modals they portal to <body>. The showcase site keeps its own look.
export function useDeskBody() {
  useEffect(() => {
    document.body.classList.add('desk');
    return () => document.body.classList.remove('desk');
  }, []);
}
