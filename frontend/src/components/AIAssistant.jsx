import React, { useState } from 'react';
import { analyzeProjectRisks, validateAnalysisRequest, createDefaultAnalysisRequest } from '../services/AIService';

const AIAssistant = ({ isOpen, onClose, onResultsGenerated }) => {
  const [analysisRequest, setAnalysisRequest] = useState(createDefaultAnalysisRequest());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [currentStep, setCurrentStep] = useState('input'); // 'input', 'analyzing', 'results'

  const handleInputChange = (field, value) => {
    setAnalysisRequest(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
  };

  const handleAnalyze = async () => {
    try {
      setError(null);
      
      // Validate request
      const validationErrors = validateAnalysisRequest(analysisRequest);
      if (validationErrors.length > 0) {
        setError(validationErrors.join(', '));
        return;
      }

      setLoading(true);
      setCurrentStep('analyzing');
      
      // Call AI service
      const response = await analyzeProjectRisks(analysisRequest);
      
      setResults(response);
      setCurrentStep('results');
      
      // Notify parent component
      if (onResultsGenerated) {
        onResultsGenerated(response);
      }
      
    } catch (err) {
      setError(err.message || 'Failed to analyze project risks');
      setCurrentStep('input');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep('input');
    setResults(null);
    setError(null);
    setAnalysisRequest(createDefaultAnalysisRequest());
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">AI Risk Analyzer</h2>
              <p className="text-sm text-gray-600">Powered by Google Gemini</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 'input' && (
            <InputForm
              analysisRequest={analysisRequest}
              onInputChange={handleInputChange}
              onAnalyze={handleAnalyze}
              loading={loading}
              error={error}
            />
          )}

          {currentStep === 'analyzing' && (
            <AnalyzingState />
          )}

          {currentStep === 'results' && results && (
            <ResultsDisplay
              results={results}
              onReset={handleReset}
              onClose={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Input Form Component
const InputForm = ({ analysisRequest, onInputChange, onAnalyze, loading, error }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Project Risk Analysis</h3>
      <p className="text-gray-600">Provide project details for AI-powered risk assessment and mitigation strategies</p>
    </div>

    {error && (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div className="ml-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
        <input
          type="text"
          value={analysisRequest.projectName}
          onChange={(e) => onInputChange('projectName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Enter project name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
        <select
          value={analysisRequest.projectType}
          onChange={(e) => onInputChange('projectType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="Software Development">Software Development</option>
          <option value="Web Application">Web Application</option>
          <option value="Mobile Application">Mobile Application</option>
          <option value="Data Analysis">Data Analysis</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Research">Research</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
        <select
          value={analysisRequest.timeline}
          onChange={(e) => onInputChange('timeline', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="1-3 months">1-3 months</option>
          <option value="3-6 months">3-6 months</option>
          <option value="6-12 months">6-12 months</option>
          <option value="1+ years">1+ years</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
        <input
          type="number"
          min="1"
          max="1000"
          value={analysisRequest.teamSize}
          onChange={(e) => onInputChange('teamSize', parseInt(e.target.value) || 5)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Number of team members"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
        <select
          value={analysisRequest.budget}
          onChange={(e) => onInputChange('budget', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="Low">Low (&lt; $50K)</option>
          <option value="Medium">Medium ($50K - $200K)</option>
          <option value="High">High ($200K - $1M)</option>
          <option value="Very High">Very High (&gt; $1M)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Complexity</label>
        <select
          value={analysisRequest.complexity}
          onChange={(e) => onInputChange('complexity', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Project Description *</label>
      <textarea
        value={analysisRequest.projectDescription}
        onChange={(e) => onInputChange('projectDescription', e.target.value)}
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder="Provide a detailed description of your project, including goals, scope, and key features..."
      />
      <p className="text-xs text-gray-500 mt-1">
        {analysisRequest.projectDescription.length} characters (minimum 50 recommended)
      </p>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Technology Stack</label>
      <input
        type="text"
        value={analysisRequest.technologyStack}
        onChange={(e) => onInputChange('technologyStack', e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder="e.g., React, Node.js, MongoDB, AWS"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Specific Concerns (Optional)</label>
      <textarea
        value={analysisRequest.specificConcerns}
        onChange={(e) => onInputChange('specificConcerns', e.target.value)}
        rows={2}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder="Any specific risks or concerns you want the AI to focus on..."
      />
    </div>

    <div className="flex justify-end space-x-4 pt-4">
      <button
        onClick={onAnalyze}
        disabled={loading}
        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        <span>{loading ? 'Analyzing...' : 'Analyze Risks'}</span>
      </button>
    </div>
  </div>
);

// Analyzing State Component  
const AnalyzingState = () => (
  <div className="text-center py-12">
    <div className="flex justify-center mb-6">
      <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
        <svg className="w-8 h-8 text-white animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your Project</h3>
    <p className="text-gray-600 mb-4">AI is evaluating potential risks and generating mitigation strategies...</p>
    <div className="flex justify-center space-x-2">
      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  </div>
);

// Results Display Component
const ResultsDisplay = ({ results, onReset, onClose }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Analysis Complete</h3>
      <p className="text-gray-600">AI has identified {results.identifiedRisks?.length || 0} risks and generated {results.suggestedMitigations?.length || 0} mitigation strategies</p>
    </div>

    {/* Project Insights */}
    {results.projectInsights && (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-700">Overall Risk Level:</span>
            <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
              results.projectInsights.overallRiskLevel === 'LOW' ? 'bg-green-100 text-green-800' :
              results.projectInsights.overallRiskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
              results.projectInsights.overallRiskLevel === 'HIGH' ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            }`}>
              {results.projectInsights.overallRiskLevel}
            </span>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">Success Probability:</span>
            <span className="ml-2 text-sm text-gray-900">{results.projectInsights.successProbability}</span>
          </div>
        </div>
      </div>
    )}

    {/* Identified Risks */}
    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Identified Risks</h4>
      <div className="space-y-4 max-h-60 overflow-y-auto">
        {results.identifiedRisks?.map((risk, index) => (
          <div key={risk.riskId || index} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h5 className="font-medium text-gray-900">{risk.title}</h5>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  risk.priority === 'LOW' ? 'bg-green-100 text-green-800' :
                  risk.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                  risk.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {risk.priority}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                  {Math.round(risk.probability)}%
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
            <div className="text-xs text-gray-500">
              Category: {risk.category} | Impact: {risk.impact}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Mitigation Strategies */}
    <div>
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Recommended Mitigations</h4>
      <div className="space-y-4 max-h-60 overflow-y-auto">
        {results.suggestedMitigations?.map((mitigation, index) => (
          <div key={mitigation.mitigationId || index} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h5 className="font-medium text-gray-900">{mitigation.title}</h5>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                mitigation.implementationEffort === 'LOW' ? 'bg-green-100 text-green-800' :
                mitigation.implementationEffort === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {mitigation.implementationEffort} Effort
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{mitigation.description}</p>
            <div className="text-xs text-gray-500">
              Type: {mitigation.type} | Timeline: {mitigation.timelineWeeks} | Cost: {mitigation.costEstimate}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex justify-between pt-4 border-t border-gray-200">
      <button
        onClick={onReset}
        className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        Analyze Another Project
      </button>
      <div className="space-x-3">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 text-purple-700 border border-purple-300 rounded-md hover:bg-purple-50 transition-colors"
        >
          Export Report
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default AIAssistant;