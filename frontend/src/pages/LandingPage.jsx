import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import tuxImage from "../assets/tux w bow.png";
import connectImage from "../assets/landing/connect.jpg";
import analyseImage from "../assets/landing/analyse.jpg";
import solutionsImage from "../assets/landing/solutions.jpg";
import trackImage from "../assets/landing/track.jpg";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

function LandingPage() {
  const [heroRef, heroVisible] = useScrollAnimation(0.2);
  const [featuresRef, featuresVisible] = useScrollAnimation(0.2);
  const [processRef, processVisible] = useScrollAnimation(0.2);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header isLanding={true} />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className={`flex flex-col items-center justify-center py-20 px-6 transition-all duration-1000 ease-out ${
          heroVisible 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-10'
        }`}
      >
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            Your Project's Sixth<br />
            Sense
          </h1>
          
          <div className="flex justify-center space-x-4 mb-16">
            <Link to="/signup">
              <button className="px-6 py-3 bg-white text-black rounded hover:bg-gray-200 transition-colors font-medium">
                Get started
              </button>
            </Link>
            <Link to="/login">
              <button className="px-6 py-3 border border-gray-600 text-white rounded hover:bg-gray-800 transition-colors">
                Sign in
              </button>
            </Link>
          </div>

          {/* Suit/Tuxedo Illustration */}
          <div className="flex justify-center mb-20">
            <div className="w-[864px] h-[864px] md:w-[1125px] md:h-[1125px] flex items-center justify-center">
              <img 
                src={tuxImage} 
                alt="Elegant tuxedo with bow tie" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        ref={featuresRef}
        className={`py-20 px-6 transition-all duration-1000 ease-out ${
          featuresVisible 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
            {/* Title on the left */}
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h2 className="text-3xl font-bold">What's Under the Hood</h2>
            </div>
            
            {/* Cards on the right */}
            <div className="lg:w-1/2 grid grid-cols-1 gap-6">
              {/* Real-time Risk Detection */}
              <div 
                className={`bg-white text-black p-6 rounded-lg transition-all duration-1000 ease-out delay-200 ${
                  featuresVisible 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-10'
                }`}
              >
                <div className="text-2xl mb-3">⚡</div>
                <h3 className="font-bold mb-2">Real-time Risk Detection</h3>
                <p className="text-sm text-gray-600">Monitor your projects continuously with AI-powered analysis</p>
              </div>

              {/* Smart Mitigation Plans */}
              <div 
                className={`bg-white text-black p-6 rounded-lg transition-all duration-1000 ease-out delay-300 ${
                  featuresVisible 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-10'
                }`}
              >
                <div className="text-2xl mb-3">🔮</div>
                <h3 className="font-bold mb-2">Smart Mitigation Plans</h3>
                <p className="text-sm text-gray-600">Get personalized recommendations based on historical data</p>
              </div>

              {/* Predictive Analytics */}
              <div 
                className={`bg-white text-black p-6 rounded-lg transition-all duration-1000 ease-out delay-500 ${
                  featuresVisible 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-10'
                }`}
              >
                <div className="text-2xl mb-3">📈</div>
                <h3 className="font-bold mb-2">Predictive Analytics</h3>
                <p className="text-sm text-gray-600">Identify potential issues before they impact your timeline</p>
              </div>

              {/* Data-Driven Insights */}
              <div 
                className={`bg-white text-black p-6 rounded-lg transition-all duration-1000 ease-out delay-700 ${
                  featuresVisible 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-10'
                }`}
              >
                <div className="text-2xl mb-3">📊</div>
                <h3 className="font-bold mb-2">Data-Driven Insights</h3>
                <p className="text-sm text-gray-600">Learn from past project patterns to improve future outcomes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section 
        ref={processRef}
        className={`py-20 px-6 transition-all duration-1000 ease-out ${
          processVisible 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Connect Your Project Data */}
            <div 
              className={`bg-white text-black p-6 rounded-lg transition-all duration-1000 ease-out delay-200 ${
                processVisible 
                  ? 'opacity-100 transform translate-y-0' 
                  : 'opacity-0 transform translate-y-10'
              }`}
            >
              <div className="h-72 rounded mb-4 overflow-hidden">
                <img 
                  src={connectImage} 
                  alt="Connect Your Project Data" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-3">Connect Your Project Data</h3>
              <p className="text-base text-gray-600">Import or input project information</p>
            </div>

            {/* AI Analysis */}
            <div 
              className={`bg-white text-black p-6 rounded-lg transition-all duration-1000 ease-out delay-400 ${
                processVisible 
                  ? 'opacity-100 transform translate-y-0' 
                  : 'opacity-0 transform translate-y-10'
              }`}
            >
              <div className="h-72 rounded mb-4 overflow-hidden">
                <img 
                  src={analyseImage} 
                  alt="AI Analysis" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Analysis</h3>
              <p className="text-base text-gray-600">Our system analyzes risks in real-time</p>
            </div>

            {/* Get Solutions */}
            <div 
              className={`bg-white text-black p-6 rounded-lg transition-all duration-1000 ease-out delay-600 ${
                processVisible 
                  ? 'opacity-100 transform translate-y-0' 
                  : 'opacity-0 transform translate-y-10'
              }`}
            >
              <div className="h-72 rounded mb-4 overflow-hidden">
                <img 
                  src={solutionsImage} 
                  alt="Get Solutions" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-3">Get Solutions</h3>
              <p className="text-base text-gray-600">Receive actionable mitigation strategies</p>
            </div>

            {/* Track Progress */}
            <div 
              className={`bg-white text-black p-6 rounded-lg transition-all duration-1000 ease-out delay-800 ${
                processVisible 
                  ? 'opacity-100 transform translate-y-0' 
                  : 'opacity-0 transform translate-y-10'
              }`}
            >
              <div className="h-72 rounded mb-4 overflow-hidden">
                <img 
                  src={trackImage} 
                  alt="Track Progress" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-3">Track Progress</h3>
              <p className="text-base text-gray-600">Monitor improvements and prevent future risks</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default LandingPage;
