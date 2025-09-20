// Secure API client that calls our backend server instead of exposing OpenAI keys to the browser

export interface BudgetAnalysis {
  totalExpenses: number;
  categoryBreakdown: Record<string, number>;
  recommendations: string[];
  savingsGoals: string[];
}

export interface VehicleRecommendation {
  make: string;
  model: string;
  year: number;
  priceRange: string;
  fuelEconomy: string;
  reliability: string;
  reasoning: string;
}

// Use the same domain but different port for the AI server in Replit
const API_BASE_URL = import.meta.env.DEV ? `${window.location.protocol}//${window.location.hostname}:3001` : '';

export async function analyzeBudget(expenses: string, income?: string): Promise<BudgetAnalysis> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/budget`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expenses, income }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to analyze budget');
    }

    return await response.json();
  } catch (error) {
    throw new Error("Failed to analyze budget: " + (error as Error).message);
  }
}

export async function searchVehicles(preferences: string, budget?: string): Promise<VehicleRecommendation[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ preferences, budget }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to search vehicles');
    }

    return await response.json();
  } catch (error) {
    throw new Error("Failed to search vehicles: " + (error as Error).message);
  }
}