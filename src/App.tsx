import React, { useState } from 'react';
import './App.css';
import BudgetingAI from './components/BudgetingAI';
import VehicleSearchAI from './components/VehicleSearchAI';

type Tab = 'budgeting' | 'vehicles';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('budgeting');

  return (
    <div className="app">
      <header className="app-header">
        <h1>🤖 Crystal's Slamcheeks Personal AI</h1>
        <p>Powered by GPT-5 for Budgeting & Vehicle Search</p>
      </header>

      <nav className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'budgeting' ? 'active' : ''}`}
          onClick={() => setActiveTab('budgeting')}
        >
          💰 Budget Assistant
        </button>
        <button 
          className={`tab-button ${activeTab === 'vehicles' ? 'active' : ''}`}
          onClick={() => setActiveTab('vehicles')}
        >
          🚗 Vehicle Search
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'budgeting' && <BudgetingAI />}
        {activeTab === 'vehicles' && <VehicleSearchAI />}
      </main>

      <footer className="app-footer">
        <p>AI-powered insights to help you make better financial and vehicle decisions</p>
      </footer>
    </div>
  );
}