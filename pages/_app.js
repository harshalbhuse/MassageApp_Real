import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    import('bootstrap/dist/js/bootstrap');
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('user_id');
      if (!userId && router.pathname !== '/login') {
        router.replace('/login');
        setAuthChecked(false);
      } else if (userId && router.pathname === '/login') {
        router.replace('/');
        setAuthChecked(false);
      } else {
        setAuthChecked(true);
      }
    }
  }, [router.pathname]);

  if (!authChecked && router.pathname !== '/login') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return <Component {...pageProps} />;
}

export default MyApp; 