import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Detail from './components/Detail';
import About from './components/About';
import ErrorBoundary from './components/ErrorBoundary';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter basename="/rs-school-2026-react/">
        <div className="h-auto w-full min-h-screen bg-[#d6fff2]">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="/" element={<Detail />}></Route>
                <Route path="/about" element={<About />}></Route>
              </Route>
            </Routes>
          </ErrorBoundary>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
