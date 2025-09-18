import React from "react";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";

function App() {
  return (
    <div>
      <h1>Auth Demo</h1>
      <SignupForm />
      <hr />
      <LoginForm />
    </div>
  );
}

export default App;
