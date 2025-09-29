import React, { useState } from 'react';

const ApiTest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testApi = async (endpoint, name) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResults(prev => ({ ...prev, [name]: { success: true, data, count: Array.isArray(data) ? data.length : 1 } }));
    } catch (error) {
      setResults(prev => ({ ...prev, [name]: { success: false, error: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  const tests = [
    { endpoint: '/projects', name: 'Projects' },
    { endpoint: '/risks', name: 'Risks' },
    { endpoint: '/mitigations', name: 'Mitigations' },
    { endpoint: '/risks/summary', name: 'Risk Summary' },
    { endpoint: '/mitigations/summary', name: 'Mitigation Summary' }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">API Connection Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {tests.map((test) => (
          <button
            key={test.name}
            onClick={() => testApi(test.endpoint, test.name)}
            disabled={loading}
            className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Test {test.name}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {Object.entries(results).map(([name, result]) => (
          <div key={name} className={`p-4 rounded-lg ${
            result.success ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'
          } border`}>
            <h3 className="font-bold text-lg mb-2">
              {name} {result.success ? '✅' : '❌'}
            </h3>
            {result.success ? (
              <div>
                <p className="text-green-800 mb-2">Success! Found {result.count} items</p>
                <pre className="text-xs bg-white p-2 rounded overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-red-800">Error: {result.error}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiTest;