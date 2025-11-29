import React from 'react';
import './App.css';
import SymptomChecker from './components/SymptomChecker';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Symptom Checker</h1>
        <p>Get quick health insights based on your symptoms</p>
      </header>
      <main>
        <SymptomChecker />
      </main>
    </div>
  );
}

export default App;
