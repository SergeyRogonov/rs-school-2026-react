import './App.css';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Detail from './components/Detail';
import About from './components/About';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './components/NotFound';
import Header from './components/Header';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/rs-school-2026-react/">
        <div className="h-auto w-full min-h-screen bg-(--bg-primary) text-(--text-primary)">
          <ErrorBoundary>
            <Header />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="/" element={<Detail />}></Route>
              </Route>
              <Route path="/about" element={<About />}></Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
