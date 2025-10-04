# SuitX AI Integration Setup Guide

## 🤖 Google Gemini AI Integration

### Step 1: Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 2: Configure Environment Variables

Create a `.env` file in the backend directory:
```bash
cd backend
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

Or set as system environment variable:
```bash
# Windows PowerShell
$env:GEMINI_API_KEY="your_api_key_here"

# Windows Command Prompt
set GEMINI_API_KEY=your_api_key_here

# Linux/Mac
export GEMINI_API_KEY="your_api_key_here"
```

### Step 3: Test the Integration

1. Start the backend server:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. Open the AI test page:
   - Start HTTP server: `cd frontend && python -m http.server 3000`
   - Open: http://localhost:3000/ai-test.html

3. Or use the React application (after fixing Node.js version):
   ```bash
   cd frontend
   npm run dev
   ```

### API Endpoints

#### Analyze Project Risks
```http
POST http://localhost:8080/api/ai/analyze-project
Content-Type: application/json

{
  "projectName": "E-commerce Platform",
  "projectType": "Web Application",
  "projectDescription": "Building a comprehensive e-commerce platform...",
  "timeline": "3-6 months",
  "teamSize": 8,
  "budget": "Medium",
  "complexity": "MEDIUM",
  "technologyStack": "React, Spring Boot, MongoDB",
  "specificConcerns": "Scalability and security concerns"
}
```

#### Response Format
```json
{
  "analysisId": "uuid",
  "timestamp": "2025-10-04T11:22:44.677+05:30",
  "projectInsights": {
    "overallRiskLevel": "MEDIUM",
    "successProbability": "75%",
    "keyFindings": "Project has moderate complexity..."
  },
  "identifiedRisks": [
    {
      "riskId": "RISK_001",
      "title": "Scalability Issues During Peak Load",
      "description": "E-commerce platforms face significant...",
      "category": "TECHNICAL",
      "priority": "HIGH",
      "probability": 70.0,
      "impact": "HIGH"
    }
  ],
  "suggestedMitigations": [
    {
      "mitigationId": "MIT_001",
      "title": "Implement Auto-Scaling Infrastructure",
      "description": "Set up cloud-based auto-scaling...",
      "type": "PREVENTIVE",
      "implementationEffort": "MEDIUM",
      "timelineWeeks": "3-4 weeks",
      "costEstimate": "$5,000-10,000"
    }
  ]
}
```

### Features Implemented

✅ **Backend Services**
- GeminiAIService with sophisticated prompt engineering
- AIController with REST endpoints
- Complete DTO architecture
- Error handling and validation

✅ **Frontend Components**
- AIAssistant modal component
- Integration with MitigationPage
- Beautiful UI with loading states
- Results visualization

✅ **AI Capabilities**
- Project risk analysis
- Risk categorization and prioritization
- Mitigation strategy generation
- Success probability assessment

### Cost Information

- **Google Gemini 1.5 Flash**: Free tier includes 1,500 requests per day
- **Cost per request**: $0 (within free tier limits)
- **Rate limits**: 15 RPM for free tier
- **Context window**: 1M tokens

### Troubleshooting

1. **Backend not starting**: Check Java version (requires Java 17+)
2. **MongoDB connection issues**: Verify Atlas connection string
3. **AI API errors**: Ensure GEMINI_API_KEY is set correctly
4. **CORS issues**: Backend includes CORS configuration
5. **Frontend Vite issues**: Downgrade to Vite 5.x for Node.js 20.17.0

### Next Steps

1. Set up your Gemini API key
2. Test the AI integration using the test page
3. Integrate with the main React application
4. Customize prompts for your specific use case
5. Add more sophisticated risk analysis logic

## 🎯 Ready to Use!

Your AI-powered project risk analysis system is fully implemented and ready to help project managers assess risks and generate mitigation strategies!