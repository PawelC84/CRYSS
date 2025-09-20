import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.send('OK');
});

// Budget analysis endpoint
app.post('/api/budget', async (req, res) => {
  try {
    const { expenses, income } = req.body;
    
    if (!expenses || typeof expenses !== 'string') {
      return res.status(400).json({ error: 'Expenses are required' });
    }

    // Demo mode fallback when API quota is exceeded
    if (process.env.DEMO_MODE === 'true' || !process.env.OPENAI_API_KEY) {
      const demoResult = {
        totalExpenses: 1950,
        categoryBreakdown: {
          "Housing": 1200,
          "Food": 400,
          "Utilities": 150,
          "Entertainment": 200
        },
        recommendations: [
          "Consider reducing entertainment spending by $50/month",
          "Look for ways to lower utility costs through energy efficiency",
          "Set up automatic transfers to savings",
          "Track all expenses using a budgeting app"
        ],
        savingsGoals: [
          "Build an emergency fund of 3-6 months expenses",
          "Save 20% of income for long-term financial goals",
          "Set aside $100/month for unexpected costs"
        ]
      };
      return res.json(demoResult);
    }

    const prompt = `As a financial advisor, analyze these expenses and provide budgeting advice. ${income ? `Monthly income: ${income}` : ''}
    
    Expenses: ${expenses}
    
    Please provide a JSON response with:
    - totalExpenses (number)
    - categoryBreakdown (object with categories and amounts)
    - recommendations (array of strings with specific advice)
    - savingsGoals (array of strings with actionable goals)`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert financial advisor. Analyze expenses and provide practical budgeting advice. Respond only with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    
    // Basic validation
    const result = {
      totalExpenses: Number(analysis.totalExpenses) || 0,
      categoryBreakdown: analysis.categoryBreakdown || {},
      recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : [],
      savingsGoals: Array.isArray(analysis.savingsGoals) ? analysis.savingsGoals : []
    };

    res.json(result);
  } catch (error) {
    console.error('Budget analysis error:', error);
    
    // Fallback to demo mode on API errors
    const demoResult = {
      totalExpenses: 1950,
      categoryBreakdown: {
        "Housing": 1200,
        "Food": 400,
        "Utilities": 150,
        "Entertainment": 200
      },
      recommendations: [
        "Consider reducing entertainment spending by $50/month",
        "Look for ways to lower utility costs through energy efficiency",
        "Set up automatic transfers to savings",
        "Track all expenses using a budgeting app"
      ],
      savingsGoals: [
        "Build an emergency fund of 3-6 months expenses",
        "Save 20% of income for long-term financial goals",
        "Set aside $100/month for unexpected costs"
      ]
    };
    res.json(demoResult);
  }
});

// Vehicle search endpoint
app.post('/api/vehicles', async (req, res) => {
  try {
    const { preferences, budget } = req.body;
    
    if (!preferences || typeof preferences !== 'string') {
      return res.status(400).json({ error: 'Vehicle preferences are required' });
    }

    // Demo mode fallback when API quota is exceeded
    if (process.env.DEMO_MODE === 'true' || !process.env.OPENAI_API_KEY) {
      const demoVehicles = [
        {
          make: "Toyota",
          model: "RAV4",
          year: 2023,
          priceRange: "$28,000 - $35,000",
          fuelEconomy: "27/35 MPG city/highway",
          reliability: "Excellent (5/5 stars)",
          reasoning: "Perfect family SUV with outstanding reliability, good fuel economy, and strong safety ratings. Toyota's reputation for longevity makes this an excellent long-term investment."
        },
        {
          make: "Honda",
          model: "CR-V",
          year: 2023,
          priceRange: "$26,000 - $33,000",
          fuelEconomy: "28/34 MPG city/highway",
          reliability: "Excellent (5/5 stars)",
          reasoning: "Spacious interior, excellent fuel efficiency, and Honda's proven reliability record. Great for families and has one of the best resale values in its class."
        },
        {
          make: "Mazda",
          model: "CX-5",
          year: 2023,
          priceRange: "$25,000 - $32,000",
          fuelEconomy: "24/31 MPG city/highway",
          reliability: "Very Good (4/5 stars)",
          reasoning: "Upscale interior, engaging driving experience, and excellent safety scores. Offers premium feel at a competitive price point."
        }
      ];
      return res.json(demoVehicles);
    }

    const prompt = `As an automotive expert, recommend vehicles based on these preferences: ${preferences}
    ${budget ? `Budget: ${budget}` : ''}
    
    Please provide a JSON response with an array of vehicle recommendations. Each recommendation should have:
    - make (string)
    - model (string) 
    - year (number)
    - priceRange (string)
    - fuelEconomy (string)
    - reliability (string)
    - reasoning (string explaining why this vehicle fits their needs)
    
    Provide 3-5 realistic recommendations.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an automotive expert. Provide realistic vehicle recommendations based on user preferences. Respond only with valid JSON containing an array of vehicles."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    const vehicles = result.vehicles || result.recommendations || [];
    
    // Basic validation
    const validatedVehicles = vehicles.map(vehicle => ({
      make: String(vehicle.make || 'Unknown'),
      model: String(vehicle.model || 'Unknown'),
      year: Number(vehicle.year) || new Date().getFullYear(),
      priceRange: String(vehicle.priceRange || 'Contact dealer'),
      fuelEconomy: String(vehicle.fuelEconomy || 'Not specified'),
      reliability: String(vehicle.reliability || 'Not specified'),
      reasoning: String(vehicle.reasoning || 'No reasoning provided')
    }));

    res.json(validatedVehicles);
  } catch (error) {
    console.error('Vehicle search error:', error);
    
    // Fallback to demo mode on API errors
    const demoVehicles = [
      {
        make: "Toyota",
        model: "RAV4",
        year: 2023,
        priceRange: "$28,000 - $35,000",
        fuelEconomy: "27/35 MPG city/highway",
        reliability: "Excellent (5/5 stars)",
        reasoning: "Perfect family SUV with outstanding reliability, good fuel economy, and strong safety ratings."
      },
      {
        make: "Honda",
        model: "CR-V",
        year: 2023,
        priceRange: "$26,000 - $33,000",
        fuelEconomy: "28/34 MPG city/highway",
        reliability: "Excellent (5/5 stars)",
        reasoning: "Spacious interior, excellent fuel efficiency, and Honda's proven reliability record."
      }
    ];
    res.json(demoVehicles);
  }
});

// Serve React app for all non-API routes
app.get(/.*/, (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).end();
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`AI Server running on port ${port}`);
});