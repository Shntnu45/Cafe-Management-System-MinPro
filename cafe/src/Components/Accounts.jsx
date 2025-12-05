import { useState } from "react";
import { Login } from "./Login";
import { Signup } from "./Signup";

export function Account() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "450px" }}>
        <h2 className="text-center mb-4">
          {isLogin ? "Login Account" : "Create Account"}
        </h2>

        {isLogin ? <Login /> : <Signup />}

        <div className="text-center mt-3">
          {isLogin ? (
            <p>
              Don’t have an account?{" "}
              <button
                className="btn btn-link p-0"
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                className="btn btn-link p-0"
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
