import type { AppProps } from 'next/app';
import '../styles/globals.css';
import AuthGuard from '../components/AuthGuard';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthGuard>
      <Component {...pageProps} />
    </AuthGuard>
  );
}

export default MyApp;