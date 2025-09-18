import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to SuitX</h1>
      <p className="mb-8 text-gray-600">Your secure login and signup portal</p>
      <div className="flex space-x-4">
        <Link to="/login">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
