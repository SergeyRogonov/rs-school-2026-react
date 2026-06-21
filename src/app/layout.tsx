import '../index.css';
import { Providers } from './providers';
import ErrorBoundary from '../components/ErrorBoundary';
import Header from '../components/Header';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ErrorBoundary>
            <Header />
            {children}
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
