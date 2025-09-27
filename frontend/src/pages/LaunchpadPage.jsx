import React from "react";

function LaunchpadPage() {
  return (
    <div className="flex-1 p-8 bg-gray-50">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Launchpad</h1>
      </div>
      
      {/* Projects Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Projects</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {/* Add Project Card */}
          <button className="bg-gray-300 rounded-lg h-32 p-4 hover:bg-gray-400 transition-colors flex items-center justify-center group">
            <svg 
              className="w-12 h-12 text-gray-600 group-hover:text-gray-700 transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          
          {/* Project Cards */}
          <div className="bg-gray-300 rounded-lg h-32"></div>
          <div className="bg-gray-300 rounded-lg h-32"></div>
        </div>
      </section>

      {/* Risks Section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Risks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Risk Card 1 - Scope Creep */}
          <div className="bg-purple-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Scope Creep</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. 
              Quisque faucibus ex sapien vitae pellentesque sem placerat. 
              In id cursus mi pretium tellus duis convallis.
            </p>
            <div className="flex space-x-3">
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                Resolve
              </button>
              <button className="text-gray-500 hover:text-gray-600 font-medium text-sm">
                Ignore
              </button>
            </div>
          </div>

          {/* Risk Card 2 - Frontend Int. */}
          <div className="bg-purple-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Frontend Int.</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. 
              Quisque faucibus ex sapien vitae pellentesque sem placerat. 
              In id cursus mi pretium tellus duis convallis.
            </p>
            <div className="flex space-x-3">
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                Resolve
              </button>
              <button className="text-gray-500 hover:text-gray-600 font-medium text-sm">
                Ignore
              </button>
            </div>
          </div>

          {/* Risk Card 3 - Deployment */}
          <div className="bg-purple-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Deployment</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. 
              Quisque faucibus ex sapien vitae pellentesque sem placerat. 
              In id cursus mi pretium tellus duis convallis.
            </p>
            <div className="flex space-x-3">
              <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                Resolve
              </button>
              <button className="text-gray-500 hover:text-gray-600 font-medium text-sm">
                Ignore
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LaunchpadPage;