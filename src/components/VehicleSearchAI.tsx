import React, { useState } from 'react';
import { searchVehicles, VehicleRecommendation } from '../openai';

export default function VehicleSearchAI() {
  const [preferences, setPreferences] = useState('');
  const [budget, setBudget] = useState('');
  const [recommendations, setRecommendations] = useState<VehicleRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!preferences.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchVehicles(preferences, budget || undefined);
      setRecommendations(results);
    } catch (error) {
      alert('Error searching vehicles: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vehicle-search-container">
      <h2>🚗 Vehicle Search AI Assistant</h2>
      
      <div className="input-section">
        <div className="input-group">
          <label htmlFor="budget">Budget Range (optional):</label>
          <input
            id="budget"
            type="text"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g., $15,000 - $25,000"
            className="input-field"
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="preferences">Vehicle Preferences:</label>
          <textarea
            id="preferences"
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="Describe what you're looking for, e.g.:
- Need a reliable family SUV
- Good fuel economy for commuting
- Safe for teenagers to drive
- Low maintenance costs
- All-wheel drive for snow
- Spacious cargo area"
            className="textarea-field"
            rows={6}
          />
        </div>
        
        <button 
          onClick={handleSearch}
          disabled={loading || !preferences.trim()}
          className="search-button"
        >
          {loading ? 'Searching...' : '🔍 Find Vehicles'}
        </button>
      </div>

      {recommendations.length > 0 && (
        <div className="search-results">
          <h3>🎯 AI Vehicle Recommendations</h3>
          
          <div className="vehicles-grid">
            {recommendations.map((vehicle, index) => (
              <div key={index} className="vehicle-card">
                <h4>{vehicle.year} {vehicle.make} {vehicle.model}</h4>
                
                <div className="vehicle-details">
                  <div className="detail-item">
                    <span className="label">💰 Price Range:</span>
                    <span className="value">{vehicle.priceRange}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">⛽ Fuel Economy:</span>
                    <span className="value">{vehicle.fuelEconomy}</span>
                  </div>
                  
                  <div className="detail-item">
                    <span className="label">🔧 Reliability:</span>
                    <span className="value">{vehicle.reliability}</span>
                  </div>
                </div>
                
                <div className="reasoning">
                  <strong>Why this vehicle:</strong>
                  <p>{vehicle.reasoning}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}