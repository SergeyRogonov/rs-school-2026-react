import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Detail from './components/Detail';
import About from './components/About';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './components/NotFound';

export default function App() {
  return (
    <BrowserRouter basename="/rs-school-2026-react/">
      <div className="h-auto w-full min-h-screen bg-[#d6fff2]">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Detail />}></Route>
              <Route path="/about" element={<About />}></Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </BrowserRouter>
  );
}
