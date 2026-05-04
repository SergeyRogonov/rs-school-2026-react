import './App.css';
import React from 'react';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

class App extends React.Component {
  render() {
    return (
      <div className="h-auto w-full min-h-screen bg-[#d6fff2]">
        <ErrorBoundary>
          <Layout />
        </ErrorBoundary>
      </div>
    );
  }
}

export default App;
