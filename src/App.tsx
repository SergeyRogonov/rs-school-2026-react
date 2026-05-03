import './App.css';
import React from 'react';
import Layout from './components/Layout';

class App extends React.Component {
  render() {
    return (
      <div className="h-auto w-full min-h-screen bg-[#d6fff2]">
        <Layout />
      </div>
    );
  }
}

export default App;
