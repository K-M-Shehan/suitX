import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RiskService from "../services/RiskService";

export default function RiskHistoryPage() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter options for history (only completed states)
  const historyFilters = [
    { key: "All", label: "All History", color: "gray" },
    { key: "RESOLVED", label: "Resolved", color: "green" },
    { key: "ACCEPTED", label: "Accepted", color: "purple" },
    { key: "IGNORED", label: "Ignored", color: "gray" },
  ];

  // Load risks on mount
  useEffect(() => {
    fetchHistoricalRisks();
  }, []);

  const fetchHistoricalRisks = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch all risks for the current user
      const allRisks = await RiskService.getRisksForUser();
      
      // Filter only historical statuses (RESOLVED, ACCEPTED, IGNORED)
      const historicalRisks = allRisks.filter(risk => 
        risk.status === "RESOLVED" || 
        risk.status === "ACCEPTED" || 
        risk.status === "IGNORED"
      );
      
      setRisks(historicalRisks);
    } catch (err) {
      console.error("Failed to load risk history:", err);
      setError("Failed to load risk history. Please login to view your data.");
    } finally {
      setLoading(false);
    }
  };

  // Filter risks based on selected filter
  const filteredRisks = risks.filter(risk => {
    // Filter by status
    const statusMatch = selectedFilter === "All" || risk.status === selectedFilter;
    
    // Filter by search query
    const searchMatch = 
      !searchQuery ||
      risk.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.projectName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && searchMatch;
  });

  // Group risks by status for summary
  const riskSummary = {
    total: risks.length,
    resolved: risks.filter(r => r.status === "RESOLVED").length,
    accepted: risks.filter(r => r.status === "ACCEPTED").length,
    ignored: risks.filter(r => r.status === "IGNORED").length,
  };

  const handleRiskClick = (riskId) => {
    navigate(`/risks/${riskId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "RESOLVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "ACCEPTED":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "IGNORED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "CRITICAL":
        return "text-red-600 bg-red-50";
      case "HIGH":
        return "text-orange-600 bg-orange-50";
      case "MEDIUM":
        return "text-yellow-600 bg-yellow-50";
      case "LOW":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading risk history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 bg-gray-50">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-2 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-2xl font-semibold text-gray-900">Risk History</h1>
          </div>
          <button
            onClick={() => navigate("/risks")}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            ← Back to Active Risks
          </button>
        </div>
        <p className="text-gray-600">View and manage completed, accepted, and ignored risks</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-red-400 mt-0.5 mr-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800">{error}</p>
              <button
                onClick={fetchHistoricalRisks}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total History</p>
              <p className="text-3xl font-bold text-gray-900">{riskSummary.total}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 mb-1">Resolved</p>
              <p className="text-3xl font-bold text-green-700">{riskSummary.resolved}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 mb-1">Accepted</p>
              <p className="text-3xl font-bold text-purple-700">{riskSummary.accepted}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ignored</p>
              <p className="text-3xl font-bold text-gray-700">{riskSummary.ignored}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {historyFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter.key
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
                {filter.key !== "All" && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-white bg-opacity-30 text-xs">
                    {filter.key === "RESOLVED" && riskSummary.resolved}
                    {filter.key === "ACCEPTED" && riskSummary.accepted}
                    {filter.key === "IGNORED" && riskSummary.ignored}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search risks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Risks List */}
      {filteredRisks.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRisks.map((risk, index) => (
            <div
              key={risk.id || index}
              className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleRiskClick(risk.id)}
            >
              {/* Risk Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{risk.title || "Untitled Risk"}</h3>
                    {risk.aiGenerated && (
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800 border border-purple-300">
                        AI
                      </span>
                    )}
                  </div>
                  {risk.projectName && (
                    <div className="flex items-center gap-1 mb-2">
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300">
                        📁 {risk.projectName}
                      </span>
                    </div>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(risk.status)}`}>
                  {risk.status}
                </span>
              </div>

              {/* Risk Description */}
              <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                {risk.description || "No description available"}
              </p>

              {/* Risk Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Severity:</span>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${getSeverityColor(risk.severity)}`}>
                    {risk.severity || "Unknown"}
                  </span>
                </div>
                {risk.riskScore && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Risk Score:</span>
                    <span className="px-2 py-1 rounded-md text-xs font-bold bg-gray-800 text-white">
                      {risk.riskScore}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Type:</span>
                  <span className="font-medium text-gray-900">{risk.type || "N/A"}</span>
                </div>
              </div>

              {/* Timeline Information */}
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Identified</p>
                    <p>{formatDate(risk.identifiedDate || risk.createdAt)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700 mb-1">
                      {risk.status === "RESOLVED" ? "Resolved" : "Updated"}
                    </p>
                    <p>{formatDate(risk.resolvedAt || risk.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* View Details Button */}
              <div className="mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRiskClick(risk.id);
                  }}
                  className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-12 shadow-sm border text-center">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Historical Risks Found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery
              ? "No risks match your search criteria. Try a different search term."
              : "You don't have any resolved, accepted, or ignored risks yet."}
          </p>
          <button
            onClick={() => navigate("/risks")}
            className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
          >
            View Active Risks
          </button>
        </div>
      )}
    </div>
  );
}
