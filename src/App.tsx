import './App.css';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="h-auto w-full min-h-screen bg-[#d6fff2]">
          <ErrorBoundary>
            <Layout />
          </ErrorBoundary>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
