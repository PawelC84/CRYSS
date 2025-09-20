import React, { useState } from 'react';
import { analyzeBudget, BudgetAnalysis } from '../openai';

export default function BudgetingAI() {
  const [expenses, setExpenses] = useState('');
  const [income, setIncome] = useState('');
  const [analysis, setAnalysis] = useState<BudgetAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!expenses.trim()) return;
    
    setLoading(true);
    try {
      const result = await analyzeBudget(expenses, income || undefined);
      setAnalysis(result);
    } catch (error) {
      alert('Error analyzing budget: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="budgeting-container">
      <h2>🏦 Personal Budget AI Assistant</h2>
      
      <div className="input-section">
        <div className="input-group">
          <label htmlFor="income">Monthly Income (optional):</label>
          <input
            id="income"
            type="text"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="e.g., $5000"
            className="input-field"
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="expenses">Monthly Expenses:</label>
          <textarea
            id="expenses"
            value={expenses}
            onChange={(e) => setExpenses(e.target.value)}
            placeholder="List your expenses, e.g.:
Rent: $1200
Groceries: $400
Gas: $150
Dining out: $200
Utilities: $100"
            className="textarea-field"
            rows={8}
          />
        </div>
        
        <button 
          onClick={handleAnalyze}
          disabled={loading || !expenses.trim()}
          className="analyze-button"
        >
          {loading ? 'Analyzing...' : '🤖 Analyze My Budget'}
        </button>
      </div>

      {analysis && (
        <div className="analysis-results">
          <h3>📊 Budget Analysis</h3>
          
          <div className="total-expenses">
            <strong>Total Monthly Expenses: ${analysis.totalExpenses}</strong>
          </div>

          <div className="category-breakdown">
            <h4>Category Breakdown:</h4>
            <ul>
              {Object.entries(analysis.categoryBreakdown).map(([category, amount]) => (
                <li key={category}>
                  <span className="category">{category}:</span> 
                  <span className="amount">${amount}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="recommendations">
            <h4>💡 AI Recommendations:</h4>
            <ul>
              {analysis.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>

          <div className="savings-goals">
            <h4>🎯 Savings Goals:</h4>
            <ul>
              {analysis.savingsGoals.map((goal, index) => (
                <li key={index}>{goal}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}